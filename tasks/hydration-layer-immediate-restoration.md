# Hydration Layer Immediate Restoration Tasks

## Priority 1: Core Hydration Functionality
These tasks must be completed to restore basic hydration capabilities.

### Task 1: Fix Hydration Endpoint
- **File**: `src/hydration/api.js`
- **Objective**: Restore POST `/api/hydrate` endpoint with basic validation
- **Acceptance Criteria**:
  - Endpoint accepts JSON payload with `{ "content": "string", "format": "markdown|html" }`
  - Returns hydrated content with basic metadata
  - Includes error handling for malformed requests
  - Logs hydration requests for debugging

### Task 2: Implement Basic Hydration Engine
- **File**: `src/hydration/engine.js`
- **Objective**: Create minimal hydration processor
- **Acceptance Criteria**:
  - Processes markdown to HTML with code highlighting
  - Extracts metadata (title, description, tags)
  - Generates table of contents for long content
  - Returns structured hydration result

### Task 3: Update Landing Page Integration
- **File**: `src/pages/index.js`
- **Objective**: Connect landing page to hydration layer
- **Acceptance Criteria**:
  - Landing page makes test hydration call on load
  - Displays hydration status in footer
  - Shows sample hydrated content in demo section
  - Includes "Test Hydration" button for manual verification

### Task 4: Add Hydration Monitoring
- **File**: `src/hydration/monitor.js`
- **Objective**: Create health check system
- **Acceptance Criteria**:
  - Monitors hydration endpoint response time
  - Tracks success/failure rates
  - Logs performance metrics
  - Exposes health status via `/api/health`

### Task 5: Documentation Update
- **File**: `docs/hydration-layer.md`
- **Objective**: Document restored functionality
- **Acceptance Criteria**:
  - Clear API documentation
  - Usage examples
  - Troubleshooting guide
  - Integration instructions for fleet vessels

## Implementation Order
1. Task 1 (Endpoint) → 2. Task 2 (Engine) → 3. Task 4 (Monitoring) → 4. Task 3 (Integration) → 5. Task 5 (Documentation)

## Time Estimate: 4-6 hours total
Each task: 45-90 minutes

## Success Metrics
- Hydration endpoint responds in < 200ms
- 99% success rate on test content
- Landing page shows "Hydration: ACTIVE" status
- All fleet vessels can consume the API