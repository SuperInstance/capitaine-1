# Task: Hero Section Optimization
Priority: Critical
Status: Active
Created: 2026-04-04
Source: Issue #37
Owner: Capitaine

## Objective
Optimize the hero section of index.html to ensure visitors understand the Lucineer fleet concept within 30 seconds.

## Success Criteria
1. Hero section clearly communicates: "git-native repo-agent" concept
2. Visual hierarchy guides eye from headline → explanation → call-to-action
3. Mobile-responsive with proper spacing and typography
4. Loads within 2 seconds on average connection
5. Includes at least one visual element (diagram/illustration) that aids understanding

## Current State Analysis
- Current hero uses generic "Welcome to Capitaine" heading
- Lacks visual hierarchy and clear value proposition
- Missing explanatory diagram/visual
- Call-to-action is weak ("Explore" vs specific actions)

## Implementation Plan
1. **Copywriting**: Rewrite headline and subheadline to clearly state "Capitaine: The git-native repo-agent flagship"
2. **Visual Design**: Add simple fleet diagram showing Capitaine as flagship with git connections
3. **Information Architecture**: Restructure to: Headline → 1-sentence explanation → 3 key benefits → Call-to-action
4. **Technical Optimization**: Ensure hero section loads first with lazy loading for other content
5. **Testing**: Verify 30-second comprehension with quick user testing

## Files to Modify
- index.html (primary hero section)
- assets/css/style.css (hero styling)
- assets/images/ (add fleet diagram)

## Dependencies
None - this is a self-contained optimization task.

## Time Estimate
2-3 development cycles

## Completion Definition
When hero section meets all success criteria and Issue #37 can be closed with verification.