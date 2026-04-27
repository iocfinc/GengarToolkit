# Gengar Research And Writing System

Status: initial house standard  
Owner: Dioscuri / Gengar Toolkit  
Purpose: create TLDR reports, analysis decks, pitch decks, and whitepapers that make humans understand the problem, value created, and why it matters.

## The Prime Rule

Do not start with slides. Do not start with templates. Do not start with “what facts do we have?”

Start with the reader’s unresolved question.

A Gengar artifact is good when a busy human can say:

> I understand the problem. I understand the value created. I understand why it matters. I know what to do next.

## Artifact Jobs

| Format | Job | Reader Question | Output Shape |
| --- | --- | --- | --- |
| TLDR Report | Compress a current topic into a usable executive read. | What happened, why should I care, what changes? | 1-page or short DOCX/PDF with answer-first summary and implication bullets. |
| Analysis Deck | Teach a point of view using evidence. | What does the evidence mean, and what decision does it change? | 6–12 slides with a clear argument, not a benchmark scrapbook. |
| Pitch Deck | Create conviction for action. | Why this, why now, why us, why believe? | Persuasive narrative with problem, solution, proof, plan, and ask. |
| Whitepaper / Guide | Help the reader adopt or understand a system. | How do I use this safely and effectively? | Chaptered guide with definitions, examples, operating models, checklists, and caveats. |
| Brand / SOP Doc | Preserve operating knowledge. | What is the standard and how do I follow it? | Durable reference with rules, examples, and edge cases. |

## The Research Note Before The Artifact

Every serious output needs a markdown research note before slides/DOCX. The note is the thinking object. The artifact is the delivery object.

Use this structure:

```markdown
# Research Note: [Topic]

## 1. Reader And Decision
- Primary reader:
- What they already know:
- What they are confused about:
- Decision or action this artifact should unlock:
- What they should remember one week later:

## 2. Situation / Complication / Question / Answer
- Situation: the stable context the reader recognizes.
- Complication: what changed, broke, accelerated, or became newly possible.
- Question: the real question raised by the complication.
- Answer: the governing point of view in one sentence.

## 3. TLDR
- What happened:
- Why it matters:
- What changes:
- What to do next:
- What not to overclaim:

## 4. Evidence Matrix
| Evidence | Source | Confidence | What it means | Reader implication | Caveat |
| --- | --- | --- | --- | --- | --- |

## 5. Narrative Spine
1. Page/slide 1 question:
   - Claim:
   - Evidence:
   - So what:
2. Page/slide 2 question:
   - Claim:
   - Evidence:
   - So what:

## 6. Reader Takeaway Ladder
- If they only read the title:
- If they read the TLDR:
- If they skim headings:
- If they read the whole thing:

## 7. Voice And Stakes
- Human stakes:
- Business stakes:
- Technical stakes:
- Tone: sober / sharp / playful / urgent / skeptical
- Banned phrases:

## 8. Artifact Brief
- Format:
- Length:
- Density:
- Required visuals:
- Required caveats:
- CTA or next action:
```

## Headline Rules

A heading is not a vibe. A heading is a promise.

Bad headings:
- “Persistence is the product”
- “The benchmark signal is execution”
- “Where the step change shows up”

Why they fail:
- They sound like internal shorthand.
- They do not tell the reader what to think.
- They do not answer a question.

Better headings:
- “GPT-5.5 matters most when work spans tools, files, and review gates.”
- “The strongest benchmark gains point to execution-heavy tasks, not casual chat.”
- “For teams, the upgrade question is which workflows can be delegated safely.”

A good heading should pass three tests:
1. Could a reader understand the page without reading the body?
2. Does it make a claim that can be supported or challenged?
3. Does it move the story forward from the previous page?

## Narrative Patterns

### 1. Minto / Consultant Logic
Use for recommendations and executive decisions.

- Answer first.
- Support with 3–5 logically grouped reasons.
- Ensure each group is MECE enough to prevent repetition.
- Use the reader’s next question to determine the next section.

Default pattern:

1. Recommendation
2. Reason 1
3. Reason 2
4. Reason 3
5. Risks / caveats
6. Next action

### 2. Journalistic Explainer
Use for releases, market changes, policy shifts, and fast-moving topics.

1. What happened?
2. Why now?
3. Why it matters?
4. Who is affected?
5. What changes next?
6. What to watch?

### 3. Technical Case Study
Use for engineering, data, and AI system stories.

1. The real-world problem
2. Why the old approach failed
3. The design principle
4. The system or workflow
5. The result
6. Lessons and tradeoffs

### 4. Guidebook / Adoption Manual
Use for “what you can do with X.”

1. Define the thing
2. Explain why it matters now
3. Show the system anatomy
4. Map users or jobs
5. Provide recipes / examples
6. Provide checks, caveats, and operating model
7. Summarize adoption path

## The Five-Question Gate

Before design, answer these in plain English:

1. What is the problem?
2. What changed?
3. What did we find?
4. What value is created or at risk?
5. What should the reader do next?

If any answer is vague, do not make slides.

## Evidence To Insight Ladder

Do not paste facts directly into slides. Climb the ladder:

1. Fact: what the source says.
2. Pattern: what repeats across facts.
3. Tension: what is surprising, broken, risky, or newly possible.
4. Insight: what the reader should now believe.
5. Action: what the reader should do differently.

Example:

- Fact: OpenAI reports GPT-5.5 improves on OSWorld and Terminal-Bench.
- Pattern: gains appear in tool-using, execution-heavy evaluations.
- Tension: organizations still evaluate AI through chat demos and generic benchmarks.
- Insight: the useful test is workflow delegation, not chat quality.
- Action: select one tool-heavy workflow and evaluate task completion with review gates.

## Voice Standard

Gengar voice should be:

- Clear before clever.
- Human before technical.
- Specific before grand.
- Useful before impressive.
- Playful only when it sharpens the point.

Allowed moves:
- Blunt product judgment: “This is not a migration plan; it is a search-and-replace accident.”
- Human stakes: “The analyst does not need another dashboard. They need three hours back and fewer errors.”
- Analytical compression: “The benchmark is not the story. The work boundary is.”

Banned moves:
- Slogan-only headings.
- Generic AI optimism.
- “Unlock,” “reimagine,” “step-change,” or “frontier” unless the sentence earns it.
- Dense noun stacks that sound like robots briefing robots.
- Evidence without implication.

## Pre-Design Acceptance Checklist

Before creating a deck, DOCX, PDF, or contact sheet:

- Reader and decision are explicit.
- SCQA is written.
- Governing answer is one sentence.
- Evidence matrix separates fact, inference, implication, and caveat.
- Narrative spine has page/slide questions in order.
- Each heading is a claim, not a label.
- Every evidence object has a “so what.”
- There is a clear ending: recommendation, CTA, decision, checklist, or watch item.
- Marketing artifacts name the offer, audience, promise, proof, and CTA. If the reader cannot tell what is being sold or what to do next, the copy fails.
- Research decks explain and recommend; they do not merely restate benchmark tables.
- Guidebooks and whitepapers teach adoption with real paragraphs, examples, operating rules, and review checklists. Do not stretch deck bullets into pages.
- Short decks stay in one visual mode unless the brief explicitly calls for a narrative mode shift.

## How This Fixes The GPT-5.5 Research Brief

A real research note for GPT-5.5 should not begin with slide headings. It should begin like this:

- Reader: AI/product/data leaders evaluating whether GPT-5.5 changes their operating roadmap.
- Confusion: Is this just a smarter model, or does it change what work can be delegated?
- Complication: OpenAI’s release emphasizes coding, computer use, documents, spreadsheets, scientific workflows, and safeguards.
- Question: What does GPT-5.5 make newly practical, and how should teams evaluate it?
- Answer: GPT-5.5 should be evaluated as a workflow delegation model, not a chatbot upgrade; the right pilot is a tool-heavy workflow with clear review gates.

That note creates a human-readable artifact. Without it, the deck becomes a collage of clever fragments.

## Codex Skill

This system is also packaged as a reusable Codex skill at:

`/Users/iraoliverfernando/Desktop/Dioscuri/CodexSkills/.agents/skills/research-writing-system/SKILL.md`

Use that skill whenever creating TLDR reports, analysis decks, pitch decks, whitepapers, guidebooks, research notes, or article syntheses.
