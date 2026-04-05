# PR: {{PR_TITLE}}

**Vessel:** {{VESSEL_NAME}}
**Captain:** {{CAPTAIN_NAME}}
**Destination:** {{TARGET_BRANCH}}
**Origin:** {{SOURCE_BRANCH}}

## Mission Brief
{{PR_DESCRIPTION}}

## Navigation Log
- **Coordinates:** {{REPO_URL}}/pull/{{PR_NUMBER}}
- **Departure:** {{CREATED_AT}}
- **Estimated Arrival:** {{MERGE_DATE}}

## Cargo Manifest
**Files Modified:**
{{FILE_LIST}}

**Dependencies:**
- Related to issue: {{ISSUE_REFERENCE}}
- Blocks: {{BLOCKS}}
- Blocked by: {{BLOCKED_BY}}

## Captain's Log
{{CAPTAIN_LOG_ENTRY}}

## Fleet Coordination
- [ ] Requires review from helm
- [ ] Requires testing in staging waters
- [ ] Requires documentation updates
- [ ] Will trigger deployment sequence

## Marine Protocol Compliance
- [ ] Follows vessel coding standards
- [ ] Maintains backward compatibility
- [ ] Includes appropriate tests
- [ ] Updates documentation accordingly

**Signal Flags:** {{LABELS}}
**Weather Conditions:** {{CHANGES}} files changed, {{ADDITIONS}} additions, {{DELETIONS}} deletions