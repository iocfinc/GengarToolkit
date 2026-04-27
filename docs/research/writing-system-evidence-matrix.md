# Research And Writing System Evidence Matrix

Status: working standard  
Purpose: stop producing pretty documents that do not teach, persuade, or clarify.

## Evidence Matrix

| Source | Why It Matters | What It Teaches | Implication For Gengar Outputs | Open Question |
| --- | --- | --- | --- | --- |
| Barbara Minto / Pyramid Principle | Consulting communication standard for complex decisions | Start with the answer, then group supporting arguments logically; each level should summarize the level below. | Every deck, brief, or whitepaper needs a governing answer before slide/page writing starts. If the title row cannot tell the argument, the artifact fails. | How much Minto structure should be visible vs hidden in more editorial work? |
| Journalism / inverted pyramid | Fast comprehension under reader time pressure | Put the most important information first; readers should be able to stop early and still understand the story. | TLDR reports and executive briefs need the finding in the first screen/page, not a slow buildup of context. | When do we intentionally use a narrative lead instead of a summary lead? |
| Uber Engineering blog | Strong technical articles begin from real operational pain | Uber posts often frame the scale/problem first, explain why the old approach failed, then show how the solution works and what changed. | Technical research briefs need a concrete tension: scale, cost, reliability, coordination, risk, user pain. No abstract “capability map” without a problem. | Which Gengar artifact types should mimic engineering postmortem style? |
| Netflix TechBlog | Makes technical work meaningful to the user experience | Netflix posts often answer “why this matters to members” before diving into implementation. | Analysis cannot end at model scores. It must translate evidence into reader consequence: cost, quality, speed, trust, workflow, or decision. | How visual should implementation detail be in non-technical decks? |
| Google Data Agents Guidebook | Good guidebook pacing | It uses a clear arc: table of contents, definition, system anatomy, why now, roles, role-specific use cases, build path, strategic summary. | Our guidebooks need chapter progression, not a pile of pages. Every page should answer a reader question created by the previous page. | Build reusable guidebook outlines for launch, migration, and buyer education. |
| Bloomberg Explainers | Business readers need context and stakes | Explainers focus on what happened, why it matters, who is affected, what could happen next. | Research briefs need “so what” and “now what,” not only evidence. | Define a Bloomberg-style explainer template for AI releases. |
| The Economist writing style | Clear, concise, evidence-backed argumentation | Strong voice comes from precision, compression, and a defensible point of view, not decorative phrasing. | Gengar voice should be sharp but not performative. Playfulness is allowed only when it clarifies the thought. | Define how spicy is too spicy for enterprise audiences. |
| TLDR newsletters | Busy technical readers reward rapid value extraction | Short summaries, clear labels, and curated relevance help readers decide what deserves attention. | Every report needs a useful front-door: TLDR, why it matters, and what to do next. | Should every artifact include a 5-bullet skim layer? |
| Rich Mironov / product writing | Product readers value blunt practical judgment | Product writing works when it names the user problem, rejects theater, and gives operational guidance. | Our content should say what not to do, not just what changed. The reader should feel protected from bad decisions. | Build a “blunt product judgment” checklist for product-facing pieces. |

## Failure Diagnosis From GPT-5.5 V1/V2

| Failure | Symptom | Root Cause | New Rule |
| --- | --- | --- | --- |
| No reader contract | The reader cannot tell if the brief sells, explains, or instructs. | Artifact objective was not fixed before writing. | Every artifact starts with `reader`, `decision`, `promise`, `after-reading action`. |
| Decorative abstraction | Headings like “Persistence is the product” sound clever but do not orient the reader. | Titles were slogans, not claims. | Headings must answer a reader question or state a finding. |
| Source compression | Pages rephrased facts without synthesis. | Evidence matrix did not convert facts into implications. | Each fact must map to `meaning`, `stakes`, and `action`. |
| No narrative spine | Pages could be shuffled without consequence. | No SCQA or question-led progression. | Every artifact needs a page-by-page question chain. |
| Weak “so what” | Benchmarks appeared without business consequence. | Analysis stopped at evidence. | Every evidence slide must say why the evidence changes a decision. |
| Generic guide advice | DOCX sounded like any AI prompt guide. | No audience-specific job-to-be-done. | Guidebooks must be built around named use cases, constraints, and workflows. |
| Robot voice | Copy was concise but emotionally dead. | Voice rules emphasized polish over human stakes. | Tone must include stakes, friction, and reader relief. |

## First-Principles Writing Model

A useful artifact moves the reader through five questions:

1. What problem am I looking at?
2. Why does this problem matter now?
3. What did the research find?
4. What value is created or destroyed?
5. What should I do differently?

If the artifact cannot answer those five questions in order, it is not ready for design.
