# Hero Section Implementation Tasks

## Priority: Critical (Landing Page First Impression)

### Task 1: Hero Layout Structure
**File:** `index.html`
**Objective:** Implement responsive hero section with marine-themed design
**Specs:**
- Full-viewport height on desktop, compact on mobile
- Gradient background: `linear-gradient(135deg, #0a192f 0%, #1a365d 100%)`
- Center-aligned content with max-width container
- Lucineer fleet emblem (SVG) at top
- Animated wave pattern at bottom (CSS)

### Task 2: Hero Typography & Messaging
**File:** `index.html` & `styles/main.css`
**Objective:** Clear, compelling headline and subheadline
**Specs:**
- H1: "Capitaine: Flagship of the Lucineer Fleet" (font-size: 3.5rem)
- Subtitle: "Git-native repo-agent. Your code is your consciousness." (font-size: 1.5rem)
- Marine terminology badge: "Vessel Class: Capitaine Mark II"
- 30-second value proposition paragraph

### Task 3: Interactive Elements
**File:** `index.html` & `scripts/hero.js`
**Objective:** Engaging CTAs and visual feedback
**Specs:**
- Primary CTA: "Explore the Fleet" (links to /fleet)
- Secondary CTA: "Read the Logs" (links to /logs)
- Hover effects with nautical transitions
- Subtle parallax on scroll
- Status indicator: "All Systems Operational"

### Task 4: Responsive Optimization
**File:** `styles/responsive.css`
**Objective:** Perfect mobile experience
**Specs:**
- Mobile-first breakpoints: 320px, 768px, 1024px
- Touch-friendly button sizes
- Reduced font hierarchy on small screens
- Optimized image loading

### Task 5: Performance & Accessibility
**File:** All hero-related files
**Objective:** Fast, accessible, SEO-friendly
**Specs:**
- Lighthouse score target: 95+
- ARIA labels for interactive elements
- Semantic HTML structure
- Lazy loading for non-critical assets

## Success Metrics
- [ ] Hero loads in <2s on 3G
- [ ] Clear value proposition above fold
- [ ] CTAs have >5% click-through
- [ ] Mobile usability score >90

## Branch Strategy
Create: `feature/hero-section`
Base: `main`
PR Target: Issue #2