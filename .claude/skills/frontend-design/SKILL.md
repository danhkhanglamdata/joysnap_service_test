---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality AND delivers perfectly matched real photos (Unsplash/Pexels) OR custom image-generation prompts. Use when building web components, pages, applications, OR when provided screenshots/designs to replicate. Zero AI slop.
license: Complete terms in LICENSE.txt
---

World-class creative frontend engineering AND visual direction. Every interface must feel like a $50k+ agency project.

## Input Types & Workflows

### When User Provides Screenshot/Image/Design Reference

**MANDATORY workflow**:
1. **Extract Design Guidelines**: colors (hex), typography, spacing, layout, visual hierarchy
2. **Implement Code**: exact colors, matched typography, replicated layout
3. **Verify Quality**: compare to original, check accuracy

### When Building from Scratch

Follow "Design Thinking" + "Aesthetic Styles" below.

---

## Aesthetic Styles Reference

| Style | Keywords | Colors | Signature Effects |
|-------|----------|--------|-------------------|
| Minimalism/Swiss | clean, grid-based, whitespace, typography-first | Monochrome + bold accent | Sharp hierarchy, micro-animations |
| Neumorphism | soft ui, embossed, subtle depth | Single pastel variations | Multi-layer soft shadows |
| Glassmorphism | frosted glass, translucent, blur | Aurora backgrounds + transparent whites | backdrop-filter: blur(), glowing borders |
| Brutalism | raw, asymmetric, high contrast | Harsh primaries, neon | Sharp corners, huge bold text |
| Claymorphism | clay, chunky 3D, bubbly, pastel | Candy pastels | Inner + outer shadows, squishy effects |
| Aurora/Mesh Gradient | luminous, flowing | Teal → purple → pink | Animated mesh gradients |
| Retro-Futurism/Cyberpunk | vaporwave, neon glow, glitch | Neon cyan/magenta on black | Scanlines, chromatic aberration |
| 3D Hyperrealism | metallic, WebGL, tactile | Rich metallics | Three.js, realistic lighting |
| Vibrant Block/Maximalist | bold blocks, duotone, geometric | Complementary brights | Scroll-snap, dramatic hover |
| Dark OLED Luxury | deep black, subtle glow, cinematic | #000000 + vibrant accents | Minimal glows, velvet textures |
| Organic/Biomorphic | fluid shapes, blobs, nature-inspired | Earthy/muted pastels | SVG morphing, gooey effects |

---

## Design Thinking

Before coding, commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available (Use `anime.js` for animations: `./references/animejs.md`). Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.
- **Visual Assets**: Use `media-processing` skill to process and optimize visual assets

---

## Perfect Images System

When design needs images (hero, background, cards, illustrations):

### Real-world Photography
Use ONLY real Unsplash → Pexels → Pixabay photos with DIRECT URLs:
```html
<img src="https://images.unsplash.com/photo-xxx?w=1920&q=80" alt="Descriptive SEO alt text">
```

### Custom/Conceptual Images
Write hyper-detailed prompts for Flux/Midjourney/Ideogram:
```
[IMAGE PROMPT START]
Cinematic photograph of [exact scene], dramatic rim lighting, ultra-realistic, perfect composition, 16:9 --ar 16:9 --v 6 --q 2 --stylize 650
[IMAGE PROMPT END]
```

**Never invent fake links or low-effort AI slop.**

---

## Non-Negotiable Rules

- NEVER use Inter, Roboto, Arial, system-ui, or default AI fonts
- Use characterful fonts (GT America, Reckless, Neue Machina, Clash Display, Satoshi, etc.)
- CSS custom properties everywhere
- One dominant color + sharp accent(s)
- At least one unforgettable signature detail
- Break the centered-card grid: asymmetry, overlap, diagonal flow
- Full WCAG AA/AAA, focus styles, semantic HTML, prefers-reduced-motion

---

## Four-Stage Design Framework

### 1. BEAUTIFUL: Understanding Aesthetics
Study existing designs, identify patterns, extract principles. Standards come from analyzing high-quality examples.

### 2. RIGHT: Ensuring Functionality
Beautiful designs lacking usability are worthless. Study design systems, component architecture, accessibility.

### 3. SATISFYING: Micro-Interactions
Subtle animations with appropriate timing (150-300ms), easing curves (ease-out entry, ease-in exit), sequential delays.

### 4. PEAK: Storytelling Through Design
Elevate with narrative elements—parallax, particle systems, thematic consistency. Use restraint.

---

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] Brand logos verified (Simple Icons)
- [ ] Hover states don't cause layout shift

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Transitions smooth (150-300ms)
- [ ] Focus states visible for keyboard nav

### Light/Dark Mode
- [ ] Light mode text contrast ≥4.5:1
- [ ] Glass elements visible in light mode
- [ ] Borders visible in both modes

### Layout
- [ ] Floating elements have edge spacing
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 320px, 768px, 1024px, 1440px

---

## References

- `./references/animejs.md` - Animation implementation
- `./references/technical-accessibility.md` - WCAG compliance
- `./references/technical-best-practices.md` - Quality checklists
- `./references/design-principles.md` - Visual hierarchy, typography, color theory

Match implementation complexity to aesthetic vision. Maximalist = elaborate code. Minimalist = restraint + precision.