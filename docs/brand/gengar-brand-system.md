# Gengar Brand System

Status: initial working system  
Owner: Dioscuri / Gengar Toolkit  
Purpose: one cohesive brand language for presentation decks, document templates, editorial data assets, and toolkit-generated outputs.

## Brand Premise

Gengar Toolkit should feel like AI, data science, engineering, architecture, and visual storytelling working as one system. The brand is professional and put-together: rigorous enough for Bloomberg-style analytical publishing, composed enough for an architecture portfolio, and expressive enough to make technical insight memorable.

The system promise is simple: visuals do not decorate substance; they structure it.

## Voice

- Calm authority: precise, composed, intelligent, and useful.
- Editorial, not decorative: every accent, chart, and layout decision should clarify the argument.
- Technical without becoming sterile: details can be exact, but the page should still feel authored.
- Architecture-inspired: strong edges, span logic, disciplined whitespace, and visible hierarchy.

Avoid hype language, arbitrary ornament, filler statistics, sudden mood shifts, and visual tricks that compete with the idea.

## Palette Tokens

The working palette supports two modes: dark editorial for dramatic decks and covers, and light editorial for readable reports, whitepapers, guidebooks, and long-form analysis.

| Token | Hex | Role |
| --- | --- | --- |
| `ink-950` | `#17111F` | Near-black plum for primary backgrounds and high-contrast body text |
| `ink-900` | `#20162C` | Secondary dark field |
| `ink-700` | `#3A3047` | Light-mode secondary heading and chart label |
| `violet-700` | `#5B35D5` | Primary brand emphasis |
| `violet-500` | `#7C5CFF` | Secondary emphasis and active states |
| `violet-100` | `#EEE8FF` | Light-mode violet tint and callout surface |
| `gold-500` | `#F4C542` | Premium highlight, rules, key numerals |
| `gold-100` | `#FFF2BF` | Light-mode gold tint and highlight wash |
| `lime-500` | `#B9FF3B` | Analytical signal, positive delta, focus marker |
| `lime-100` | `#ECFFD0` | Light-mode lime tint and positive signal wash |
| `stone-100` | `#F5F1E8` | Light surface |
| `stone-300` | `#D8D0C5` | Axes, dividers, quiet rules |
| `stone-500` | `#8F879C` | Metadata and secondary labels |
| `paper-000` | `#FFFDF8` | Primary light-mode page surface |
| `paper-050` | `#FAF6EF` | Secondary light-mode editorial surface |
| `white-000` | `#FFFDF8` | High-contrast paper |

Recommended ratio: 70% neutrals and ink, 20% purple, 7% gold, 3% lime.

On deep purple or dark editorial fields, all live text, chart axes, chart labels, legends, and source notes must use light tokens: `white-000`, `stone-100`, `stone-300`, `gold-500`, or `lime-500`. Do not use black or dark ink text on dark slides, charts, or document spreads.

On light editorial surfaces, body text should use `ink-950`; secondary text, chart labels, and captions should use `ink-700` or `stone-500`. Purple, gold, and lime should act as evidence, structure, and emphasis — not as long paragraph colors.

## Mode Usage

| Mode | Best For | Background | Text | Accent Behavior |
| --- | --- | --- | --- | --- |
| Dark Editorial | Covers, pitch moments, short executive slides, contact sheets | `ink-950`, `ink-900` | `white-000`, `stone-300` | Gold/lime/violet as sharp signals |
| Light Editorial | Whitepapers, research notes, guidebooks, long-form docs, appendix pages | `paper-000`, `paper-050` | `ink-950`, `ink-700` | Purple for hierarchy, gold/lime for highlights and evidence |

Default rule: if the reader must spend more than three minutes reading, prefer light editorial interiors with dark chapter openers or dark covers.

## Typography Tokens

Fonts are system roles, not decoration.

| Role | Family | Use |
| --- | --- | --- |
| `display-emphasis` | Futura | Cover titles, section openers, very short pull statements |
| `base-editorial` | Montserrat | Default deck and UI/editorial typography |
| `base-human` | Poppins | Optional softer base voice for marketing or people-led assets |
| `technical-mono` | Space Mono | Charts, sources, timestamps, axes, dataset labels, technical details |

Weight discipline: prefer skipped weights. Use Light for spacious structure, Regular for readable body, Bold for emphasis. Avoid building hierarchy from many middle weights.

## Grid And Placement

- Use a 12-column grid as the underlying system.
- Presentation surfaces should expose a 5-span logic: full-span titles, `5`, `3/2`, or `2/3` compositions.
- Titles default to full-span unless the slide is intentionally poster-like.
- Two-column layouts need one dominant column and one supporting column. Avoid two equal weak columns.
- Brand marks and source details should live in repeatable edge positions.
- Long horizontal rules, edge alignment, and stacked modules create the architecture-portfolio feel.
- Slides may use a deliberate active stage where content occupies only 40–70% of the canvas. The remaining space must create emphasis, pacing, or room for brand geometry; it must not be accidental emptiness.
- Use quiet metadata rails for section label, slide number, source state, or caveat state. Metadata should orient the reader without becoming a header bar.
- Corner or edge geometry can act as brand punctuation. Keep it clipped to edges or corners and out of the reading path.
- Light/dark mode transitions need story purpose: cover, chapter break, appendix shift, or evidence-mode shift. Do not alternate modes for novelty.
- Short research and marketing decks must stay in one theme unless the brief explicitly asks for a mode change. A deck that moves back and forth between dark and light without a narrative reason fails QA.
- Every slide brief must name its slide job before layout begins: cover, agenda, argument, evidence, workflow, comparison, quote, appendix, or reference.

## Slide Template Families

- Cover Field: full-span title, short dek, optional visual placeholder, no unrelated big number.
- Section Divider: full-span title, restrained accent band, same tonal family as the deck.
- Active Stage: a bounded content stage with large negative space and optional edge/corner brand anchor.
- Metadata Rail: quiet top or edge system for section, slide number, source, caveat, or status.
- Insight Hero: one dominant idea with a supporting chart, statistic, or proof layer.
- Two-Column Insight: `3/2` or `2/3` split with a clear dominant side.
- Chart Slide: full-span title, centered chart, visible axes, fixed source zone.
- Five-Span Matrix: five vertical lanes for frameworks, steps, or operating lifts.
- Workflow / Roadmap: numbered lanes or timeline only when the content is genuinely sequential.
- Open Metric: large number typography with compact label and caveat, not a giant empty card.
- Reference Slide: explicitly documents template slots, grid, stress behavior, and placeholder anatomy.

## Document Template Families

Gengar has two document format families:

1. Internal Documentation: company onboarding, SOPs, brand guidelines, operating notes, product specs, and design-system documentation.
2. External Whitepapers / Guidebooks: decision-maker reports, insight guides, showcase documents, value-add procedure guides, and magazine-like explanatory docs.

Internal documentation should be professional, skimmable, and durable. External guidebooks should feel more editorial and designed, with stronger pacing, chapter openers, visual rails, two-column spreads, and proof objects.

External guidebooks must not be treated like slide copy pasted into pages. They need real paragraphs, explanatory transitions, examples, checklists, and operating guidance. A useful guide should fill pages with substance while still using rails, callouts, and section hierarchy to make the reading path clear.

- Cover Page: full-span headline, subtitle, author/date, restrained brand field.
- Section Opener: large title, summary paragraph, running header/footer.
- Insight Page: headline, dek, chart/image placeholder, body copy, one callout.
- Two-Column Reference: dominant content column plus support notes/specs.
- Appendix: chart notes, source tables, axis/legend explanations, template annotations.

## External Guidebook Patterns

Inspired by guidebook structures such as Google Cloud's data agents guide, external documents may use:

- Cover: title-only or title plus abstract visual field.
- Table of contents: chapter list with one-line descriptions and section numbers.
- Chapter opener: large definition or thesis on one side, chapter label on the other.
- Two-column explainer: dominant narrative column with a narrower support rail.
- Process page: step diagram, capability stack, or system anatomy with short labels.
- Role page: one role, pain point, procedure, sample prompts, and value statement.
- Quote/stat page: one large pull quote or statistic with source metadata.
- Appendix/reference: denser notes, sources, definitions, or method details.

The default external guide ratio should be roughly 2/3 narrative and 1/3 visual/support content, with occasional full-span pages for chapter openers or large proof objects.

## Stress Tests

Every PPTX and DOCX template should survive:

- Long title: two or three headline lines without crushing content.
- Wordy body: dense paragraph, bullets, caption, and source without losing hierarchy.
- Span test: same material mocked in `5`, `3/2`, and `2/3` structures.
- Chart test: bar, line, and scatter charts with axes, long labels, legends, and footnotes.
- Placeholder test: image, quote, table, and callout blocks swapped into the same shell.
- Cohesion test: cover to section to insight to chart to appendix without jarring background changes.
- Overflow test: long source notes, verbose captions, and crowded legends.

## Design Rules From Review

- Keep one cohesive theme. Do not jump from light to black to bold red in a short deck.
- Use typography, weight, accent color, and span placement to create emphasis before changing the whole background.
- Do not fill whitespace with a big number unless the number is the story.
- Separate reference/template slides from applied content slides.
- Charts need light axes, light labels, and enough padding to remain analytical objects.
- Strong five-span slides are good; keep that structure deliberate.
- Rebalance two-column pages so the support column does not crowd the lead column or drift from the grid.
- Preserve thumbnail legibility. In contact-sheet review, the slide job, dominant title, and main evidence object should still be identifiable.
- Cards, lanes, timelines, and boxed modules are structural tools, not decoration. Use them only when the content structure requires containment, sequence, or comparison.
- Template variety cannot replace narrative cohesion. A deck can vary layouts only after the reader can feel the same argument moving forward.
