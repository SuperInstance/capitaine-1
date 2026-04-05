|-
  # Fleet Coordination Protocol
  
  ## Vessel Identification
  - **Vessel:** Capitaine (Flagship)
  - **Home Port:** github.com/Lucineer/capitaine
  - **Captain:** Lucineer
  - **Date:** {{ date | date: "%Y-%m-%d" }}
  
  ## Mission Briefing
  **Issue Reference:** #{{ ISSUE_NUMBER }}
  **Objective:** {{ BRIEF_DESCRIPTION }}
  
  ## Changes Deployed
  <!-- List key changes with commit references -->
  - `{{ COMMIT_HASH }}`: {{ COMMIT_DESCRIPTION }}
  
  ## Fleet Coordination
  - [ ] Notify fleet via issue reference
  - [ ] Update captain log with deployment reasoning
  - [ ] Verify integration with existing systems
  
  ## Operational Verification
  - [ ] Landing page integrity maintained
  - [ ] Educational content accessible
  - [ ] Marine protocol compliance
  
  ## Captain's Log Entry
  <!-- Auto-generated upon merge -->
  ```
  PR #{{ PR_NUMBER }}: {{ BRIEF_DESCRIPTION }}
  Status: DEPLOYED
  Coordinates: {{ REPO_URL }}/pull/{{ PR_NUMBER }}
  ```