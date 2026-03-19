# Feature Registry

## Editor Canvas

- Canvas stage with live composition preview and safe-margin/grid overlays.
- Static fitted startup preview for Motion Toolkit, with playback starting only after an explicit Play action.
- Viewport-locked preview pane behavior that stays fixed while controls expand and scroll independently.

## Toolkit Suite

- Platform launcher for Motion Toolkit, Data Visualization Toolkit, and Social Card Toolkit
- Shared toolkit registry, export-capability contracts, and package-style platform boundaries
- Shared studio-shell primitives for branded headers, preview layouts, output presets, and preset storage
- Shared UI primitives for palette-first controls, collapsible control sections, and reusable editor surfaces

## Data Visualization Toolkit

- Structured CSV, pasted-table, and JSON input parsing
- Chart template selection across bar, line, ranking, scatter, pie/donut, and big-number formats
- Guided field mapping with theme-aware SVG/PNG export and local preset persistence

## Social Card Toolkit

- Constrained quote, stat, announcement, explainer, and chart-caption templates
- Shared theme selection, accent/background controls, and local preset persistence
- SVG/PNG export for vector-safe social layouts

## Background Types

- Radial glow
- Linear wash
- Dual orb
- Mesh field

## Motif System

- Configurable motif type, count, scale, opacity, blur, position, rotation, and color.

## Typography Controls

- Layout presets, alignment, anchor placement, sizing, copy, and padding controls.

## Preset System

- Default presets and local preset persistence built on the editor store.
- Shared version-aware preset storage helpers used across toolkit flows.

## Export

- PNG still export
- WEBM motion export
- Shared export capability contracts and SVG helper utilities for future toolkit exports
- Shared named output preset catalog for social, LinkedIn, video, and print targets

## Agent Operating Layer

- Autonomous backlog scan for open issues and feature requests
- Roadmap capture for valid but under-specified feature ideas
- Tracked Codex multi-agent runtime profiles under `.codex/` and `agents/`
- Browser screenshot validation guidance for frontend PR preparation
- Chrome DevTools MCP preference for browser debugging and screenshot capture when configured
