# NailedIt — AI Coding & Canvas Design Rules

## Purpose

NailedIt is a browser-based thumbnail/design studio built with React, TypeScript, Tailwind CSS, and HTML5 Canvas. This document is the engineering and visual-design constitution for AI agents modifying the repository.

The goal is not merely to make the application technically functional. The goal is to make it feel like a real, polished design tool while keeping the code maintainable.

---

## 1. Source of Truth

Before modifying code, inspect the actual repository. Do not assume that the README, CRS, SRS, CRC, comments, or previous AI-generated descriptions accurately describe the current implementation.

Understand the real flow:

```text
React state
    ↓
ThumbnailStudioView
    ↓
ThumbnailCanvas
    ↓
Template renderer
    ↓
Canvas utilities
    ↓
HTML5 Canvas
```

Inspect `src/types.ts`, `ThumbnailCanvas.tsx`, `ThumbnailStudioView.tsx`, `canvasUtils.ts`, and all template renderers before making architectural changes.

---

## 2. Preserve Existing Contracts

Prefer preserving `CanvasTemplateProps` and the renderer signature:

```ts
export const renderTemplate = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  props: CanvasTemplateProps
) => {}
```

Do not invent new props or break other templates without a genuine reason. If a shared architectural change is necessary, explain why and keep backwards compatibility where practical.

---

## 3. Design Templates as Real Compositions

Templates are not simple drawing scripts. Treat each as a professional graphic composition.

Every template should have a distinct visual identity:

- Professional → premium editorial / corporate
- Ethereal → dreamy / elegant / atmospheric
- Bohemian → organic / artistic / warm
- Minimalistic → restrained / sophisticated
- Tech SaaS → modern / technical / clean
- YouTube Bold → energetic / high contrast / creator-focused

Do not make every template look like the same design with different colors.

---

## 4. Use a Meaningful Composition Grid

Avoid arbitrary magic-number positioning. Define meaningful regions such as:

- frame
- content area
- text region
- image region
- logo region
- metadata region
- decorative region

Use derived geometry such as padding based on `Math.min(width, height)` and explicit `Rect` objects when useful.

Landscape and portrait should be intentionally composed differently when appropriate. Do not simply squeeze a landscape layout into portrait dimensions.

---

## 5. Typography Is a Primary Design Element

Treat canvas typography as layout, not as an afterthought.

Consider:

- font family
- weight
- size
- line height
- letter spacing
- width constraints
- alignment
- hierarchy
- whitespace
- long titles
- short titles
- subtitles
- categories
- keyword pills

Avoid relying on non-portable Canvas properties such as `ctx.letterSpacing` when compatibility is uncertain. Implement custom letter spacing when the design genuinely needs it.

Text must remain balanced for short, medium, and very long titles.

---

## 6. Image Composition

Uploaded images can be portrait, landscape, square, transparent, tiny, or poorly framed.

Use deliberate:

- cover / contain behavior
- clipping
- focal positioning
- scale
- pan
- anchoring

The user's image controls should behave predictably:

```text
speakerScale
speakerX
speakerY
logoScale
logoX
logoY
textScale
textX
textY
```

A positive Pan X/Y should visually move the object in the expected direction. Avoid template-specific coordinate interpretations unless necessary.

---

## 7. Image Masks

Use masks appropriate to the template's aesthetic:

- rounded rectangles
- circles
- arches
- organic blobs
- editorial cutouts
- asymmetrical shapes

Do not use decorative masking merely because it is possible. Every mask should improve the composition.

---

## 8. Decoration Must Have a Purpose

Possible decorative elements include:

- editorial lines
- organic shapes
- subtle gradients
- rings
- dots
- rays
- corner ornaments
- tonal texture

Do not randomly add borders, circles, gradients, lines, blobs, or shadows to fill empty space.

Whitespace is part of the design.

Every decorative element must either support hierarchy or reinforce the template's visual identity.

---

## 9. Color System

Define palettes instead of scattering arbitrary hex values throughout a renderer.

Example:

```ts
const palette = {
  background: '#...',
  surface: '#...',
  ink: '#...',
  muted: '#...',
  accent: '#...',
  accentSoft: '#...',
  line: '#...',
};
```

Maintain contrast, readability, hierarchy, and aesthetic coherence.

---

## 10. Missing Assets Must Fail Gracefully

Missing or invalid speaker images and logos must never crash the renderer.

The composition should still look intentional when assets are absent.

Use deliberate error handling around asynchronous image loading. Do not silently create debugging nightmares by swallowing every possible error without a useful strategy.

---

## 11. High-DPI and Canvas Resolution

Keep CSS display dimensions separate from internal canvas resolution.

DPR handling belongs to the canvas lifecycle/rendering layer, not individual templates.

Templates should reason about the logical `width` and `height` supplied to them and should not randomly multiply coordinates by DPR.

---

## 12. Keep Export Separate from Preview Rendering

Template renderers should primarily draw the design.

Do not put PNG encoding, WebP encoding, download behavior, clipboard behavior, or React state updates inside template renderers.

Interactive preview rendering should not unnecessarily perform expensive export operations.

---

## 13. Performance

NailedIt is a live editor. Sliders can trigger many renders per second.

Avoid:

- repeated image decoding
- unnecessary allocations
- PNG/WebP encoding during every preview render
- expensive unrelated work in the render path
- arbitrary delays such as `setTimeout()` for synchronization

Prefer:

- cached images
- lightweight canvas operations
- deterministic rendering
- reusable geometry

If the shared `ThumbnailCanvas` lifecycle violates these principles, identify the architectural issue rather than hiding it inside an individual template.

---

## 14. Async Render Races

Asynchronous image/font loading can cause an old render to finish after a newer render.

Conceptually:

```text
Render 1 starts
   ↓
await image

Render 2 starts
   ↓
await image

Render 2 finishes → draw

Render 1 finishes → IGNORE
```

Use render versioning/cancellation where necessary. Never use arbitrary delays as synchronization.

---

## 15. Reusable Drawing Primitives

Create shared utilities when operations are genuinely reusable, for example:

```text
 drawRoundedRect
 drawOrganicBlob
 drawPill
 drawDivider
 drawLetterSpacedText
 drawImageCover
 drawImageContain
```

Do not create abstractions solely to increase code size. Every helper should make the system clearer or more reusable.

---

## 16. Code Quality

Do not confuse code volume with quality.

A concise renderer that is correct and beautiful is better than an 800-line renderer full of unnecessary abstractions.

Avoid unexplained magic numbers such as:

```ts
x + 137
width - 219
```

Prefer meaningful constants and geometry derived from dimensions.

Do not leave backup files, one-off fix scripts, generated patches, or abandoned implementations in the production source tree unless they have a documented purpose.

---

## 17. Extreme Input Testing

Test more than the default example.

### Titles

- very short
- medium length
- extremely long

### Images

- portrait
- landscape
- square
- transparent PNG
- very small
- very large

### Controls

- minimum scale
- maximum scale
- minimum pan
- maximum pan

### Formats

- OG 1.91:1
- YouTube 16:9
- Reels 9:16

The composition should remain usable and visually intentional.

---

## 18. Visual Quality Checklist

Before calling a template complete, evaluate:

### Hierarchy

Can the user immediately identify the title, subject, and secondary information?

### Balance

Does the composition feel intentional rather than randomly positioned?

### Whitespace

Are elements cramped or unnecessarily isolated?

### Alignment

Do major elements share meaningful alignment axes?

### Typography

Does the type treatment look designed rather than default?

### Image

Does the subject receive appropriate visual importance?

### Branding

Does the logo feel integrated rather than pasted on?

### Decoration

Does every decorative element contribute?

### Responsiveness

Does the design work at 1.91:1, 16:9, and 9:16?

### Professionalism

Would a professional designer be comfortable publishing the result?

---

## 19. Scope Control

When asked to fix one template, focus on that template.

Do not randomly rewrite unrelated templates.

If you discover a shared architectural problem, report it separately and change shared code only when the fix is genuinely required.

---

## 20. Verification

After changes, report:

### Changed

Exactly what was modified.

### Why

The visual and/or technical reason for each important change.

### Files Modified

Every modified file.

### Remaining Problems

Anything not fixed or not verified.

Never claim that something was tested if it was not actually tested.

Never claim everything is perfect without verification.

---

# Core Principle

Do not patch ugly canvas code just to make it technically work.

Think simultaneously like:

1. a graphic designer
2. a canvas rendering engineer
3. a frontend architect

The result should feel like a real design tool, not an AI-generated collection of rectangles.
