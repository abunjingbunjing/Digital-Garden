# ASCII Garden Mockup Record

The built interface is the current mockup. It has two screens and one responsive garden view.

## Entry screen

A compact signup/login panel uses the garden name as the first personal detail. It uses the same green and pink palette as the garden and has a clear error state for bad credentials.

## Garden screen

The header shows the garden name, username, current day, and Leave button. The main panel shows five garden beds, each with five stable slots. Locked beds remain visible so the checkpoint path is clear.

The side panel contains four methods: Plant, Water, Shovel, and Harvest. The Water row shows remaining daily charges. Farm Assistant text changes after actions and at later growth checkpoints.

The collection section shows saved ASCII values beside flower graphics. Empty collection state is supported and says that harvested characters will appear there.

## Responsive behavior

At narrow widths, the garden and side panel stack. Beds become one column. Slot dimensions remain stable so character growth does not move neighboring controls.

## Built versus planned

The described entry screen, garden screen, empty collection state, method controls, locked beds, responsive layout, and collection view are implemented. A formal exported screenshot and deployed-site capture still need to be produced for the presentation submission.
