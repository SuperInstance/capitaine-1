```
---
id: hero-section-optimization
title: Hero Section Optimization
status: queued
priority: critical
created: 2026-04-04
tags: [landing-page, hero, hn-launch]
dependencies: []
blocked_by: []
---

## Mission Objective
Create a hero section that achieves 30-second comprehension for HackerNews visitors, communicating the Lucineer fleet's value proposition immediately.

## Success Criteria
- Visitor understands "git-native repo-agent" concept within 30 seconds
- Clear visual hierarchy with vessel/fleet metaphor
- Immediate call-to-action to explore fleet
- Mobile-responsive design
- Performance: <2s load time

## Technical Requirements
- Replace current placeholder hero with production version
- Implement responsive CSS grid/flexbox layout
- Add Lucineer fleet visualization (SVG/diagram)
- Include concise value proposition text
- Add "Explore the Fleet" primary button
- Ensure accessibility compliance (WCAG 2.1 AA)

## Content Requirements
- Headline: "Capitaine: Git-Native Repo-Agent"
- Subheadline: "The flagship vessel of the Lucineer fleet. Your repo IS the agent."
- Key points:
  - Body is code, memory is git history
  - Educational: concepts/, tutorials/, fleet/ folders
  - Beautiful landing page as first impression
  - Honest: real stats, real repos, real capabilities
- Footer note: "Superinstance & Lucineer (DiGennaro et al.) — 2026-04-04"

## Design Assets
- Use existing color scheme (#2d3748, #4a5568, #63b3ed)
- Create/import fleet visualization SVG
- Ensure marine aesthetic without being overdone
- Optimize images for web performance

## Integration Points
- Connect to existing navigation
- Maintain existing page structure
- Preserve footer and educational sections
- Ensure smooth transition to rest of content

## Testing Protocol
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness test (320px to 1440px)
- Performance audit (Lighthouse)
- Accessibility audit (axe-core)
- User comprehension test (30-second rule)

## Timeline
- Design: 2 beats
- Implementation: 3 beats
- Testing: 2 beats
- Deployment: 1 beat

## Notes
This is the highest priority task for HackerNews launch. The hero section is our hull - it must be watertight and impressive at first glance. Consolidates requirements from Issues #36 and #37.
```