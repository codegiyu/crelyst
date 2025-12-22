# Hero Section Background Images

This document provides specific image recommendations for the hero sections of each page (excluding the home page).

## Image Sources
All images should be sourced from free stock photo platforms:
- **Unsplash** (https://unsplash.com) - Free, high-quality images, no attribution required
- **Pexels** (https://pexels.com) - Free stock photos and videos
- **Pixabay** (https://pixabay.com) - Free images, vectors, and illustrations

---

## 1. About Page Hero
**Component:** `components/section/about/HeroSection.tsx`
**Theme:** Creative design agency, photography, branding, product design, packaging, visual identity

### Recommended Image Types:
- Creative design studio workspace with design tools, sketches, and mood boards
- Abstract creative workspace with art supplies, cameras, and design materials
- Modern design studio with natural lighting
- Artistic workspace with creative tools scattered elegantly

### Specific Search Terms:
- "creative design studio workspace"
- "designer workspace with tools"
- "creative agency office"
- "design studio interior"
- "artistic workspace photography"

### Example Unsplash URLs:
- Search: `https://unsplash.com/s/photos/creative-design-studio`
- Search: `https://unsplash.com/s/photos/designer-workspace`
- Search: `https://unsplash.com/s/photos/creative-agency-office`

### Image Characteristics:
- Should have space for text overlay (darker areas or blurred backgrounds work well)
- Professional, inspiring, and creative atmosphere
- Neutral or warm color tones
- High resolution (minimum 1920x1080px)

---

## 2. Services Page Hero
**Component:** `components/section/services/ServicesHeroSection.tsx`
**Theme:** Creative services, photography, packaging, design and branding services

### Recommended Image Types:
- Professional photography setup with camera and lighting equipment
- Product design workspace with prototypes and design sketches
- Branding materials (logos, business cards, packaging) arranged artistically
- Creative services showcase with various design tools and materials

### Specific Search Terms:
- "professional photography studio setup"
- "product design workspace"
- "branding design materials"
- "creative services showcase"
- "design tools and materials"

### Example Unsplash URLs:
- Search: `https://unsplash.com/s/photos/photography-studio-setup`
- Search: `https://unsplash.com/s/photos/product-design-workspace`
- Search: `https://unsplash.com/s/photos/branding-design`

### Image Characteristics:
- Showcases the variety of services offered
- Professional and polished appearance
- Good contrast for text overlay
- Modern and contemporary style

---

## 3. Projects Page Hero
**Component:** `components/section/projects/ProjectsHeroSection.tsx`
**Theme:** Portfolio showcase, successful projects, expertise and results

### Recommended Image Types:
- Gallery wall with framed project photos
- Portfolio presentation with design mockups
- Project showcase with various completed works
- Creative portfolio display with design samples

### Specific Search Terms:
- "portfolio gallery wall"
- "design portfolio showcase"
- "creative project display"
- "project presentation workspace"
- "design mockup showcase"

### Example Unsplash URLs:
- Search: `https://unsplash.com/s/photos/portfolio-gallery`
- Search: `https://unsplash.com/s/photos/design-portfolio`
- Search: `https://unsplash.com/s/photos/project-showcase`

### Image Characteristics:
- Emphasizes the quality and variety of work
- Professional portfolio presentation
- Clean, organized aesthetic
- Allows text overlay without competing with content

---

## 4. Work With Us Page Hero
**Component:** `components/section/work-with-us/WorkWithUsHeroSection.tsx`
**Theme:** Collaboration, freelancers, designers, creative network, partnership

### Recommended Image Types:
- Team collaboration meeting with designers
- Creative professionals working together
- Handshake or collaboration between team members
- Diverse creative team in a modern workspace
- People collaborating on creative projects

### Specific Search Terms:
- "creative team collaboration"
- "designers working together"
- "team meeting creative agency"
- "collaboration workspace"
- "creative professionals partnership"

### Example Unsplash URLs:
- Search: `https://unsplash.com/s/photos/creative-team-collaboration`
- Search: `https://unsplash.com/s/photos/designers-working-together`
- Search: `https://unsplash.com/s/photos/team-collaboration`

### Image Characteristics:
- Emphasizes collaboration and partnership
- Diverse, inclusive representation
- Warm and welcoming atmosphere
- Professional yet approachable

---

## 5. Contact Page Hero
**Component:** `components/section/contact/ContactHeroSection.tsx`
**Theme:** Communication, connection, getting in touch, conversation

### Recommended Image Types:
- Modern office or workspace with communication tools
- Professional business meeting or consultation
- Clean, minimalist workspace with phone or laptop
- Friendly, approachable business environment
- Handshake or professional greeting

### Specific Search Terms:
- "business communication"
- "professional consultation"
- "modern office workspace"
- "business meeting friendly"
- "contact communication"

### Example Unsplash URLs:
- Search: `https://unsplash.com/s/photos/business-communication`
- Search: `https://unsplash.com/s/photos/professional-consultation`
- Search: `https://unsplash.com/s/photos/modern-office-workspace`

### Image Characteristics:
- Inviting and approachable
- Professional yet friendly
- Clean and uncluttered
- Good for text overlay

---

## Implementation Notes

### Image Requirements:
- **Resolution:** Minimum 1920x1080px (Full HD), preferably 2560x1440px or higher
- **Format:** JPG or WebP (optimized for web)
- **Aspect Ratio:** 16:9 or similar wide format
- **File Size:** Optimized to under 500KB when possible

### Overlay Considerations:
- All images should work well with dark gradient overlays (as seen in ServiceDetailHero and ProjectDetailHero)
- Ensure sufficient contrast for white text overlay
- Consider using images with darker areas or adding gradient overlays for text readability

### Styling Consistency:
- Follow the same pattern as `ServiceDetailHero.tsx` and `ProjectDetailHero.tsx`:
  - Full-height background image
  - Dark gradient overlay for text readability
  - Vertically centered content
  - Minimum height on large screens: `min-h-[min(900px,75vh)]`

---

## Quick Reference Links

### Unsplash Collections:
- Creative Workspace: https://unsplash.com/collections/creative-workspace
- Design Studio: https://unsplash.com/collections/design-studio
- Photography: https://unsplash.com/collections/photography
- Business: https://unsplash.com/collections/business

### Pexels Collections:
- Design: https://www.pexels.com/search/design/
- Creative: https://www.pexels.com/search/creative/
- Business: https://www.pexels.com/search/business/

