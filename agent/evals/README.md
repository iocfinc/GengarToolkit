# Gengar Skill Eval Framework

This folder defines the product-specific evaluation layer for Gengar marketing,
writing, communications, image-generation, and agent-workflow skills.

It is not the shared eval runner. Reusable harness logic, cross-repo skill
training loops, and generic evaluator scripts should live in CodexSkills. This
folder should hold only the Gengar problem set, scorecards, acceptance policy,
and local evidence expectations.

## Feature Summary

Create a "skill gym" for Gengar: a set of realistic tasks, rubrics, and
promotion gates that lets maintainers improve skills through repeated,
comparable runs rather than one-off prompting taste checks.

## User Impact

- Marketing and communications skills can be evaluated against real campaign,
  editorial, and stakeholder-output expectations.
- Image-generation prompting skills can be checked for brand fit, prompt
  completeness, and reviewable output evidence.
- Agent-development skills can be tested as engineering workflows with trigger
  precision, context economy, validation, and forward-testing as first-class
  criteria.
- Foreground tasks and background tasks get different success measures, so fast
  visible output is not judged the same way as long-running research,
  maintenance, or training work.

## External Baseline

The framework borrows the shape of an eval suite, not a single benchmark.

- OpenAI's eval guidance frames evals as task datasets plus grading criteria,
  useful for detecting prompt and model regressions in CI-style loops:
  https://developers.openai.com/api/docs/guides/evals
- OpenAI's Codex skills docs define skills as directories with `SKILL.md` plus
  optional scripts, references, assets, and metadata. That maps directly to
  skill-engineering rubric dimensions:
  https://developers.openai.com/codex/skills
- WritingBench is a useful external reference for broad generative-writing
  domains, but Gengar still needs local brand and channel criteria:
  https://arxiv.org/abs/2503.05244
- GenEval and VBench-style image/video benchmarks are useful for prompt
  following and visual quality dimensions, but branded marketing outputs still
  need human-visible brand, layout, and claims checks:
  https://arxiv.org/abs/2310.11513 and https://arxiv.org/abs/2311.17982

## Technical Design

Use a four-layer eval stack:

1. `Task card`: a concrete user request with inputs, expected deliverables,
   allowed tools, and foreground/background mode.
2. `Skill run`: the candidate skill or agent workflow produces artifacts,
   notes, and validation evidence without seeing the hidden grader notes.
3. `Scorecard`: deterministic checks first, then rubric scoring for subjective
   qualities. See `scorecards.md`.
4. `Promotion gate`: pass, partial, or fail decision with required follow-up.

Use this folder for task cards and scorecards. Use CodexSkills for reusable
scripts that execute runs, compare outputs, aggregate scores, or package
cross-repo skill-training workflows.

## Foreground And Background Lanes

Foreground tasks are user-visible deliverables where the value is the output
itself. Examples:

- Draft a launch email from a brief.
- Rewrite a product announcement in a tighter brand voice.
- Create an image-generation prompt for a campaign visual.
- Produce a stakeholder reply with decision context and next steps.

Background tasks are agent-maintenance or research loops where the value is the
process and evidence. Examples:

- Improve a skill after failed forward-testing.
- Build a problem set for a new marketing domain.
- Audit a skill for trigger drift and context bloat.
- Compare external benchmarks and decide what applies locally.

Foreground evals should grade output quality, brand fit, usability, and
delivery format. Background evals should grade procedure quality, evidence,
failure handling, and reusable learning capture.

## Modules Impacted

- `agent/evals/README.md`: framework, ownership boundary, and feature plan.
- `agent/evals/scorecards.md`: Gengar-specific rubrics and promotion policy.
- `agent/evals/problem-set.v0.json`: seed machine-readable problem set.
- `CHANGELOG.md`: planning artifact entry.

No `src/`, rendering, export, or app-shell modules are touched.

## UI Changes

None.

## State Changes

None.

## Rendering Changes

None.

## Tests Required

- Validate JSON syntax for `problem-set.v0.json`.
- Run `git diff --check`.
- No browser visual-validation pass is required because this change does not
  affect frontend behavior.

## Delegation Plan

- `slardar`: skip for this slice; the touched surface is isolated to new
  `agent/evals` docs and changelog.
- `oracle`: fulfilled in the main thread with current OpenAI developer docs
  because this slice depends on current Codex skills and eval guidance.
- `clinkz`: skip for this narrow docs-only slice; the main thread owns docs
  integration and changelog wording.

## Evidence Plan

- JSON parse proof for the seed problem set.
- Whitespace check through `git diff --check`.
- Source links retained in this README so later implementation can refresh the
  baseline when OpenAI/Codex behavior changes.

## Risks

- Rubric scoring can become taste theater if graders only produce prose. Keep
  deterministic checks first and require concrete artifact evidence.
- A generic runner would be reusable across Dioscuri repos. Do not implement it
  here; move that work to CodexSkills.
- Marketing and image quality are subjective. Use repeated blind runs, multiple
  examples per domain, and score distributions rather than trusting one sample.
- Benchmarks drift quickly. Refresh external references before turning this
  into automated CI or model-comparison reporting.

## Implementation Plan

1. Land v0 Gengar eval framework docs.
2. Add 8-12 seed task cards across writing, communications, image prompting,
   skill authoring, and agent workflow.
3. Use the scorecards manually on two existing skills and record gaps.
4. Move shared runner design to CodexSkills before adding scripts.
5. Promote only skills that pass the relevant foreground or background gate
   twice on different tasks.
