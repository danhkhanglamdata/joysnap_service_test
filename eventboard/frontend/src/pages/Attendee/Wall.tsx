import { useState, useCallback, useEffect } from 'react'
import { api } from '../../lib/api'
import { useSupabaseRealtime } from '../../hooks/useSupabaseRealtime'
import type { Session } from '../../hooks/useSession'

const VIBES = ['🔥', '😂', '😭', '✨', '👏', '🎉']

interface Post {
  id: string
  author_name: string
  content: string
  vibe_emoji: string
  created_at: string
}

interface WallProps {
  eventId: string
  posts: Post[]
  session: Session
}

export default function Wall({ eventId, posts, session }: WallProps) {
  const [content, setContent] = useState('')
  const [vibe, setVibe] = useState('🔥')
  const [posting, setPosting] = useState(false)
  const [localPosts, setLocalPosts] = useState<Post[]>([])

  // Sync external posts changes
  useEffect(() => {
    setLocalPosts(posts)
  }, [posts])

  // Realtime: listen for new posts
  const onNewPost = useCallback((payload: unknown) => {
    const p = payload as { post: Post; energy?: { current: number } }
    setLocalPosts(prev => [p.post, ...prev.slice(0, 49)])
  }, [])

  useSupabaseRealtime(eventId, { onNewPost })

  async function postMoment() {
    if (!content.trim() && vibe === '🔥') return

    // Optimistic update
    const tempPost: Post = {
      id: `temp_${Date.now()}`,
      author_name: session?.name || 'Bạn',
      content,
      vibe_emoji: vibe,
      created_at: new Date().toISOString(),
    }
    setLocalPosts(prev => [tempPost, ...prev])

    setPosting(true)
    try {
      await api.createPost(eventId, { content, vibe_emoji: vibe })
      setContent('')
    } catch (err) {
      // Remove optimistic post on error
      setLocalPosts(prev => prev.filter(p => p.id !== tempPost.id))
      console.error(err)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 12 }}>📸 Moment Wall</h3>

      {/* Post composer */}
      <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {VIBES.map(v => (
            <button
              key={v}
              onClick={() => setVibe(v)}
              style={{
                fontSize: 24,
                padding: 6,
                borderRadius: 8,
                background: vibe === v ? 'var(--primary)' : 'transparent',
                border: `2px solid ${vibe === v ? 'var(--primary)' : 'var(--border)'}`,
                lineHeight: 1,
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Chia sẻ khoảnh khắc của bạn..."
          onKeyDown={e => e.key === 'Enter' && postMoment()}
          style={{ marginBottom: 8 }}
        />
        <button className="btn-primary" onClick={postMoment} disabled={posting} style={{ width: '100%' }}>
          {posting ? '...' : '📤 Đăng ngay'}
        </button>
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto' }}>
        {localPosts.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Chưa có bài đăng nào. Hãy là người đầu tiên! 🎉</p>
        )}
        {localPosts.map(post => (
          <div key={post.id} style={{ display: 'flex', gap: 10, padding: 10, background: 'var(--bg)', borderRadius: 8 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{post.vibe_emoji}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{post.author_name}</div>
              {post.content && <div style={{ marginTop: 2 }}>{post.content}</div>}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {new Date(post.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
