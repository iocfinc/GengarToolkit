# Skill Eval Scorecards

Use these scorecards to evaluate candidate Gengar skills and agent workflows.
Prefer objective checks before rubric scoring. Score each dimension from `0` to
`3`.

- `0`: missing, harmful, or unusable
- `1`: present but weak or unreliable
- `2`: acceptable with minor issues
- `3`: strong, repeatable, and ready to reuse

## Promotion Policy

- `Pass`: no critical failure, average score at least `2.4`, and all required
  evidence present.
- `Partial`: no critical failure, average score at least `1.8`, but one or more
  dimensions needs revision.
- `Fail`: critical failure, missing required artifact, unsafe claim, broken
  instructions, or average score below `1.8`.

Critical failures:

- Fabricates facts, sources, product capabilities, or benchmark results.
- Ignores brand, channel, or audience constraints central to the task.
- Produces a skill that cannot trigger correctly or wastes context with generic
  exposition.
- Fails to report blockers, missing tools, or validation gaps.
- Places reusable Dioscuri-wide harness logic inside this product repo.

## Marketing Writing

Grade foreground tasks that produce landing copy, launch notes, announcements,
ads, campaign briefs, case-study copy, or editorial product writing.

| Dimension | What to check |
| --- | --- |
| Brief adherence | Uses the requested product, audience, channel, length, and deliverable format. |
| Positioning clarity | States the user problem, offer, differentiation, and proof without vague hype. |
| Brand fit | Sounds like Dioscuri/Gengar: concrete, practical, refined, and not generic SaaS filler. |
| Specificity | Uses concrete nouns, constraints, examples, and claims that can be defended. |
| Channel fit | Matches the medium: email, landing page, social card, press note, internal memo, or image prompt. |
| Actionability | Ends with a clear next action, decision, or asset handoff where appropriate. |
| Safety and claims | Avoids unsupported performance claims, false scarcity, and misleading guarantees. |

Suggested deterministic checks:

- Required sections are present.
- Word or character limits are respected.
- Banned phrases and unsupported claims are absent.
- Named product, audience, and channel appear correctly.

## Communications

Grade stakeholder replies, internal updates, issue comments, PR notes, customer
responses, and decision memos.

| Dimension | What to check |
| --- | --- |
| Situation clarity | Summarizes what changed, why it matters, and current status. |
| Decision quality | Separates facts, assumptions, recommendations, and open questions. |
| Tone control | Direct, respectful, and calibrated to the recipient. |
| Next-step ownership | Names the next action, owner, evidence needed, or blocker. |
| Brevity | Removes ceremony and filler without losing necessary context. |
| Traceability | Links or names artifacts, commands, issues, or evidence when needed. |

Suggested deterministic checks:

- Status, validation, and next step are present.
- Open blockers are explicit.
- No invented PR, issue, artifact, or command output is cited.

## Image-Generation Prompting

Grade skills that turn a campaign, brand, or editorial brief into image prompts
or visual QA guidance.

| Dimension | What to check |
| --- | --- |
| Subject fidelity | Names the actual product, people, setting, action, and output purpose. |
| Brand direction | Encodes palette, material, composition, typography relationship, and mood without copying protected style too closely. |
| Composition | Specifies framing, hierarchy, aspect ratio, negative space, and focal point. |
| Production usefulness | Gives enough detail for generation, iteration, and design review. |
| Diversity and safety | Avoids stereotypes, tokenistic regional cues, and unsafe or misleading scenes. |
| Reviewability | Includes acceptance checks the reviewer can apply to generated outputs. |

Suggested deterministic checks:

- Prompt includes subject, scene, medium, aspect ratio, lighting, and exclusion
  constraints.
- Prompt does not rely on "make it beautiful" or another generic taste request.
- Required brand or regional constraints are included without direct imitation.

## Skill Engineering

Grade background tasks that create or improve Codex skills.

| Dimension | What to check |
| --- | --- |
| Trigger precision | `description` says when to use the skill and when not to use it. |
| Context economy | `SKILL.md` keeps only core workflow; bulky variants move to references. |
| Procedural fit | Steps are imperative, ordered, and concrete enough for another agent to follow. |
| Resource design | Scripts, references, and assets are included only when they reduce repeated work. |
| Validation integrity | Forward-tests use raw tasks/artifacts and do not leak expected answers. |
| Boundary discipline | Shared harnesses go to CodexSkills; Gengar-specific policy stays here. |
| Maintenance path | Failures produce clear revisions, regression tasks, or roadmap items. |

Suggested deterministic checks:

- `SKILL.md` frontmatter has only `name` and `description`.
- Skill name is lowercase hyphen-case.
- References are one level deep from `SKILL.md`.
- Any included script has a runnable validation command.

## Agent Workflow

Grade background tasks that use agents, tools, or foreground/background
execution loops.

| Dimension | What to check |
| --- | --- |
| Task classification | Correctly labels feature, bug, refactor, docs, foreground, or background. |
| Tool choice | Uses current docs or primary sources when platform behavior may have changed. |
| Evidence | Captures command output, screenshots, artifact paths, or source links as relevant. |
| Scope control | Keeps one issue/feature per branch and avoids unrelated module churn. |
| Failure handling | Reports exact blockers and stale evidence instead of masking uncertainty. |
| Learning capture | Records durable workflow lessons in the appropriate owner location. |

Suggested deterministic checks:

- Branch name follows `codex/GENGARVIS-###-short-slug` when code changes.
- Changelog is updated for tracked repo changes.
- Visual QA is present for frontend changes or a concrete skip reason is noted.

