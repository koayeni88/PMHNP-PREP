export const BENNER_STAGES = [
  { key: 'novice', label: 'Novice', color: 'purple', description: 'Basic facts, definitions, and recognition' },
  { key: 'advanced_beginner', label: 'Advanced Beginner', color: 'indigo', description: 'Simple patient scenarios and pattern recognition' },
  { key: 'competent', label: 'Competent', color: 'blue', description: 'Clinical prioritization and differential thinking' },
  { key: 'proficient', label: 'Proficient', color: 'sky', description: 'Complex case interpretation and nuanced decisions' },
  { key: 'expert', label: 'Expert', color: 'cyan', description: 'Integrated psychiatric reasoning and best-next-step decisions' }
];

export const CATEGORIES = [
  { key: 'Pathophysiology', label: 'Pathophysiology', icon: '🧠', color: 'rose' },
  { key: 'Pharmacology', label: 'Pharmacology', icon: '💊', color: 'emerald' },
  { key: 'Physical Assessment', label: 'Physical Assessment', icon: '🩺', color: 'amber' },
  { key: 'Pharmacology_Systems', label: 'Systems Pharmacology', icon: '⚕️', color: 'violet' }
];

export const QUESTION_TYPES = [
  { key: 'standard', label: 'Standard' },
  { key: 'advanced', label: 'Advanced' }
];

export const CLINICAL_TOPICS = [
  { key: 'general', label: 'General', icon: '📚' },
  { key: 'mood_disorders', label: 'Mood Disorders', icon: '🌊' },
  { key: 'anxiety_disorders', label: 'Anxiety Disorders', icon: '😰' },
  { key: 'psychotic_disorders', label: 'Psychotic Disorders', icon: '🔮' },
  { key: 'trauma_related', label: 'Trauma-Related Disorders', icon: '⚡' },
  { key: 'adhd', label: 'ADHD', icon: '🎯' },
  { key: 'substance_use', label: 'Substance Use Disorders', icon: '🧪' },
  { key: 'sleep_disorders', label: 'Sleep Disorders', icon: '🌙' },
  { key: 'child_adolescent', label: 'Child/Adolescent Psychiatry', icon: '👶' },
  { key: 'geriatric', label: 'Geriatric Psychiatry', icon: '👴' },
  { key: 'perinatal', label: 'Perinatal Psychiatry', icon: '🤰' },
  { key: 'psychotherapy', label: 'Psychotherapy Principles', icon: '💬' },
  { key: 'legal_ethical', label: 'Legal/Ethical Issues', icon: '⚖️' },
  { key: 'dsm_diagnosis', label: 'DSM-Based Diagnosis', icon: '📋' },
  { key: 'psychiatric_assessment', label: 'Psychiatric Assessment', icon: '🔍' },
  { key: 'neuro_pns_cns', label: 'Neuro (PNS-CNS)', icon: '🧬' },
  { key: 'endocrine', label: 'Endocrine System', icon: '🦋' },
  { key: 'cardiovascular', label: 'Cardiovascular', icon: '❤️' },
  { key: 'digestive', label: 'Digestive/GI', icon: '🫁' },
  { key: 'musculoskeletal', label: 'Musculoskeletal', icon: '🦴' },
  { key: 'urinary', label: 'Urinary System', icon: '🫘' },
  { key: 'mens_health', label: "Men's Health", icon: '♂️' },
  { key: 'womens_health', label: "Women's Health", icon: '♀️' },
  { key: 'heart_failure', label: 'Heart Failure Drugs', icon: '💔' },
  { key: 'cell_wall_inhibitors', label: 'Cell Wall Inhibitors', icon: '🧱' },
  { key: 'antimicrobial', label: 'Antimicrobial Therapy', icon: '🦠' },
  { key: 'antidepressants', label: 'Antidepressants (MOA)', icon: '💡' },
  { key: 'antipsychotics', label: 'Antipsychotics (MOA)', icon: '🎭' },
  { key: 'anxiolytics', label: 'Anxiolytics (MOA)', icon: '🧘' },
  { key: 'hematology', label: 'Hematology/Anticoagulation', icon: '🩸' },
  { key: 'respiratory', label: 'Respiratory', icon: '🌬️' },
  { key: 'immunology', label: 'Immunology/Vaccines', icon: '🛡️' },
  { key: 'pain_management', label: 'Pain Management', icon: '🔥' },
  { key: 'dermatology', label: 'Dermatology', icon: '🧴' }
];

export const PHARMACOLOGY_FOCUSES = [
  { key: 'receptor_activity', label: 'Receptor Activity' },
  { key: 'neurotransmitter_effects', label: 'Neurotransmitter Effects' },
  { key: 'moa', label: 'Mechanism of Action' },
  { key: 'contraindications', label: 'Contraindications' },
  { key: 'adverse_effects', label: 'Adverse Effects' },
  { key: 'drug_interactions', label: 'Drug Interactions' },
  { key: 'eps', label: 'EPS' },
  { key: 'tardive_dyskinesia', label: 'Tardive Dyskinesia' },
  { key: 'nms', label: 'NMS' },
  { key: 'serotonin_syndrome', label: 'Serotonin Syndrome' },
  { key: 'qt_prolongation', label: 'QT Prolongation' },
  { key: 'clozapine_monitoring', label: 'Clozapine Monitoring' },
  { key: 'lithium_monitoring', label: 'Lithium Monitoring' },
  { key: 'valproate_issues', label: 'Valproate Issues' },
  { key: 'renal_hepatic', label: 'Renal/Hepatic Considerations' },
  { key: 'pregnancy', label: 'Pregnancy Considerations' },
  { key: 'black_box_warnings', label: 'Black Box Warnings' }
];

export function getBennerBadgeClass(stage) {
  const map = {
    novice: 'badge-novice',
    advanced_beginner: 'badge-advanced',
    competent: 'badge-competent',
    proficient: 'badge-proficient',
    expert: 'badge-expert'
  };
  return `badge ${map[stage] || 'badge-novice'}`;
}

export function getBennerLabel(stage) {
  return BENNER_STAGES.find(s => s.key === stage)?.label || stage;
}

export function getClinicalTopicLabel(key) {
  return CLINICAL_TOPICS.find(t => t.key === key)?.label || key;
}

export function getClinicalTopicIcon(key) {
  return CLINICAL_TOPICS.find(t => t.key === key)?.icon || '';
}

export const BODY_SYSTEMS = [
  { key: 'nervous', label: 'Nervous System', icon: '🧠', color: 'purple', clinicalTopics: ['neuro_pns_cns', 'antidepressants', 'anxiolytics', 'antipsychotics', 'adhd', 'anxiety_disorders', 'mood_disorders', 'psychotic_disorders', 'trauma_related', 'substance_use', 'sleep_disorders', 'child_adolescent', 'geriatric', 'psychiatric_assessment', 'psychotherapy', 'dsm_diagnosis', 'legal_ethical'] },
  { key: 'cardiovascular', label: 'Cardiovascular', icon: '❤️', color: 'red', clinicalTopics: ['cardiovascular', 'heart_failure'] },
  { key: 'endocrine', label: 'Endocrine', icon: '🦋', color: 'amber', clinicalTopics: ['endocrine'] },
  { key: 'respiratory', label: 'Respiratory', icon: '🌬️', color: 'sky', clinicalTopics: ['respiratory'] },
  { key: 'gastrointestinal', label: 'GI / Digestive', icon: '🫁', color: 'orange', clinicalTopics: ['digestive'] },
  { key: 'musculoskeletal', label: 'Musculoskeletal', icon: '🦴', color: 'yellow', clinicalTopics: ['musculoskeletal'] },
  { key: 'urinary', label: 'Renal / Urinary', icon: '🫘', color: 'teal', clinicalTopics: ['urinary'] },
  { key: 'hematologic', label: 'Hematologic', icon: '🩸', color: 'rose', clinicalTopics: ['hematology'] },
  { key: 'immune', label: 'Immune / Infectious', icon: '🛡️', color: 'green', clinicalTopics: ['immunology', 'cell_wall_inhibitors', 'antimicrobial'] },
  { key: 'reproductive', label: 'Reproductive', icon: '🧬', color: 'pink', clinicalTopics: ['mens_health', 'womens_health', 'perinatal'] },
  { key: 'integumentary', label: 'Integumentary', icon: '🧴', color: 'indigo', clinicalTopics: ['dermatology'] },
  { key: 'pain', label: 'Pain Management', icon: '🔥', color: 'red', clinicalTopics: ['pain_management'] }
];

export function getBodySystemForTopic(clinicalTopic) {
  return BODY_SYSTEMS.find(s => s.clinicalTopics.includes(clinicalTopic));
}

export function getBodySystemLabel(key) {
  return BODY_SYSTEMS.find(s => s.key === key)?.label || key;
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
