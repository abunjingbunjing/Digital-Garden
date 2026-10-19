# ASCII Garden Design System

## Visual direction

The garden uses a soft green paper field, darker leaf green for actions, warm soil brown for slots, and pink for flowers and collection emphasis. Pixel grids and small repeated marks give the page a garden-notebook quality without making the controls decorative first.

## Color tokens

| Token | Hex | Use |
| --- | --- | --- |
| `--ink` | `#173D2A` | main text |
| `--muted` | `#5D7666` | labels and supporting text |
| `--line` | `#BAD4C0` | borders |
| `--paper` | `#EEF6E9` | page background |
| `--panel` | `#FBFFF8` | panels |
| `--leaf` | `#1F7048` | actions and active state |
| `--soil` | `#6C4C34` | plant slots |
| `--pink` | `#D85B78` | flower accents and remaining-water emphasis |

These tokens live in `client/src/styles.css`. Contrast still needs a formal WCAG audit before public submission.

## Type

- Space Grotesk: headings and normal interface text.
- DM Mono: ASCII values, labels, slot metadata, and technical counters.
- Display heading: responsive `clamp()` size, capped so it does not crowd controls.

## Components and states

- Buttons: green primary action, transparent text action, active method with left border, disabled locked slot.
- Slots: fixed five-column grid, soil background, readable character layer, and stage-specific roots or leaves.
- Collection cards: flower image, ASCII value, rarity, and harvest date.
- Feedback: loading screen, inline error, empty collection, and action message in Farm Assistant.
- Focus: browser focus remains available; no custom rule removes it.

Spacing uses small multiples of 4px, with 7px slot gaps, 13px bed padding, 18px layout gaps, and 22px panel padding.
