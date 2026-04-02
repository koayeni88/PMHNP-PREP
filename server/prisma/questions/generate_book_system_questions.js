#!/usr/bin/env node

/**
 * Generate system-body question objects from a source book label.
 *
 * Usage:
 *   node server/prisma/questions/generate_book_system_questions.js \
 *     --book "Lehne's Pharmacotherapeutics" \
 *     --count-per-system 50 \
 *     --out server/prisma/questions/generated_book_system_questions.js
 *
 * Optional:
 *   --seed 2026
 *   --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SYSTEMS = [
  {
    label: 'Neuro (PNS/CNS)',
    clinicalTopic: 'neuro_pns_cns',
    subtopics: [
      'seizure-control ion channel modulation',
      'migraine triptan receptor targeting',
      'dopaminergic pathway balancing',
      'cholinergic symptom strategy in dementia',
      'neuropathic pain signal dampening'
    ],
    mechanisms: [
      'use-dependent sodium-channel suppression of pathologic firing',
      '5-HT receptor subtype-directed trigeminovascular inhibition',
      'targeted modulation of dopamine signaling across motor/limbic tracts',
      'enhancement of synaptic acetylcholine through enzyme inhibition',
      'presynaptic calcium-channel subunit modulation to reduce excitatory release'
    ],
    examTip: 'Differentiate pathway-level efficacy from class-label memorization.'
  },
  {
    label: 'Cardiovascular',
    clinicalTopic: 'cardiovascular',
    subtopics: [
      'neurohormonal blockade in HFrEF',
      'rate and rhythm control pharmacodynamics',
      'antianginal demand-supply balancing',
      'lipid pathway interruption',
      'vascular tone modulation'
    ],
    mechanisms: [
      'RAAS signal interruption reducing remodeling and afterload stress',
      'nodal ion-channel and receptor-level conduction slowing',
      'preload/afterload optimization through vasoactive signaling',
      'hepatic LDL-clearance enhancement via synthesis/uptake pathways',
      'receptor-mediated reduction in maladaptive sympathetic drive'
    ],
    examTip: 'Map mechanism to outcome domain: mortality, hospitalization, or symptom relief.'
  },
  {
    label: 'Endocrine',
    clinicalTopic: 'endocrine',
    subtopics: [
      'incretin pathway optimization',
      'hepatic glucose output control',
      'insulin sensitivity enhancement',
      'thyroid hormone synthesis control',
      'bone turnover modulation'
    ],
    mechanisms: [
      'glucose-dependent insulin support with counter-regulatory suppression',
      'reduction of gluconeogenic flux through metabolic signaling shifts',
      'nuclear-receptor transcriptional reprogramming of glucose handling',
      'enzyme-level interruption of thyroid hormone production steps',
      'osteoclast/osteoblast pathway targeting for net skeletal protection'
    ],
    examTip: 'Use physiology-first reasoning before selecting pharmacologic class.'
  },
  {
    label: 'Respiratory',
    clinicalTopic: 'respiratory',
    subtopics: [
      'airway smooth-muscle bronchodilation',
      'chronic airway inflammation suppression',
      'biologic phenotype targeting',
      'mucus hypersecretion control',
      'exacerbation-prevention strategy'
    ],
    mechanisms: [
      'receptor-mediated smooth-muscle relaxation and airflow improvement',
      'transcription-level suppression of pro-inflammatory cytokine cascades',
      'cytokine-axis interruption matched to biomarker phenotype',
      'autonomic pathway modulation reducing cholinergic constriction tone',
      'immune-effector dampening to reduce severe event recurrence'
    ],
    examTip: 'Controller strategy should match phenotype and exacerbation profile.'
  },
  {
    label: 'Digestive',
    clinicalTopic: 'digestive',
    subtopics: [
      'acid secretion inhibition',
      'mucosal protection strategy',
      'gut-targeted inflammation control',
      'antiemetic receptor targeting',
      'hepatic encephalopathy bowel chemistry'
    ],
    mechanisms: [
      'terminal acid-secretory pathway suppression in parietal cells',
      'topical barrier or prostaglandin-mediated mucosal defense enhancement',
      'segment-specific local anti-inflammatory mediator modulation',
      'emesis-circuit receptor antagonism in peripheral and central pathways',
      'ammonia handling shifts via luminal chemistry and transit effects'
    ],
    examTip: 'Select therapy by dominant pathology: acid, inflammation, motility, or toxin handling.'
  },
  {
    label: 'Musculoskeletal',
    clinicalTopic: 'musculoskeletal',
    subtopics: [
      'urate pathway control',
      'crystal inflammation attenuation',
      'bone resorption suppression',
      'anabolic bone stimulation',
      'autoimmune synovial inflammation control'
    ],
    mechanisms: [
      'enzyme-level uric acid production reduction',
      'innate immune cell migration/signaling suppression',
      'osteoclast pathway blockade through ligand-receptor interruption',
      'intermittent receptor activation driving net osteoblastic formation',
      'targeted cytokine network inhibition in synovial tissues'
    ],
    examTip: 'Align mechanism with disease phase: flare treatment vs long-term modification.'
  },
  {
    label: 'Urinary',
    clinicalTopic: 'urinary',
    subtopics: [
      'bladder storage-phase modulation',
      'outlet-relaxation strategy in LUTS',
      'hormonal prostate-volume reduction',
      'water-balance receptor targeting',
      'renal protection signaling'
    ],
    mechanisms: [
      'detrusor receptor targeting to improve storage dynamics',
      'smooth-muscle receptor antagonism at prostate/bladder neck',
      'androgen-conversion blockade reducing trophic stimulation',
      'collecting-duct receptor activation for antidiuretic response',
      'nephron-hemodynamic pathway modulation for risk reduction'
    ],
    examTip: 'Differentiate rapid symptom relief from slow structural disease modification.'
  },
  {
    label: 'Hematology',
    clinicalTopic: 'hematology',
    subtopics: [
      'coagulation cascade interruption',
      'platelet activation blockade',
      'iron repletion strategy',
      'erythropoiesis stimulation',
      'thrombus prevention optimization'
    ],
    mechanisms: [
      'enzyme-level blockade within common coagulation pathway',
      'surface receptor inhibition preventing platelet aggregation amplification',
      'route-dependent restoration of iron substrate availability',
      'receptor-driven marrow precursor survival and differentiation support',
      'pathway-selective anticoagulation balancing efficacy and bleeding risk'
    ],
    examTip: 'Always separate platelet-targeted from coagulation-enzyme-targeted therapies.'
  },
  {
    label: 'Immunology',
    clinicalTopic: 'immunology',
    subtopics: [
      'cell-wall synthesis inhibition',
      'ribosomal protein synthesis blockade',
      'viral lifecycle interruption',
      'fungal membrane synthesis targeting',
      'immune-cell pathway modulation'
    ],
    mechanisms: [
      'structural assembly blockade causing microbe viability collapse',
      'translation-phase inhibition with class-specific ribosomal targeting',
      'pathogen-specific activation and polymerase pathway interruption',
      'sterol synthesis pathway suppression in fungal membranes',
      'precision cytokine/receptor pathway modulation in immune disease'
    ],
    examTip: 'Tie mechanism directly to organism class, resistance pattern, and site of infection.'
  },
  {
    label: "Women's Health",
    clinicalTopic: 'womens_health',
    subtopics: [
      'ovulation suppression',
      'cervical mucus strategy',
      'hormonal axis modulation',
      'endometrial suppression',
      'fertility induction feedback control'
    ],
    mechanisms: [
      'hypothalamic-pituitary-gonadal axis suppression of gonadotropin peaks',
      'progestin-mediated barrier enhancement against sperm penetration',
      'receptor-level hormone synthesis or signaling interruption',
      'local endometrial transformation reducing proliferative response',
      'central feedback antagonism increasing gonadotropin release'
    ],
    examTip: 'Match reproductive goals (contraception, bleeding control, fertility) to mechanism.'
  },
  {
    label: 'Dermatology',
    clinicalTopic: 'dermatology',
    subtopics: [
      'cytokine-axis biologic selection',
      'topical immune modulation',
      'sebaceous-pathway control',
      'keratinocyte proliferation control',
      'itch inflammation signaling'
    ],
    mechanisms: [
      'targeted cytokine neutralization interrupting inflammatory cascades',
      'intracellular signaling suppression in cutaneous immune cells',
      'sebaceous and follicular differentiation pathway normalization',
      'proliferative signaling attenuation in epidermal compartments',
      'pruritus-related inflammatory pathway inhibition'
    ],
    examTip: 'Choose therapy by phenotype and inflammation axis, not diagnosis label alone.'
  },
  {
    label: 'Pain Management',
    clinicalTopic: 'pain_management',
    subtopics: [
      'opioid receptor pharmacodynamics',
      'neuropathic pathway modulation',
      'inflammatory pain mediator control',
      'descending inhibitory pathway enhancement',
      'overdose reversal strategy'
    ],
    mechanisms: [
      'mu-receptor signaling with intrinsic-activity-dependent safety profile',
      'calcium-channel subunit and excitatory release suppression',
      'cyclooxygenase-mediated prostaglandin pathway reduction',
      'monoaminergic pathway support in spinal inhibitory circuits',
      'competitive receptor antagonism with duration-mismatch implications'
    ],
    examTip: 'Balance mechanism-driven efficacy with dependence and safety-risk mitigation.'
  }
];

const DISTRACTORS = [
  'Exclusive IL-5 neutralization in eosinophilic pathways as the primary mechanism',
  'Irreversible COX-1 inhibition as a universal first-line strategy',
  'Direct bacterial DNA gyrase inhibition independent of disease context',
  'Skeletal neuromuscular nicotinic agonism as the core therapeutic pathway'
];

const CATEGORIES = ['Pharmacology_Systems', 'Pathophysiology', 'Pharmacology', 'Physical Assessment'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const TOPIC_TO_FILE = {
  neuro_pns_cns: 'server/prisma/questions/neuro_pns_cns.js',
  cardiovascular: 'server/prisma/questions/cardiovascular.js',
  endocrine: 'server/prisma/questions/endocrine.js',
  digestive: 'server/prisma/questions/digestive_msk_urinary.js',
  musculoskeletal: 'server/prisma/questions/digestive_msk_urinary.js',
  urinary: 'server/prisma/questions/digestive_msk_urinary.js',
  womens_health: 'server/prisma/questions/mens_womens_health.js',
  immunology: 'server/prisma/questions/antimicrobial_cell_wall.js',
  respiratory: 'server/prisma/questions/additional_fnp_pa.js',
  hematology: 'server/prisma/questions/additional_fnp_pa.js',
  dermatology: 'server/prisma/questions/additional_fnp_pa.js',
  pain_management: 'server/prisma/questions/additional_fnp_pa.js'
};

const FILE_TO_EXPORT = {
  'server/prisma/questions/neuro_pns_cns.js': 'neuroPnsCnsQuestions',
  'server/prisma/questions/cardiovascular.js': 'cardiovascularQuestions',
  'server/prisma/questions/endocrine.js': 'endocrineQuestions',
  'server/prisma/questions/digestive_msk_urinary.js': 'digestiveMusculoskeletalUrinaryQuestions',
  'server/prisma/questions/mens_womens_health.js': 'mensWomensHealthQuestions',
  'server/prisma/questions/antimicrobial_cell_wall.js': 'antimicrobialCellWallQuestions',
  'server/prisma/questions/additional_fnp_pa.js': 'additionalFnpPaQuestions'
};

function groupByDestinationFile(items) {
  const grouped = {};
  for (const item of items) {
    const file = TOPIC_TO_FILE[item.clinicalTopic];
    if (!file) continue;
    if (!grouped[file]) grouped[file] = [];
    grouped[file].push(item);
  }
  return grouped;
}

function toJsObjectLiteral(value, indentLevel = 0) {
  const indent = '  '.repeat(indentLevel);
  const nextIndent = '  '.repeat(indentLevel + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const rows = value.map((entry) => `${nextIndent}${toJsObjectLiteral(entry, indentLevel + 1)}`);
    return `[\n${rows.join(',\n')}\n${indent}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const rows = entries.map(([key, val]) => `${nextIndent}${key}: ${toJsObjectLiteral(val, indentLevel + 1)}`);
    return `{\n${rows.join(',\n')}\n${indent}}`;
  }

  return JSON.stringify(value);
}

function appendQuestionsToArrayFile(filePath, items) {
  if (!items.length) return 0;

  const absolutePath = path.resolve(process.cwd(), filePath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const newBlock = items.map((q) => toJsObjectLiteral(q, 1)).join(',\n');

  const closeArrayPattern = /\n\];\s*$/;
  if (!closeArrayPattern.test(content)) {
    throw new Error(`Could not find array terminator in ${filePath}`);
  }

  const updated = content.replace(closeArrayPattern, `,\n${newBlock}\n];\n`);
  fs.writeFileSync(absolutePath, updated, 'utf8');
  return items.length;
}

function normalizeStem(stem) {
  return String(stem || '').trim().replace(/\s+/g, ' ');
}

async function loadExistingStems(filePath) {
  const exportName = FILE_TO_EXPORT[filePath];
  if (!exportName) {
    throw new Error(`No export mapping configured for ${filePath}`);
  }

  const absolutePath = path.resolve(process.cwd(), filePath);
  const fileUrl = pathToFileURL(absolutePath).href;
  const mod = await import(fileUrl);
  const questionsArray = mod[exportName];

  if (!Array.isArray(questionsArray)) {
    throw new Error(`Expected array export ${exportName} in ${filePath}`);
  }

  return new Set(
    questionsArray
      .map((q) => q?.stem)
      .map((stem) => normalizeStem(stem))
      .filter((stem) => stem.length > 0)
  );
}

async function buildAppendPlan(groupedByFile) {
  const appendPlan = {};
  const stats = [];

  for (const [file, items] of Object.entries(groupedByFile)) {
    const existingStems = await loadExistingStems(file);
    const seen = new Set(existingStems);
    const toAppend = [];
    let skipped = 0;

    for (const item of items) {
      const normalizedStem = normalizeStem(item.stem);
      if (seen.has(normalizedStem)) {
        skipped += 1;
        continue;
      }
      toAppend.push(item);
      seen.add(normalizedStem);
    }

    appendPlan[file] = toAppend;
    stats.push({
      file,
      generated: items.length,
      appendable: toAppend.length,
      skipped
    });
  }

  stats.sort((a, b) => a.file.localeCompare(b.file));
  return { appendPlan, stats };
}

function bennerStageFor(difficulty, idx) {
  if (difficulty === 'easy') return 'novice';
  if (difficulty === 'medium') return idx % 2 === 0 ? 'advanced_beginner' : 'competent';
  return idx % 2 === 0 ? 'proficient' : 'expert';
}

function questionTypeFor(difficulty) {
  return difficulty === 'hard' ? 'advanced' : 'standard';
}

function difficultyToObjectivePrefix(difficulty) {
  if (difficulty === 'easy') return 'Identify';
  if (difficulty === 'medium') return 'Apply';
  return 'Integrate';
}

const args = (() => {
  const parsed = {};
  for (let i = 2; i < process.argv.length; i += 1) {
    const token = process.argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = process.argv[i + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i += 1;
    }
  }
  return parsed;
})();

function parsePositiveInt(rawValue, fieldName) {
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer. Received: ${rawValue}`);
  }
  return value;
}

function parseNonNegativeInt(rawValue, fieldName) {
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer. Received: ${rawValue}`);
  }
  return value;
}

function printDistribution(distribution, modeLabel) {
  console.log('Distribution by file:');
  for (const row of distribution) {
    console.log(`- ${row.file}: generated=${row.generated}, ${modeLabel}=${row.appendable}, skipped_existing=${row.skipped}`);
  }
}

async function main() {
  const bookTitle = args.book || 'Attached Source Book';
  const countPerSystem = parsePositiveInt(args['count-per-system'] || 50, '--count-per-system');
  const outputPath = args.out || 'server/prisma/questions/generated_book_system_questions.js';
  const dryRun = Boolean(args['dry-run']);
  const appendToSystemFiles = !Boolean(args['no-append']);
  const seed = parseNonNegativeInt(args.seed || 2026, '--seed');

  let randomState = seed >>> 0;
  function rand() {
    randomState += 0x6d2b79f5;
    let r = Math.imul(randomState ^ (randomState >>> 15), 1 | randomState);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  }

  function pick(arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  const questions = [];
  for (const system of SYSTEMS) {
    for (let i = 0; i < countPerSystem; i += 1) {
      const category = CATEGORIES[i % CATEGORIES.length];
      const difficulty = DIFFICULTIES[i % DIFFICULTIES.length];
      const bennerStage = bennerStageFor(difficulty, i);
      const questionType = questionTypeFor(difficulty);
      const subtopic = system.subtopics[i % system.subtopics.length];
      const mechanism = system.mechanisms[i % system.mechanisms.length];
      const objectivePrefix = difficultyToObjectivePrefix(difficulty);

      const stem = `Book-based ${system.label} question ${i + 1}: In ${bookTitle}, a case centers on ${subtopic}. Which mechanism best explains the expected therapeutic effect?`;

      const optionA = pick(DISTRACTORS);
      const optionB = mechanism;
      const optionC = pick(DISTRACTORS.filter((d) => d !== optionA));
      const optionD = pick(DISTRACTORS.filter((d) => d !== optionA && d !== optionC));

      questions.push({
        stem,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer: 'B',
        rationale: `Within ${system.label}, this scenario is best explained by ${mechanism}. Mechanism-target alignment from ${bookTitle} supports treatment precision and safer follow-up decisions.`,
        explanationA: 'This option is not the dominant mechanism for the scenario presented.',
        explanationB: 'Correct. This mechanism matches the pathway focus and expected therapeutic effect.',
        explanationC: 'This alternative mechanism is mismatched to the clinical pathway emphasized in the scenario.',
        explanationD: 'This choice reflects a different therapeutic domain and does not best explain the expected effect.',
        examTip: system.examTip,
        category,
        subtopic: `${system.label} - ${subtopic}`,
        difficulty,
        bennerStage,
        clinicalReasoningObj: `${objectivePrefix} pathway-level mechanism selection for ${system.label} care based on ${bookTitle} content`,
        questionType,
        clinicalTopic: system.clinicalTopic,
        pharmacologyFocus: category === 'Physical Assessment'
          ? ''
          : 'moa,receptor_activity,adverse_effects,drug_interactions',
        bennerBreakdown: `${bennerStage.charAt(0).toUpperCase() + bennerStage.slice(1)} learners should connect pathway mechanism, patient phenotype, and monitoring strategy in ${system.label}.`
      });
    }
  }

  const output = `// Auto-generated from ${bookTitle}\n// Systems: ${SYSTEMS.length}, Questions per system: ${countPerSystem}\n// Total questions: ${questions.length}\n\nexport const generatedBookSystemQuestions = ${JSON.stringify(questions, null, 2)};\n`;

  const groupedByFile = groupByDestinationFile(questions);
  const { appendPlan, stats: distribution } = appendToSystemFiles
    ? await buildAppendPlan(groupedByFile)
    : {
        appendPlan: groupedByFile,
        stats: Object.entries(groupedByFile)
          .map(([file, items]) => ({ file, generated: items.length, appendable: 0, skipped: items.length }))
          .sort((a, b) => a.file.localeCompare(b.file))
      };

  if (dryRun) {
    console.log('Dry run complete.');
    console.log(`Book: ${bookTitle}`);
    console.log(`Systems: ${SYSTEMS.length}`);
    console.log(`Questions per system: ${countPerSystem}`);
    console.log(`Total generated: ${questions.length}`);
    console.log(`Output target: ${outputPath}`);
    printDistribution(distribution, 'appendable');
    console.log(`Append to system files: ${appendToSystemFiles ? 'yes' : 'no'}`);
    return;
  }

  const absoluteOut = path.resolve(process.cwd(), outputPath);
  fs.mkdirSync(path.dirname(absoluteOut), { recursive: true });
  fs.writeFileSync(absoluteOut, output, 'utf8');

  if (appendToSystemFiles) {
    for (const [file, items] of Object.entries(appendPlan)) {
      appendQuestionsToArrayFile(file, items);
    }
  }

  console.log('Generation complete.');
  console.log(`Book: ${bookTitle}`);
  console.log(`Systems: ${SYSTEMS.length}`);
  console.log(`Questions per system: ${countPerSystem}`);
  console.log(`Total generated: ${questions.length}`);
  console.log(`Written to: ${outputPath}`);
  printDistribution(distribution, 'appended');
  console.log(`Appended to system files: ${appendToSystemFiles ? 'yes' : 'no'}`);
}

main().catch((error) => {
  console.error('Generator failed:', error.message);
  process.exit(1);
});
