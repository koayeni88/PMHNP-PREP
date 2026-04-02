# Book System Question Generator

This document explains how to use the body-system question generator script.

## File

- Script: `server/prisma/questions/generate_book_system_questions.js`
- Output (default): `server/prisma/questions/generated_book_system_questions.js`

## Purpose

Generate a question bank from a source book label with a fixed number of questions per body system.

When run normally, the script does two things:
- Creates/updates the generated output file.
- Automatically appends generated questions into mapped body-system question files.

Duplicate protection:
- The script checks existing destination files by `stem`.
- If a generated question `stem` already exists, it is skipped (not appended again).
- This makes repeated runs idempotent for existing questions.

Default behavior:
- 12 body systems
- 50 questions per system
- 600 total questions

## Run Commands

From the project root:

```bash
node server/prisma/questions/generate_book_system_questions.js --book "Attached PMHNP Text" --count-per-system 50 --out server/prisma/questions/generated_book_system_questions.js
```

Dry run (no file written):

```bash
node server/prisma/questions/generate_book_system_questions.js --book "Attached PMHNP Text" --count-per-system 50 --dry-run
```

## Options

- `--book <title>`
  - Source label inserted into generated stems/rationales.
  - Default: `Attached Source Book`

- `--count-per-system <number>`
  - Number of questions generated for each body system.
  - Default: `50`
  - Must be a positive integer.

- `--out <path>`
  - Output file path for generated questions.
  - Default: `server/prisma/questions/generated_book_system_questions.js`

- `--seed <number>`
  - Seed for deterministic randomization.
  - Default: `2026`
  - Must be a non-negative integer.

- `--dry-run`
  - Prints generation summary only; does not write output file.

- `--no-append`
  - Prevents auto-append into body-system files.
  - Use this when you only want the generated output file.

## Generated Schema

The script outputs:

```js
export const generatedBookSystemQuestions = [
  {
    stem,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    rationale,
    explanationA,
    explanationB,
    explanationC,
    explanationD,
    examTip,
    category,
    subtopic,
    difficulty,
    bennerStage,
    clinicalReasoningObj,
    questionType,
    clinicalTopic,
    pharmacologyFocus,
    bennerBreakdown
  }
]
```

## Notes

- Categories rotate across:
  - `Pharmacology_Systems`
  - `Pathophysiology`
  - `Pharmacology`
  - `Physical Assessment`

- Difficulties rotate across:
  - `easy`
  - `medium`
  - `hard`

- The generator is ESM-compatible and runs under the server package configuration (`"type": "module"`).

## Body-System File Routing

Generated questions are automatically routed by `clinicalTopic` and appended to these files:

- `neuro_pns_cns` -> `server/prisma/questions/neuro_pns_cns.js`
- `cardiovascular` -> `server/prisma/questions/cardiovascular.js`
- `endocrine` -> `server/prisma/questions/endocrine.js`
- `digestive`, `musculoskeletal`, `urinary` -> `server/prisma/questions/digestive_msk_urinary.js`
- `womens_health` -> `server/prisma/questions/mens_womens_health.js`
- `immunology` -> `server/prisma/questions/antimicrobial_cell_wall.js`
- `respiratory`, `hematology`, `dermatology`, `pain_management` -> `server/prisma/questions/additional_fnp_pa.js`

Use `--dry-run` first to preview the per-file distribution before writing changes.
Dry-run and normal output include `generated`, `appendable/appended`, and `skipped_existing` counts.

## Error Handling

- Invalid input (for example, `--count-per-system 0`) exits with code `1` and prints a clear error.
- If routing/export mapping is missing for a destination file, the script fails fast with an actionable message.
