#!/bin/bash
# Run all capitaine tests without requiring a test framework.
# Each test file uses simple assert() and process.exit(1) on failure.
set -e

echo "╔══════════════════════════════════════════╗"
echo "║   Capitaine Test Suite — 6 modules       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

PASSED=0
FAILED=0

for test_file in tests/*.test.ts; do
  echo "Running $(basename "$test_file")..."
  if npx tsx "$test_file" 2>/dev/null; then
    PASSED=$((PASSED + 1))
  else
    echo "  FAILED: $test_file"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "Results: $PASSED suites passed, $FAILED failed"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
echo "All test suites passed ✓"
