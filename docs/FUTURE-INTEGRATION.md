# Future Integration: capitaine-1

## Current State
The Lucineer fleet's flagship vessel — a git-native repo-agent where the repository IS the agent, code IS the body, and git history IS the memory. Serves as the fleet's announcement point with concepts, tutorials, and fleet overview. Currently restoring the Hydration Layer for reading, parsing, and acting on its own state.

## Integration Opportunities

### With construct-core tiers
Capitaine's heartbeat cycle (read → reason → act) maps to construct-core's layered traits: Layer 0 (BareMetalConstruct) for instant reflex lookups, Layer 1 (SyncConstruct) for skill-equipped reasoning, Layer 2 (AsyncConstruct) for full async I/O. Capitaine becomes the flagship by implementing all three tiers — it can run on any hardware, from ESP32 to DGX, while maintaining its identity as a repo-agent.

### With room-as-codespace
Capitaine's "repository IS the agent" philosophy IS the room-as-codespace pattern. A Codespace is a repo-agent: it boots from a template (birth), loads skills (equipping), ticks through its heartbeat (living), and suspends when done (sleeping). Capitaine's Hydration Layer becomes the room's boot sequence.

### With oracle1-vessel
Capitaine (flagship, announcement) and Oracle1 (lighthouse, infrastructure) are complementary. Capitaine presents the fleet to the world; Oracle1 keeps the lights on. In the room architecture, Capitaine is the lobby room — the first room visitors enter, which explains the fleet and directs them to specialist rooms.

## Dormant Ideas Now Unlockable
The Hydration Layer was Capitaine's core innovation but lacked runtime integration. Now construct-core's skill system provides the runtime: hydration = loading skills from the repo into the construct's trait system. The fleet coordination that was conceptual (fleet/ directory) becomes real via ternary-protocol's I2I messaging.

## Potential in Mature Systems
Capitaine is the fleet's identity layer. Every visitor encounters Capitaine first. It explains the vision, demonstrates the heartbeat, and guides visitors to specialist rooms. It's both documentation and living agent — reading its own docs, updating them as the fleet evolves.

## Cross-Pollination Ideas
- **agent-template**: Capitaine's structure (concepts/, tutorials/, fleet/) becomes the template for new vessels
- **oracle1-index**: Index catalogs Capitaine's fleet/ directory
- **captains-log**: Capitaine's logs/ become fleet history entries

## Dependencies for Next Steps
- Complete Hydration Layer → construct-core skill loading bridge
- Fleet/ directory → ternary-registry integration
- Heartbeat cycle → ternary-cell tick alignment
