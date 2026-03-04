# Netlify Forms Reference

Serverless form handling without backend code. Netlify automatically processes form submissions, stores data, and sends notifications.

## Basic HTML Form

```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <p>
    <label>Name: <input type="text" name="name" required /></label>
  </p>
  <p>
    <label>Email: <input type="email" name="email" required /></label>
  </p>
  <p>
    <label>Message: <textarea name="message" required></textarea></label>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>
```

**Required attributes:**
- `data-netlify="true"` - Enables Netlify form handling
- `name="form-name"` - Hidden input matching form name (for POST)

## JavaScript/React Forms

For JS-rendered forms, include a hidden HTML form for Netlify's build bot detection:

```html
<!-- Hidden form for Netlify detection (in index.html or static HTML) -->
<form name="contact" netlify netlify-honeypot="bot-field" hidden>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message"></textarea>
</form>
```

```jsx
// React component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'form-name': 'contact',
        ...formData
      }).toString()
    });

    if (response.ok) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <div className="success">Thanks! We will be in touch.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      {/* ... other fields */}
      <button type="submit">Send</button>
    </form>
  );
}
```

## AJAX Form Submission

```javascript
const form = document.querySelector('form');
const successMessage = document.createElement('p');
successMessage.textContent = 'Thank you for your submission!';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });

    if (response.ok) {
      // Replace form with success message safely
      form.replaceWith(successMessage);
    }
  } catch (error) {
    console.error('Form submission error:', error);
  }
});
```

## File Uploads

```html
<form name="upload" method="POST" data-netlify="true" enctype="multipart/form-data">
  <input type="hidden" name="form-name" value="upload" />
  <p>
    <label>File: <input type="file" name="attachment" /></label>
  </p>
  <p>
    <button type="submit">Upload</button>
  </p>
</form>
```

**Limits:**
- Maximum file size: 10 MB per file
- Maximum total submission size: 10 MB

## Spam Protection

### Honeypot Field

```html
<form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />

  <!-- Honeypot field - hidden from users, bots fill it -->
  <p class="hidden">
    <label>Do not fill this out: <input name="bot-field" /></label>
  </p>

  <!-- Real fields -->
  <p>
    <label>Email: <input type="email" name="email" required /></label>
  </p>
  <button type="submit">Submit</button>
</form>

<style>
  .hidden { display: none; }
</style>
```

### reCAPTCHA

```html
<form name="contact" method="POST" data-netlify="true" data-netlify-recaptcha="true">
  <input type="hidden" name="form-name" value="contact" />

  <!-- Form fields -->
  <p>
    <label>Email: <input type="email" name="email" required /></label>
  </p>

  <!-- reCAPTCHA widget renders here -->
  <div data-netlify-recaptcha="true"></div>

  <button type="submit">Submit</button>
</form>
```

## Success Pages

### Custom Success Page

```html
<form name="contact" method="POST" data-netlify="true" action="/success">
  <!-- Form fields -->
</form>
```

### Inline Success with React State

```jsx
function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: new URLSearchParams(new FormData(e.target)).toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <div>Thanks! We will be in touch soon.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

## Notifications

Configure in Netlify UI: **Site settings > Forms > Form notifications**

### Email Notifications

- Receive email for each submission
- Customize recipient, subject, and body
- Include form data in email

### Slack Notifications

- Post to Slack channel on submission
- Customize message format
- Include form field values

### Webhook Notifications

```
POST https://your-api.com/webhook
Content-Type: application/json

{
  "form_name": "contact",
  "form_id": "abc123",
  "site_url": "https://example.netlify.app",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!"
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Form Data API

Access submissions programmatically:

```bash
# List form submissions
curl -H "Authorization: Bearer $NETLIFY_TOKEN" \
  https://api.netlify.com/api/v1/forms/{form_id}/submissions

# Get specific submission
curl -H "Authorization: Bearer $NETLIFY_TOKEN" \
  https://api.netlify.com/api/v1/submissions/{submission_id}
```

## Configuration in netlify.toml

```toml
# Disable form detection (if not using Netlify Forms)
[build]
  ignore_forms = true
```

## Best Practices

1. **Always include hidden form-name**: Required for POST submissions
2. **Use honeypot for spam**: Simple, effective spam prevention
3. **Handle AJAX errors**: Show user-friendly error messages
4. **Validate client-side**: Improve UX with immediate feedback
5. **Keep forms simple**: Fewer fields = higher completion rates
6. **Test in deploy previews**: Forms work in preview deployments

## Limits

| Feature | Limit |
|---------|-------|
| Submissions/month (free) | 100 |
| Submissions/month (Pro) | 1,000 |
| File upload size | 10 MB |
| Total submission size | 10 MB |
| Form fields | No limit |

## Troubleshooting

### Form not detected
- Ensure `data-netlify="true"` attribute is present
- For JS apps, add hidden HTML form for detection
- Check build logs for form detection messages

### Submissions not appearing
- Verify `form-name` hidden input matches form name
- Check spam filter in Netlify UI
- Ensure POST request includes all required fields

### File upload failing
- Check file size (max 10 MB)
- Ensure `enctype="multipart/form-data"` is set
- Verify file input has `name` attribute

## Related

- [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)
- [Build Configuration](./build-configuration.md)
- [Edge Functions](./functions-edge.md)
