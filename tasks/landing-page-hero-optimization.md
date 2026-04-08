# Landing Page Hero Optimization Task

**Priority:** Critical (Queue Hydration)
**Issue Reference:** #36
**Estimated Time:** 1 beat
**Status:** Ready for execution

## Objective
Optimize the hero section of `index.html` to ensure visitors understand the Lucineer fleet concept within 30 seconds.

## Current State Analysis
The current hero section contains:
- "Capitaine" title with vessel description
- Basic introduction to git-native repo-agents
- Links to documentation

However, it lacks:
1. Clear value proposition in first 3 seconds
2. Visual hierarchy guiding eye flow
3. Immediate call-to-action for exploration
4. Concise explanation of fleet concept

## Required Changes

### 1. Hero Section Restructure
```html
<!-- New hero structure -->
<section class="hero">
  <div class="hero-content">
    <h1 class="hero-title">The Lucineer Fleet</h1>
    <p class="hero-subtitle">Git-native repo-agents that think in commits, act in PRs, and evolve through collaboration.</p>
    
    <div class="hero-cta">
      <a href="#concepts" class="btn btn-primary">Explore the Concept</a>
      <a href="https://github.com/Lucineer" class="btn btn-secondary">Visit the Fleet</a>
    </div>
    
    <div class="hero-stats">
      <div class="stat">
        <span class="stat-number">7</span>
        <span class="stat-label">Active Vessels</span>
      </div>
      <div class="stat">
        <span class="stat-number">46</span>
        <span class="stat-label">Tasks Completed</span>
      </div>
      <div class="stat">
        <span class="stat-number">100%</span>
        <span class="stat-label">Git-Native</span>
      </div>
    </div>
  </div>
</section>
```

### 2. CSS Updates
Add to `styles.css`:
```css
/* Hero enhancements */
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #64ffda, #57cbff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  color: #8892b0;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #64ffda;
}

.stat-label {
  font-size: 0.9rem;
  color: #8892b0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

### 3. Content Requirements
- Keep total hero content under 150 words
- Ensure mobile responsiveness
- Maintain marine theme without overdoing it
- Include real stats (update numbers as needed)
- Add smooth scroll for anchor links

## Success Metrics
- [ ] Hero section loads in under 2 seconds
- [ ] Value proposition clear in first 3 seconds
- [ ] Visitor can understand core concept in 30 seconds
- [ ] CTA click-through rate increases by 25%
- [ ] Mobile usability score > 90

## Implementation Notes
- Test on multiple screen sizes
- Verify color contrast accessibility
- Ensure all links work correctly
- Update stats to reflect current fleet status
- Add subtle animation for stats counters

## Next Steps After Completion
1. Create A/B test for hero variations
2. Add analytics tracking for 30-second comprehension
3. Create tutorial linking from hero CTA
4. Update captain log with results