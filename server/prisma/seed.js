import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { neuroPnsCnsQuestions } from './questions/neuro_pns_cns.js';
import { cardiovascularQuestions } from './questions/cardiovascular.js';
import { endocrineQuestions } from './questions/endocrine.js';
import { digestiveMusculoskeletalUrinaryQuestions } from './questions/digestive_msk_urinary.js';
import { mensWomensHealthQuestions } from './questions/mens_womens_health.js';
import { antimicrobialCellWallQuestions } from './questions/antimicrobial_cell_wall.js';
import { antidepressantMoaQuestions } from './questions/antidepressants_moa.js';
import { anxiolyticAntipsychoticQuestions } from './questions/anxiolytics_antipsychotics.js';
import { additionalFnpPaQuestions } from './questions/additional_fnp_pa.js';
import { generatedBookSystemQuestions } from './questions/generated_book_system_questions.js';

const prisma = new PrismaClient();

const coreQuestions = [
  // ═══════════════════════════════════════════
  // PATHOPHYSIOLOGY
  // ═══════════════════════════════════════════

  // Novice - Pathophysiology
  {
    stem: "Which neurotransmitter is most commonly associated with the pathophysiology of major depressive disorder?",
    optionA: "Acetylcholine",
    optionB: "Serotonin",
    optionC: "Histamine",
    optionD: "Substance P",
    correctAnswer: "B",
    rationale: "Serotonin (5-HT) is the neurotransmitter most classically associated with the monoamine hypothesis of depression. Decreased serotonin activity in key brain regions is linked to depressed mood, sleep disturbance, appetite changes, and cognitive impairment seen in MDD.",
    explanationA: "Acetylcholine is primarily involved in memory and cognition. While cholinergic dysfunction may play a role in some cognitive symptoms, it is not the primary neurotransmitter associated with MDD.",
    explanationB: "Correct. Serotonin deficiency or dysregulation is the cornerstone of the monoamine hypothesis of depression.",
    explanationC: "Histamine is involved in wakefulness and allergic responses. It is not a primary neurotransmitter implicated in MDD pathophysiology.",
    explanationD: "Substance P is a neuropeptide involved in pain signaling and inflammation. Research has explored its role in mood disorders but it is not the primary neurotransmitter associated with MDD.",
    examTip: "The monoamine hypothesis (serotonin, norepinephrine, dopamine) is foundational for understanding antidepressant mechanisms. Most first-line antidepressants target serotonin.",
    category: "Pathophysiology",
    subtopic: "Neurotransmitter systems",
    difficulty: "easy",
    bennerStage: "novice",
    clinicalReasoningObj: "Identify the primary neurotransmitter implicated in major depressive disorder"
  },
  {
    stem: "What brain structure is considered the center for the fear response and is most directly involved in the pathophysiology of anxiety disorders?",
    optionA: "Hippocampus",
    optionB: "Prefrontal cortex",
    optionC: "Amygdala",
    optionD: "Cerebellum",
    correctAnswer: "C",
    rationale: "The amygdala is the brain's fear center, responsible for processing threat-related stimuli and generating the fear response. Hyperactivity of the amygdala is a key finding in anxiety disorders including PTSD, generalized anxiety disorder, and panic disorder.",
    explanationA: "The hippocampus is involved in memory formation and contextual fear learning, but it is not the primary fear center.",
    explanationB: "The prefrontal cortex modulates emotional responses and is involved in top-down regulation of anxiety, but the amygdala initiates the fear response.",
    explanationC: "Correct. The amygdala is the primary structure for fear detection and response.",
    explanationD: "The cerebellum coordinates motor function and has limited direct involvement in anxiety pathophysiology.",
    examTip: "Think of the amygdala as the 'smoke alarm' of the brain — it sounds the fear alarm. In anxiety disorders, this alarm is hypersensitive.",
    category: "Pathophysiology",
    subtopic: "Neuroanatomy",
    difficulty: "easy",
    bennerStage: "novice",
    clinicalReasoningObj: "Identify the key brain structure involved in anxiety pathophysiology"
  },
  {
    stem: "Which neurotransmitter system is most directly targeted by benzodiazepines?",
    optionA: "Dopaminergic system",
    optionB: "Serotonergic system",
    optionC: "GABAergic system",
    optionD: "Glutamatergic system",
    correctAnswer: "C",
    rationale: "Benzodiazepines enhance the effect of gamma-aminobutyric acid (GABA), the primary inhibitory neurotransmitter in the CNS. They bind to GABA-A receptor complexes and increase chloride ion conductance, resulting in neuronal hyperpolarization and anxiolytic, sedative, and anticonvulsant effects.",
    explanationA: "The dopaminergic system is targeted by antipsychotics and stimulants, not benzodiazepines.",
    explanationB: "The serotonergic system is targeted by SSRIs and SNRIs, not benzodiazepines.",
    explanationC: "Correct. Benzodiazepines are positive allosteric modulators of the GABA-A receptor.",
    explanationD: "The glutamatergic system is the primary excitatory system. Ketamine and memantine act here, not benzodiazepines.",
    examTip: "GABA = inhibitory = calming. Benzodiazepines enhance GABA. This explains their sedative, anxiolytic, and muscle-relaxant properties — and their dependence risk.",
    category: "Pathophysiology",
    subtopic: "Neurotransmitter systems",
    difficulty: "easy",
    bennerStage: "novice",
    clinicalReasoningObj: "Connect benzodiazepine mechanism to the GABAergic system"
  },

  // Advanced Beginner - Pathophysiology
  {
    stem: "A 28-year-old patient presents with pressured speech, decreased need for sleep (3 hours/night), grandiosity, and increased goal-directed activity for the past 5 days. Which neurotransmitter dysregulation best explains this presentation?",
    optionA: "Decreased serotonin",
    optionB: "Increased dopamine and norepinephrine",
    optionC: "Decreased GABA",
    optionD: "Increased acetylcholine",
    correctAnswer: "B",
    rationale: "This patient presents with a manic episode. The catecholamine hypothesis of mania suggests excessive dopaminergic and noradrenergic activity underlies the euphoria, psychomotor activation, grandiosity, and decreased sleep seen in acute mania.",
    explanationA: "Decreased serotonin is more associated with depressive episodes. While serotonin plays a role bipolar disorder, the manic presentation is better explained by catecholamine excess.",
    explanationB: "Correct. Elevated dopamine and norepinephrine drive the core features of mania: elevated mood, energy, psychomotor agitation, and grandiosity.",
    explanationC: "Decreased GABA may contribute to the disinhibition seen in mania, but it is not the primary neurotransmitter explanation for this full manic presentation.",
    explanationD: "Increased acetylcholine is associated with depressive states in the cholinergic-aminergic balance hypothesis, not mania.",
    examTip: "Mania = too much dopamine/norepinephrine. Depression = too little serotonin/norepinephrine. This is simplified but essential for exam reasoning.",
    category: "Pathophysiology",
    subtopic: "Mood disorders",
    difficulty: "medium",
    bennerStage: "advanced_beginner",
    clinicalReasoningObj: "Connect manic episode presentation to underlying neurotransmitter dysregulation"
  },
  {
    stem: "A patient with schizophrenia experiences auditory hallucinations and persecutory delusions. Which dopaminergic pathway is most likely hyperactive in this patient?",
    optionA: "Mesocortical pathway",
    optionB: "Mesolimbic pathway",
    optionC: "Nigrostriatal pathway",
    optionD: "Tuberoinfundibular pathway",
    correctAnswer: "B",
    rationale: "The mesolimbic dopamine pathway projects from the ventral tegmental area to the nucleus accumbens and limbic structures. Hyperactivity in this pathway is the leading explanation for positive symptoms of schizophrenia (hallucinations, delusions, disorganized thinking).",
    explanationA: "The mesocortical pathway is associated with negative and cognitive symptoms when hypoactive, not positive symptoms.",
    explanationB: "Correct. Mesolimbic hyperactivity drives the positive symptoms of schizophrenia.",
    explanationC: "The nigrostriatal pathway controls motor movement. Blockade here by antipsychotics causes extrapyramidal side effects.",
    explanationD: "The tuberoinfundibular pathway regulates prolactin. Blockade here causes hyperprolactinemia.",
    examTip: "4 dopamine pathways are high-yield: mesolimbic (positive sx), mesocortical (negative/cognitive sx), nigrostriatal (motor), tuberoinfundibular (prolactin). Know each one.",
    category: "Pathophysiology",
    subtopic: "Psychotic disorders",
    difficulty: "medium",
    bennerStage: "advanced_beginner",
    clinicalReasoningObj: "Map dopamine pathway dysfunction to specific schizophrenia symptoms"
  },

  // Competent - Pathophysiology
  {
    stem: "A 45-year-old patient with treatment-resistant depression has failed trials of sertraline, venlafaxine, and augmentation with aripiprazole. The PMHNP is considering esketamine nasal spray. Which neurotransmitter system does esketamine primarily target, and what is its mechanism?",
    optionA: "Serotonin — selective reuptake inhibition",
    optionB: "Dopamine — receptor agonism",
    optionC: "Glutamate — NMDA receptor antagonism",
    optionD: "GABA — positive allosteric modulation",
    correctAnswer: "C",
    rationale: "Esketamine (Spravato) is an NMDA receptor antagonist that works on the glutamatergic system. By blocking NMDA receptors, it triggers a cascade including increased AMPA receptor signaling and enhanced BDNF/mTOR pathway activation, leading to rapid synaptogenesis and antidepressant effects.",
    explanationA: "SSRIs target serotonin reuptake. This patient has already failed an SSRI, and esketamine has a completely different mechanism.",
    explanationB: "Dopamine agonism is the mechanism of pramipexole or stimulants, not esketamine.",
    explanationC: "Correct. Esketamine blocks NMDA glutamate receptors, representing a paradigm shift from monoamine-based treatments.",
    explanationD: "Positive allosteric modulation of GABA is the mechanism of benzodiazepines, not esketamine.",
    examTip: "Esketamine is a game-changer for treatment-resistant depression. Remember: it works on GLUTAMATE (NMDA antagonism), must be administered in a certified healthcare setting, and requires 2-hour monitoring.",
    category: "Pathophysiology",
    subtopic: "Treatment-resistant depression",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Connect glutamatergic mechanisms to novel antidepressant treatment approaches"
  },
  {
    stem: "A PMHNP is evaluating a 32-year-old patient with borderline personality disorder who exhibits emotional dysregulation, impulsivity, and self-harm behaviors. Which neurocircuitry model best explains this patient's difficulty with emotional regulation?",
    optionA: "Hyperactive dorsolateral prefrontal cortex with hypoactive amygdala",
    optionB: "Hypoactive prefrontal cortex with hyperactive amygdala",
    optionC: "Hyperactive hippocampus with hypoactive thalamus",
    optionD: "Hypoactive cerebellum with hyperactive basal ganglia",
    correctAnswer: "B",
    rationale: "In borderline personality disorder, neuroimaging studies consistently show amygdala hyperactivity (excessive emotional reactivity) combined with prefrontal cortex hypoactivity (impaired top-down emotional regulation). This creates a neural imbalance where emotional responses are amplified and poorly modulated.",
    explanationA: "This is the opposite of what is seen in BPD. Hyperactive DLPFC would suggest excessive cognitive control, which contradicts the impulsivity seen in BPD.",
    explanationB: "Correct. The amygdala-PFC imbalance model is the most well-supported neurocircuitry explanation for emotional dysregulation in BPD.",
    explanationC: "While hippocampal changes may occur in BPD (often reduced volume), the core emotional dysregulation is explained by the amygdala-PFC axis.",
    explanationD: "The cerebellum-basal ganglia circuit is relevant to motor and procedural functions, not the core emotional dysregulation of BPD.",
    examTip: "Think of BPD as a 'top-down failure': the prefrontal cortex (the rational brain) cannot adequately regulate the amygdala (the emotional brain). This framework helps explain why DBT skills training targets prefrontal-mediated regulation.",
    category: "Pathophysiology",
    subtopic: "Personality disorders",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Apply neurocircuitry models to explain personality disorder presentations"
  },

  // Proficient - Pathophysiology
  {
    stem: "A 60-year-old patient with Parkinson's disease develops visual hallucinations and paranoid ideation. The neurologist wants the PMHNP to manage the psychotic symptoms. Which unique pathophysiological consideration must guide medication selection in this patient?",
    optionA: "Serotonin excess in the raphe nuclei requires serotonin antagonism",
    optionB: "Dopaminergic deficit in the nigrostriatal pathway means D2 blockade will worsen motor symptoms",
    optionC: "Glutamate excess in the hippocampus requires NMDA antagonism",
    optionD: "Norepinephrine excess from locus coeruleus hyperactivity drives the psychosis",
    correctAnswer: "B",
    rationale: "In Parkinson's disease psychosis, the fundamental challenge is that the nigrostriatal pathway is already dopamine-depleted (causing motor symptoms). Traditional antipsychotics that strongly block D2 receptors will worsen parkinsonism. This is why pimavanserin (a 5-HT2A inverse agonist without D2 activity) or low-dose quetiapine/clozapine (minimal D2 blockade) are preferred.",
    explanationA: "While serotonin modulation is part of the treatment approach (pimavanserin works on 5-HT2A), the core pathophysiological consideration is the existing dopamine deficit, not serotonin excess.",
    explanationB: "Correct. The pre-existing nigrostriatal dopamine deficit in PD is the critical factor guiding antipsychotic selection — D2 blockers will catastrophically worsen motor symptoms.",
    explanationC: "Glutamate NMDA antagonism is relevant to memantine in dementia, not the primary consideration in PD psychosis management.",
    explanationD: "Norepinephrine from the locus coeruleus is relevant to anxiety and arousal, not the primary driver of PD psychosis.",
    examTip: "Parkinson's + psychosis = AVOID typical antipsychotics and most atypicals. Use pimavanserin (first-line, FDA-approved), quetiapine, or clozapine. Never give haloperidol — it will make the patient rigid and immobile.",
    category: "Pathophysiology",
    subtopic: "Neurodegenerative disorders",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Integrate competing pathophysiological mechanisms when managing comorbid neuropsychiatric conditions"
  },

  // Expert - Pathophysiology
  {
    stem: "A 35-year-old patient with bipolar I disorder, rapid cycling type, has failed lithium, valproate, and two atypical antipsychotics. Genetic testing reveals a mitochondrial DNA polymorphism associated with impaired oxidative phosphorylation. How does this finding inform the PMHNP's understanding of treatment resistance in this case?",
    optionA: "It is irrelevant to bipolar pathophysiology and should not influence treatment decisions",
    optionB: "Mitochondrial dysfunction may impair neuronal energy metabolism and synaptic plasticity, contributing to mood instability and treatment resistance",
    optionC: "It confirms the patient needs higher doses of lithium to overcome the metabolic deficit",
    optionD: "Mitochondrial polymorphisms only affect peripheral tissues and have no CNS implications",
    correctAnswer: "B",
    rationale: "Emerging research implicates mitochondrial dysfunction in bipolar disorder, particularly treatment-resistant and rapid-cycling variants. Impaired oxidative phosphorylation reduces ATP production, compromises calcium buffering, increases oxidative stress, and impairs synaptic plasticity — all of which destabilize mood circuits. This understanding opens consideration for adjunctive approaches targeting mitochondrial function (CoQ10, N-acetylcysteine, creatine) and explains why conventional monoamine-based treatments may be insufficient.",
    explanationA: "Mitochondrial dysfunction is increasingly recognized as relevant to bipolar pathophysiology, particularly in treatment-resistant cases.",
    explanationB: "Correct. Mitochondrial dysfunction impairs the energy-dependent processes essential for neuronal stability and contributes to treatment resistance.",
    explanationC: "Higher lithium doses would increase toxicity risk. Lithium's mechanism involves multiple pathways, but it cannot overcome fundamental mitochondrial energy deficits at higher doses.",
    explanationD: "Mitochondrial function is critical to neurons, which have extremely high metabolic demands. CNS effects of mitochondrial dysfunction are well-documented.",
    examTip: "Treatment resistance should prompt the PMHNP to think beyond monoamines. Mitochondrial dysfunction, neuroinflammation, HPA axis dysregulation, and epigenetic factors are 'next-level' considerations for expert reasoning.",
    category: "Pathophysiology",
    subtopic: "Mitochondrial psychiatry",
    difficulty: "hard",
    bennerStage: "expert",
    clinicalReasoningObj: "Integrate advanced pathophysiological mechanisms into understanding treatment resistance"
  },

  // ═══════════════════════════════════════════
  // PHARMACOLOGY
  // ═══════════════════════════════════════════

  // Novice - Pharmacology
  {
    stem: "Which class of medications is considered first-line pharmacotherapy for major depressive disorder?",
    optionA: "Benzodiazepines",
    optionB: "Selective serotonin reuptake inhibitors (SSRIs)",
    optionC: "Tricyclic antidepressants (TCAs)",
    optionD: "Monoamine oxidase inhibitors (MAOIs)",
    correctAnswer: "B",
    rationale: "SSRIs are the first-line treatment for MDD due to their favorable side effect profile, safety in overdose, once-daily dosing, and strong evidence base. Examples include sertraline, escitalopram, and fluoxetine.",
    explanationA: "Benzodiazepines are not antidepressants. They treat anxiety symptoms acutely but carry dependence risk and do not address the underlying pathophysiology of depression.",
    explanationB: "Correct. SSRIs are first-line for MDD based on efficacy, tolerability, and safety data.",
    explanationC: "TCAs are effective but are second or third-line due to anticholinergic side effects, cardiac toxicity, and lethality in overdose.",
    explanationD: "MAOIs are highly effective but reserved for treatment-resistant cases due to dietary restrictions (tyramine) and dangerous drug interactions (serotonin syndrome).",
    examTip: "On the certification exam, SSRIs are almost always the correct first-line answer for depression, anxiety disorders, PTSD, and OCD. Know the individual SSRIs and their unique properties.",
    category: "Pharmacology",
    subtopic: "Antidepressants",
    difficulty: "easy",
    bennerStage: "novice",
    clinicalReasoningObj: "Identify first-line pharmacotherapy for major depressive disorder"
  },
  {
    stem: "What is the mechanism of action of fluoxetine (Prozac)?",
    optionA: "Blocks dopamine D2 receptors",
    optionB: "Inhibits monoamine oxidase enzyme",
    optionC: "Selectively inhibits serotonin reuptake at the presynaptic neuron",
    optionD: "Enhances GABA transmission at the GABA-A receptor",
    correctAnswer: "C",
    rationale: "Fluoxetine is a selective serotonin reuptake inhibitor (SSRI). It works by blocking the serotonin transporter (SERT) on the presynaptic neuron, preventing reuptake of serotonin from the synaptic cleft, thereby increasing serotonin availability.",
    explanationA: "Blocking D2 receptors is the mechanism of antipsychotics (e.g., haloperidol, risperidone), not SSRIs.",
    explanationB: "MAO inhibition is the mechanism of MAOIs (e.g., phenelzine, tranylcypromine), not SSRIs.",
    explanationC: "Correct. Fluoxetine selectively blocks serotonin reuptake, increasing synaptic serotonin.",
    explanationD: "GABA-A enhancement is the mechanism of benzodiazepines and barbiturates, not SSRIs.",
    examTip: "Fluoxetine has the longest half-life of all SSRIs (2-6 days, active metabolite norfluoxetine 4-16 days). This makes it forgiving with missed doses but means a 5-week washout before switching to an MAOI.",
    category: "Pharmacology",
    subtopic: "Antidepressants",
    difficulty: "easy",
    bennerStage: "novice",
    clinicalReasoningObj: "Describe the mechanism of action of SSRIs"
  },
  {
    stem: "Which side effect is most commonly associated with SSRI initiation?",
    optionA: "Weight gain",
    optionB: "Gastrointestinal disturbance (nausea)",
    optionC: "Orthostatic hypotension",
    optionD: "Urinary retention",
    correctAnswer: "B",
    rationale: "GI side effects, particularly nausea, are the most common side effects during SSRI initiation, occurring in up to 25% of patients. This is because ~95% of the body's serotonin receptors are located in the GI tract. The nausea typically improves within 1-2 weeks.",
    explanationA: "Weight gain may occur with long-term SSRI use (especially paroxetine) but is not the most common initial side effect.",
    explanationB: "Correct. Nausea is the most common early side effect due to serotonin's extensive role in GI function.",
    explanationC: "Orthostatic hypotension is more associated with TCAs and some antipsychotics due to alpha-1 blockade, not SSRIs.",
    explanationD: "Urinary retention is an anticholinergic effect seen with TCAs, not with SSRIs which have minimal anticholinergic activity.",
    examTip: "Counsel patients that SSRI nausea is temporary and often resolves in 1-2 weeks. Taking the medication with food can help. The therapeutic antidepressant effect takes 4-6 weeks.",
    category: "Pharmacology",
    subtopic: "Antidepressants",
    difficulty: "easy",
    bennerStage: "novice",
    clinicalReasoningObj: "Identify common early side effects of SSRIs"
  },

  // Advanced Beginner - Pharmacology
  {
    stem: "A 22-year-old female with generalized anxiety disorder and comorbid migraines is starting an antidepressant. She also expresses concern about weight gain. Which SNRI would be most appropriate given her comorbid conditions?",
    optionA: "Paroxetine",
    optionB: "Mirtazapine",
    optionC: "Venlafaxine",
    optionD: "Amitriptyline",
    correctAnswer: "C",
    rationale: "Venlafaxine (Effexor) is an SNRI that is FDA-approved for GAD and has strong evidence for migraine prophylaxis. It is weight-neutral or may cause slight weight loss, addressing the patient's concern about weight gain. It treats both conditions simultaneously.",
    explanationA: "Paroxetine is an SSRI (not SNRI), has the highest weight gain risk among SSRIs, and is not indicated for migraine prophylaxis.",
    explanationB: "Mirtazapine causes significant weight gain (appetite stimulation via H1 blockade) and sedation. It would worsen this patient's weight concern.",
    explanationC: "Correct. Venlafaxine treats GAD, prevents migraines, and is weight-neutral — addressing all three patient concerns.",
    explanationD: "Amitriptyline is a TCA that can help migraines but causes significant weight gain, sedation, and anticholinergic effects.",
    examTip: "When a patient has comorbid conditions, look for a medication that addresses multiple problems (dual advantage). Venlafaxine for GAD + migraines is a classic dual-benefit example.",
    category: "Pharmacology",
    subtopic: "Antidepressants",
    difficulty: "medium",
    bennerStage: "advanced_beginner",
    clinicalReasoningObj: "Select appropriate pharmacotherapy considering comorbid conditions and patient preferences"
  },
  {
    stem: "A patient on lithium 900mg daily presents with coarse tremor, vomiting, ataxia, and confusion. Lithium level returns at 2.1 mEq/L. What is the PMHNP's priority action?",
    optionA: "Increase fluid intake and continue lithium at the same dose",
    optionB: "Decrease lithium dose to 600mg and recheck levels in 1 week",
    optionC: "Hold lithium immediately and arrange emergent medical evaluation",
    optionD: "Add propranolol for the tremor and metoclopramide for the vomiting",
    correctAnswer: "C",
    rationale: "A lithium level of 2.1 mEq/L represents moderate to severe lithium toxicity (therapeutic range 0.6-1.2 mEq/L). Symptoms of coarse tremor, vomiting, ataxia, and confusion are consistent with toxicity. Lithium must be held immediately and the patient requires emergent medical evaluation for possible hemodialysis, IV fluid resuscitation, and monitoring for cardiac arrhythmias and seizures.",
    explanationA: "Increasing fluids alone is insufficient for this level of toxicity. Continuing lithium is dangerous and could progress to seizures, coma, or death.",
    explanationB: "Dose reduction is inadequate for a level of 2.1 with neurological symptoms. This is an emergency requiring immediate drug cessation and medical intervention.",
    explanationC: "Correct. Lithium toxicity at this level with CNS symptoms is a medical emergency requiring immediate drug cessation and emergent evaluation.",
    explanationD: "Treating symptoms without addressing the underlying toxicity is dangerous. Adding medications could worsen the clinical picture.",
    examTip: "Lithium toxicity levels: >1.5 early toxicity, >2.0 moderate-severe, >2.5 life-threatening. CNS symptoms (confusion, ataxia) indicate serious toxicity. Always hold lithium and send to ED.",
    category: "Pharmacology",
    subtopic: "Mood stabilizers",
    difficulty: "medium",
    bennerStage: "advanced_beginner",
    clinicalReasoningObj: "Recognize and respond to lithium toxicity appropriately"
  },

  // Competent - Pharmacology
  {
    stem: "A 42-year-old patient with bipolar II depression is currently stable on lamotrigine 200mg daily. She reports a new positive pregnancy test at approximately 4 weeks gestation. What is the most appropriate pharmacological decision?",
    optionA: "Immediately discontinue lamotrigine due to teratogenicity",
    optionB: "Continue lamotrigine as it has a relatively favorable reproductive safety profile among mood stabilizers, and coordinate care with OB/GYN",
    optionC: "Switch to valproate as it is safer in pregnancy",
    optionD: "Switch to lithium immediately as it is the safest mood stabilizer in pregnancy",
    correctAnswer: "B",
    rationale: "Lamotrigine is considered the mood stabilizer with the most favorable reproductive safety profile. The lamotrigine pregnancy registry shows no significantly increased risk of major malformations at doses ≤200mg/day. Abrupt discontinuation risks mood episode relapse, which carries its own maternal and fetal risks. The best approach is to continue lamotrigine, coordinate with OB/GYN, supplement with folate, and monitor serum levels (which decrease during pregnancy due to increased glucuronidation).",
    explanationA: "Abrupt discontinuation risks severe depressive or mixed episodes, which can lead to suicidality, substance use, poor prenatal care, and fetal harm.",
    explanationB: "Correct. Lamotrigine has the most favorable reproductive safety data among mood stabilizers. Continued use with monitoring and coordination is appropriate.",
    explanationC: "Valproate is the MOST teratogenic mood stabilizer — it carries 10% risk of neural tube defects and is associated with cognitive/developmental delays. It is contraindicated in pregnancy.",
    explanationD: "Lithium carries a risk of Ebstein's anomaly (cardiac malformation), particularly with first-trimester exposure. It is not the safest option.",
    examTip: "Pregnancy + bipolar: Lamotrigine is the preferred mood stabilizer. Valproate is absolutely contraindicated. Lithium requires fetal echocardiography if used. Always weigh relapse risk against medication risk.",
    category: "Pharmacology",
    subtopic: "Reproductive psychopharmacology",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Navigate pharmacological decision-making in pregnancy with bipolar disorder"
  },

  // Proficient - Pharmacology
  {
    stem: "A 55-year-old patient with treatment-resistant schizophrenia is being started on clozapine. After 3 weeks at 300mg/day, morning fasting glucose is 180 mg/dL (previously 95 mg/dL), triglycerides are 310 mg/dL, and the patient has gained 12 pounds. The patient's psychotic symptoms have significantly improved for the first time in years. What is the most clinically appropriate approach?",
    optionA: "Discontinue clozapine immediately due to metabolic syndrome risk",
    optionB: "Continue clozapine given its unique efficacy, initiate metformin, and implement metabolic monitoring protocol",
    optionC: "Switch to aripiprazole which has a better metabolic profile",
    optionD: "Reduce clozapine dose to 100mg to minimize metabolic effects",
    correctAnswer: "B",
    rationale: "Clozapine is the ONLY antipsychotic with demonstrated superiority in treatment-resistant schizophrenia. Given this patient's first significant improvement, discontinuing would likely result in return to refractory psychosis. The appropriate approach is to manage metabolic effects aggressively while preserving the psychiatric benefits: start metformin (shown to mitigate clozapine-induced metabolic changes), implement dietary/exercise interventions, and establish regular metabolic monitoring (fasting glucose, lipids, weight, waist circumference, HbA1c).",
    explanationA: "Discontinuing the only effective medication for this patient's treatment-resistant psychosis would be clinically inappropriate when metabolic effects can be managed.",
    explanationB: "Correct. Clozapine's unique efficacy justifies managing metabolic complications rather than stopping the medication.",
    explanationC: "While aripiprazole has a better metabolic profile, it has failed to show efficacy comparable to clozapine in treatment-resistant cases. Switching would likely result in relapse.",
    explanationD: "100mg is subtherapeutic and would likely lose the psychiatric benefit without adequate metabolic improvement.",
    examTip: "Clozapine is irreplaceable for treatment-resistant schizophrenia. When metabolic effects occur, MANAGE them — don't discontinue. Metformin is the most evidence-based intervention for clozapine-induced metabolic syndrome.",
    category: "Pharmacology",
    subtopic: "Antipsychotics",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Balance efficacy against adverse effects in complex treatment-resistant cases"
  },

  // Expert - Pharmacology
  {
    stem: "A 30-year-old patient with bipolar I disorder, comorbid ADHD, and a history of substance use disorder (stimulant use) is in a euthymic state on lithium and quetiapine. ADHD symptoms are significantly impairing work performance. The patient requests stimulant medication. Considering the pharmacological complexity and risk, what is the most appropriate next step?",
    optionA: "Prescribe methylphenidate as it is safe with mood stabilizers",
    optionB: "Refuse all ADHD treatment due to the substance use history and bipolar diagnosis",
    optionC: "Initiate atomoxetine as a non-stimulant with lower abuse potential, with close mood monitoring",
    optionD: "Start mixed amphetamine salts at a low dose",
    correctAnswer: "C",
    rationale: "This case requires balancing three competing considerations: (1) ADHD treatment need, (2) bipolar mood stability risk, and (3) substance use relapse risk. Atomoxetine (a selective norepinephrine reuptake inhibitor) addresses ADHD without significant abuse potential, has minimal risk of destabilizing bipolar mood when protective mood stabilizers are in place, and does not carry the dopaminergic stimulant risk that could trigger relapse in a patient with stimulant use history. Close mood monitoring is essential as any noradrenergic agent could theoretically destabilize mood.",
    explanationA: "While some evidence supports stimulant use in bipolar patients on mood stabilizers, this patient's stimulant use disorder makes stimulant prescription high-risk for relapse.",
    explanationB: "Refusing all treatment is not patient-centered care. ADHD symptoms are functionally impairing, and safe treatment options exist.",
    explanationC: "Correct. Atomoxetine balances efficacy, abuse potential, and mood stability considerations optimally for this complex case.",
    explanationD: "Amphetamines carry the highest abuse potential among ADHD medications and would be contraindicated given this patient's stimulant use disorder.",
    examTip: "Triple comorbidity (bipolar + ADHD + SUD) is an expert-level exam scenario. The hierarchy: (1) stabilize mood first, (2) address ADHD with non-stimulants, (3) reserve stimulants only if non-stimulants fail AND robust recovery is established.",
    category: "Pharmacology",
    subtopic: "Complex comorbidity management",
    difficulty: "hard",
    bennerStage: "expert",
    clinicalReasoningObj: "Navigate pharmacological decision-making with multiple competing comorbidities and risk factors"
  },

  // ═══════════════════════════════════════════
  // PHYSICAL ASSESSMENT
  // ═══════════════════════════════════════════

  // Novice - Physical Assessment
  {
    stem: "Which component of the mental status examination (MSE) evaluates a patient's awareness of their psychiatric illness?",
    optionA: "Mood",
    optionB: "Affect",
    optionC: "Insight",
    optionD: "Judgment",
    correctAnswer: "C",
    rationale: "Insight refers to a patient's awareness and understanding of their illness. Good insight means the patient recognizes they have a mental illness and understands the need for treatment. Poor insight is common in psychotic disorders, mania, and some personality disorders.",
    explanationA: "Mood is the patient's subjective emotional state, reported in their own words (e.g., 'I feel sad').",
    explanationB: "Affect is the clinician's objective observation of the patient's emotional expression (e.g., flat, constricted, labile).",
    explanationC: "Correct. Insight specifically assesses the patient's awareness and understanding of their own illness.",
    explanationD: "Judgment assesses the patient's ability to make sound decisions and understand consequences of actions (e.g., 'What would you do if you found a stamped, addressed envelope on the ground?').",
    examTip: "Insight and judgment are often assessed together but measure different things. Insight = 'Do I know I'm ill?' Judgment = 'Can I make good decisions?' A patient can have poor insight but intact judgment in non-illness-related areas.",
    category: "Physical Assessment",
    subtopic: "Mental status examination",
    difficulty: "easy",
    bennerStage: "novice",
    clinicalReasoningObj: "Identify components of the mental status examination"
  },
  {
    stem: "During a mental status examination, the PMHNP observes that the patient's emotional expression does not change throughout the interview — remaining blank and monotone regardless of topic. How should this affect be documented?",
    optionA: "Labile affect",
    optionB: "Constricted affect",
    optionC: "Flat affect",
    optionD: "Incongruent affect",
    correctAnswer: "C",
    rationale: "Flat affect describes a complete or near-complete absence of emotional expression. The patient shows no variation in facial expression, voice tone, or gestures regardless of the emotional content being discussed. This is commonly seen in schizophrenia (particularly with negative symptoms), severe depression, and some neurological conditions.",
    explanationA: "Labile affect is rapid, unpredictable shifts between emotional states (e.g., laughing then crying within minutes).",
    explanationB: "Constricted affect is reduced but not absent emotional range. The patient shows some variation but less than expected.",
    explanationC: "Correct. Flat affect is the absence of visible emotional expression — blank, monotone, unchanging.",
    explanationD: "Incongruent affect is when emotional expression does not match the content (e.g., laughing while describing a traumatic event).",
    examTip: "Affect spectrum: full range > constricted > blunted > flat. Know the gradient. Full range is normal. Flat is the most severe reduction. Blunted is between constricted and flat.",
    category: "Physical Assessment",
    subtopic: "Mental status examination",
    difficulty: "easy",
    bennerStage: "novice",
    clinicalReasoningObj: "Accurately document affect findings in the MSE"
  },

  // Advanced Beginner - Physical Assessment
  {
    stem: "A 70-year-old patient scores 22/30 on the Montreal Cognitive Assessment (MoCA). The patient has a 10th grade education. How should the PMHNP interpret this score?",
    optionA: "Normal cognition; no further workup needed",
    optionB: "Apply the 1-point education correction (total 23), which still suggests mild cognitive impairment warranting further evaluation",
    optionC: "The score indicates severe dementia requiring immediate nursing facility placement",
    optionD: "The MoCA is not valid for patients over age 65",
    correctAnswer: "B",
    rationale: "The MoCA has a normal cutoff of ≥26/30. For patients with ≤12 years of education, 1 point is added to the total score. This patient's corrected score is 23/30, which falls below the cutoff and suggests mild cognitive impairment (MCI). This warrants further evaluation including comprehensive neuropsychological testing, labs (B12, TSH, RPR, metabolic panel), and possibly neuroimaging.",
    explanationA: "A score of 22 (even 23 corrected) is below the 26-point cutoff and is not normal. This requires follow-up.",
    explanationB: "Correct. The education-corrected score of 23 suggests MCI and warrants comprehensive further evaluation.",
    explanationC: "A score of 22-23 suggests MCI, not severe dementia. The MoCA is a screening tool; diagnosis requires comprehensive assessment.",
    explanationD: "The MoCA is validated across age groups and is specifically recommended as a screening tool for cognitive impairment in older adults.",
    examTip: "MoCA: ≥26 = normal, <26 = possible MCI. Add 1 point for ≤12 years education. The MoCA is better than the MMSE at detecting MCI. Know the difference.",
    category: "Physical Assessment",
    subtopic: "Cognitive screening",
    difficulty: "medium",
    bennerStage: "advanced_beginner",
    clinicalReasoningObj: "Interpret cognitive screening scores with appropriate adjustments and clinical context"
  },

  // Competent - Physical Assessment
  {
    stem: "A PMHNP is evaluating a 45-year-old patient referred for 'depression.' During the physical assessment, the PMHNP notes periorbital edema, dry skin, brittle hair, bradycardia (HR 54), delayed deep tendon reflexes, and 15-pound weight gain over 3 months. The patient reports fatigue, concentration difficulty, and low motivation. What is the most critical next assessment step?",
    optionA: "Administer the PHQ-9 to confirm depression severity",
    optionB: "Order thyroid function tests (TSH, free T4) before initiating antidepressant treatment",
    optionC: "Start sertraline for major depressive disorder",
    optionD: "Refer for neuropsychological testing",
    correctAnswer: "B",
    rationale: "This presentation has multiple physical findings strongly suggestive of hypothyroidism: periorbital edema, dry skin, brittle hair, bradycardia, delayed DTRs, and weight gain. These overlap with depressive symptoms (fatigue, concentration difficulty, low motivation). A competent PMHNP must recognize that medical conditions can mimic psychiatric disorders and rule them out before initiating psychotropic treatment. Thyroid function tests are essential — treating hypothyroidism may resolve the 'depressive' symptoms entirely.",
    explanationA: "While the PHQ-9 may confirm depressive symptoms, it will not identify the underlying medical cause. Physical assessment findings mandate medical workup first.",
    explanationB: "Correct. The physical exam findings strongly suggest hypothyroidism as the underlying cause of depressive symptoms. Medical clearance is essential before psychiatric treatment.",
    explanationC: "Starting an antidepressant without ruling out medical causes is inappropriate and could lead to unnecessary medication while the real condition goes untreated.",
    explanationD: "Neuropsychological testing is premature. The physical findings point to a medical condition, not a primary cognitive disorder.",
    examTip: "Physical assessment is the PMHNP's differentiator. Always ask: 'Could this psychiatric presentation have a medical cause?' Hypothyroidism, anemia, B12 deficiency, and Cushing's syndrome are top medical mimics of depression.",
    category: "Physical Assessment",
    subtopic: "Medical differential diagnosis",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Differentiate medical conditions from psychiatric disorders using physical assessment findings"
  },

  // Proficient - Physical Assessment
  {
    stem: "A 19-year-old female patient presents to the PMHNP for follow-up of bulimia nervosa. On physical examination, the PMHNP notes bilateral parotid gland enlargement, dental enamel erosion on the lingual surfaces of the upper teeth, calluses on the dorsum of the right hand (Russell's sign), and orthostatic hypotension (BP supine 110/70, standing 88/58). Labs show: K+ 2.8 mEq/L, Cl- 90 mEq/L, HCO3- 32 mEq/L. What is the most urgent clinical priority?",
    optionA: "Refer to dentist for enamel repair",
    optionB: "Address the hypokalemia urgently due to risk of cardiac arrhythmia",
    optionC: "Increase psychotherapy frequency",
    optionD: "Start fluoxetine for bulimia",
    correctAnswer: "B",
    rationale: "This patient has severe hypokalemia (K+ 2.8; normal 3.5-5.0) with metabolic alkalosis from purging behaviors. Hypokalemia at this level puts the patient at imminent risk for cardiac arrhythmias (ventricular tachycardia, torsades de pointes), which can be fatal. This is a medical emergency requiring urgent potassium replacement and cardiac monitoring. The physical assessment findings (parotid enlargement, Russell's sign, dental erosion) confirm active purging, and the orthostatic hypotension indicates dehydration.",
    explanationA: "Dental care is important but not urgent compared to life-threatening hypokalemia.",
    explanationB: "Correct. K+ of 2.8 with metabolic alkalosis is a medical emergency with imminent arrhythmia risk. This takes priority over all other interventions.",
    explanationC: "Psychotherapy is important for long-term management but does not address the acute medical danger.",
    explanationD: "Fluoxetine is FDA-approved for bulimia but starting it now without addressing the electrolyte emergency would be inappropriate.",
    examTip: "In eating disorders, ALWAYS check electrolytes. K+ < 3.0 is dangerous. The exam will test your ability to prioritize medical safety over psychiatric treatment in these cases.",
    category: "Physical Assessment",
    subtopic: "Eating disorder assessment",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Prioritize urgent medical findings in psychiatric patients through comprehensive physical assessment"
  },

  // Expert - Physical Assessment
  {
    stem: "A 72-year-old patient with a 15-year history of well-controlled bipolar I disorder on lithium presents for routine follow-up. The PMHNP performs a comprehensive assessment and finds: fine resting tremor (stable), new-onset polyuria with nocturia (3-4x/night), blood pressure 148/92 (previously 128/78), lower extremity edema, serum creatinine 1.8 mg/dL (previously 1.0), eGFR 38 mL/min (previously 72), lithium level 0.9 mEq/L, TSH 8.2 mIU/L (previously normal), and Ca2+ 11.2 mg/dL. How should the PMHNP integrate these physical assessment findings into clinical decision-making?",
    optionA: "All findings are expected aging changes; continue current regimen unchanged",
    optionB: "The findings collectively suggest lithium-induced nephrotoxicity, hypothyroidism, and hyperparathyroidism — warranting urgent nephrology and endocrinology consultation while reconsidering the lithium regimen",
    optionC: "The elevated creatinine and reduced eGFR require only dose adjustment of lithium",
    optionD: "Discontinue lithium immediately and switch to carbamazepine",
    correctAnswer: "B",
    rationale: "This case represents an expert-level integration of multiple physical assessment findings pointing to long-term lithium complications: (1) Nephrotoxicity: rising creatinine, falling eGFR to stage 3b CKD, polyuria/nocturia suggesting nephrogenic diabetes insipidus; (2) Hypothyroidism: TSH 8.2 indicating subclinical or early overt hypothyroidism; (3) Hyperparathyroidism: Ca2+ 11.2 suggesting lithium-induced hyperparathyroidism; (4) Hypertension and edema may relate to renal compromise. The PMHNP must coordinate with nephrology and endocrinology while weighing the risk-benefit of continuing lithium in the context of CKD progression.",
    explanationA: "These are not normal aging changes. The pattern of renal decline, thyroid dysfunction, and hypercalcemia in a long-term lithium patient represents known lithium complications requiring urgent evaluation.",
    explanationB: "Correct. The physical assessment findings reveal three known long-term complications of lithium requiring specialist involvement and a careful risk-benefit analysis of continued lithium use.",
    explanationC: "Dose adjustment alone is insufficient. The eGFR of 38 suggests significant renal impairment, and the thyroid and parathyroid abnormalities need independent management.",
    explanationD: "Abruptly discontinuing lithium in a patient with 15 years of stability risks relapse into mania or depression. Carbamazepine also has monitoring requirements and may not be an appropriate substitute without careful transition.",
    examTip: "Long-term lithium monitoring: renal function (Cr, eGFR, urinalysis), thyroid (TSH), calcium/parathyroid, and ECG. On the exam, INTEGRATE all findings together — don't treat each lab value in isolation.",
    category: "Physical Assessment",
    subtopic: "Long-term medication monitoring",
    difficulty: "hard",
    bennerStage: "expert",
    clinicalReasoningObj: "Integrate complex multi-system physical assessment findings to identify medication-related complications"
  },

  // ═══════════════════════════════════════════
  // ADVANCED PMHNP QUESTIONS
  // Board-style, high-complexity, application-based
  // ═══════════════════════════════════════════

  // --- MOOD DISORDERS ---
  {
    stem: "A 34-year-old female with bipolar I disorder and a recent manic episode stabilized on lithium 1200mg/day (level 0.8 mEq/L) now presents with a severe depressive episode. She reports suicidal ideation with a plan, anhedonia, hypersomnia, and psychomotor retardation for 3 weeks. Her previous depressive episodes responded poorly to SSRIs and caused a manic switch. Which pharmacological intervention is most appropriate to add at this time?",
    optionA: "Fluoxetine 20mg daily",
    optionB: "Lurasidone 20mg with dinner",
    optionC: "Bupropion XL 150mg daily",
    optionD: "Venlafaxine XR 75mg daily",
    correctAnswer: "B",
    rationale: "Lurasidone is FDA-approved for bipolar I depression (both as monotherapy and adjunct to lithium/valproate). It has demonstrated efficacy without significant risk of manic switch, metabolic burden is relatively low, and it has shown improvement in depressive symptoms within 6 weeks. Given this patient's history of SSRI-induced manic switch, antidepressant monotherapy is contraindicated. Lurasidone added to lithium is evidence-based and avoids the switch risk.",
    explanationA: "Fluoxetine monotherapy in bipolar depression carries significant manic switch risk, especially in a patient with prior SSRI-induced switching. The olanzapine-fluoxetine combination (Symbyax) is FDA-approved, but fluoxetine alone is not appropriate here.",
    explanationB: "Correct. Lurasidone is FDA-approved for bipolar I depression as adjunct to lithium/valproate. It has favorable metabolic profile and minimal switch risk.",
    explanationC: "While bupropion may have lower switch risk than other antidepressants, it is not FDA-approved for bipolar depression and evidence is limited compared to lurasidone or quetiapine.",
    explanationD: "Venlafaxine (an SNRI) carries the highest switch risk among antidepressants in bipolar patients due to noradrenergic activity. It is generally avoided in bipolar depression.",
    examTip: "FDA-approved for bipolar I depression: lurasidone, quetiapine, olanzapine-fluoxetine combination (OFC), and cariprazine. Lurasidone has the best metabolic profile among these options. Antidepressant monotherapy is NEVER appropriate in bipolar I.",
    category: "Pharmacology",
    subtopic: "Bipolar depression treatment",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Select evidence-based pharmacotherapy for bipolar depression considering switch risk and comorbid factors",
    questionType: "advanced",
    clinicalTopic: "mood_disorders",
    pharmacologyFocus: "moa,adverse_effects,drug_interactions",
    bennerBreakdown: "This question requires proficient-level reasoning: integrating the patient's medication history (prior SSRI-induced mania), current mood stabilizer (lithium level within range), and FDA-approved options for bipolar depression. The proficient clinician recognizes that not all atypicals are equivalent for bipolar depression and selects based on evidence level and safety profile."
  },
  // --- ANXIETY DISORDERS ---
  {
    stem: "A 42-year-old male with treatment-resistant generalized anxiety disorder has failed adequate trials of sertraline, escitalopram, venlafaxine, and buspirone over 2 years. He also has comorbid chronic insomnia and reports 15-pound weight gain from mirtazapine (which did not adequately treat anxiety). He is requesting benzodiazepine therapy. The PMHNP considers pregabalin. What is pregabalin's primary mechanism of action relevant to anxiety treatment?",
    optionA: "Selective serotonin reuptake inhibition at the presynaptic terminal",
    optionB: "Binding to the alpha-2-delta subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release",
    optionC: "GABA-A receptor positive allosteric modulation similar to benzodiazepines",
    optionD: "Dopamine D2 partial agonism in the mesolimbic pathway",
    correctAnswer: "B",
    rationale: "Pregabalin binds to the alpha-2-delta subunit of voltage-gated calcium channels (VGCCs) in the CNS. This binding reduces calcium influx at nerve terminals, which decreases the release of excitatory neurotransmitters including glutamate, norepinephrine, and substance P. Despite its name suggesting GABAergic activity, pregabalin does NOT directly bind GABA receptors or affect GABA metabolism. It is approved for GAD in Europe and has growing evidence in treatment-resistant anxiety.",
    explanationA: "SSRI mechanism. Pregabalin has no direct serotonergic activity.",
    explanationB: "Correct. Pregabalin's alpha-2-delta calcium channel binding reduces excitatory neurotransmitter release, producing anxiolytic and analgesic effects through a unique non-GABAergic mechanism.",
    explanationC: "Despite being a GABA analog structurally, pregabalin does NOT bind GABA-A receptors. This is a common misconception. Its anxiolytic action is through calcium channel modulation, not GABAergic enhancement.",
    explanationD: "D2 partial agonism is the mechanism of aripiprazole and brexpiprazole, not pregabalin.",
    examTip: "Pregabalin and gabapentin are GABA analogs that do NOT work on GABA receptors — they work on calcium channels. This is one of the most commonly tested pharmacology misconceptions. Know the difference between structural analogy and functional mechanism.",
    category: "Pharmacology",
    subtopic: "Anxiolytics and mechanism of action",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Differentiate anxiolytic mechanisms of action and identify appropriate alternatives for treatment-resistant anxiety",
    questionType: "advanced",
    clinicalTopic: "anxiety_disorders",
    pharmacologyFocus: "moa,receptor_activity,neurotransmitter_effects",
    bennerBreakdown: "At the competent level, the clinician must understand nuanced pharmacology beyond first-line agents. This question tests the ability to distinguish true mechanism from structural naming convention — a common board exam trap. Understanding calcium channel modulation as an anxiolytic mechanism represents competent-level pharmacological reasoning."
  },
  // --- PSYCHOTIC DISORDERS ---
  {
    stem: "A 26-year-old male with first-episode schizophrenia has been started on risperidone 4mg/day. After 6 weeks, positive symptoms (auditory hallucinations, paranoid delusions) have largely resolved, but he develops amenorrhea-like symptoms: galactorrhea, decreased libido, and erectile dysfunction. Prolactin level is 85 ng/mL (normal <20). Which receptor mechanism explains these adverse effects, and what is the most appropriate management?",
    optionA: "D1 receptor blockade in the mesocortical pathway; increase risperidone dose",
    optionB: "D2 receptor blockade in the tuberoinfundibular pathway; switch to aripiprazole",
    optionC: "5-HT2A receptor blockade in the hypothalamus; add cabergoline",
    optionD: "Muscarinic receptor blockade in the pituitary; switch to olanzapine",
    correctAnswer: "B",
    rationale: "Risperidone is the antipsychotic most associated with hyperprolactinemia due to potent D2 blockade in the tuberoinfundibular pathway. Dopamine normally inhibits prolactin release from the anterior pituitary. When D2 receptors in this pathway are blocked, prolactin release is unchecked, leading to galactorrhea, sexual dysfunction, gynecomastia, and menstrual irregularities. Aripiprazole is a D2 partial agonist that provides enough dopaminergic stimulation in the tuberoinfundibular pathway to normalize prolactin levels while maintaining antipsychotic efficacy through partial agonism in the mesolimbic pathway.",
    explanationA: "D1 blockade is not the primary mechanism of antipsychotic action or prolactin elevation. The mesocortical pathway is associated with negative/cognitive symptoms, not prolactin.",
    explanationB: "Correct. D2 blockade in the tuberoinfundibular pathway causes hyperprolactinemia. Aripiprazole's D2 partial agonism restores dopaminergic tone in this pathway, normalizing prolactin.",
    explanationC: "5-HT2A antagonism actually helps modulate prolactin through indirect effects. Cabergoline (a dopamine agonist used in hyperprolactinemia) could theoretically help but risks worsening psychosis by increasing dopamine activity in the mesolimbic pathway.",
    explanationD: "Muscarinic blockade causes anticholinergic effects (dry mouth, constipation, urinary retention), not prolactin elevation. Olanzapine causes less prolactin elevation than risperidone but switching would not address the mechanism as precisely as aripiprazole.",
    examTip: "Risperidone and paliperidone = highest prolactin elevation. Aripiprazole = prolactin-sparing (or prolactin-lowering). Some clinicians add low-dose aripiprazole to an existing antipsychotic to lower prolactin without switching — this is an off-label but evidence-supported strategy.",
    category: "Pharmacology",
    subtopic: "Antipsychotic adverse effects",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Connect receptor pharmacology to specific adverse effects and select mechanism-informed management strategies",
    questionType: "advanced",
    clinicalTopic: "psychotic_disorders",
    pharmacologyFocus: "receptor_activity,adverse_effects,moa",
    bennerBreakdown: "Proficient reasoning requires mapping the four dopamine pathways to both therapeutic and adverse outcomes. This question tests the ability to identify WHICH pathway is responsible for a specific side effect and then select a management strategy that addresses the mechanism rather than just treating the symptom."
  },
  // --- TRAUMA-RELATED DISORDERS ---
  {
    stem: "A 30-year-old female veteran with PTSD and comorbid nightmares has been on sertraline 200mg/day for 12 weeks with partial response. She reports persistent trauma-related nightmares 4-5 nights per week that significantly impair her sleep and daily functioning. She has tried sleep hygiene measures and cognitive processing therapy. Which pharmacological augmentation is most evidence-based for targeting PTSD-related nightmares specifically?",
    optionA: "Trazodone 100mg at bedtime",
    optionB: "Prazosin 1mg at bedtime, titrated to effect",
    optionC: "Clonazepam 1mg at bedtime",
    optionD: "Quetiapine 50mg at bedtime",
    correctAnswer: "B",
    rationale: "Prazosin, an alpha-1 adrenergic receptor antagonist, is the most evidence-based pharmacological treatment specifically targeting PTSD-related nightmares. The mechanism relates to PTSD pathophysiology: trauma causes noradrenergic hyperactivity (elevated catecholamines) which disrupts REM sleep and generates trauma-related nightmares. Prazosin blocks alpha-1 receptors in the CNS, reducing noradrenergic tone during sleep and diminishing trauma-related dream content. VA/DoD guidelines and APA guidelines recommend prazosin for PTSD nightmares.",
    explanationA: "Trazodone promotes sleep via 5-HT2A antagonism and H1 blockade but does not specifically target the noradrenergic mechanism driving PTSD nightmares. It may improve total sleep time but is less effective for nightmare content.",
    explanationB: "Correct. Prazosin's alpha-1 antagonism directly addresses the noradrenergic hyperactivation that drives PTSD nightmares. Start low (1mg) and titrate to 6-15mg based on response.",
    explanationC: "Benzodiazepines are generally contraindicated in PTSD. They can worsen PTSD outcomes, impair trauma processing in therapy, suppress REM sleep (potentially worsening nightmare rebound), and carry dependence risk.",
    explanationD: "Quetiapine may improve sleep through H1 and 5-HT2A antagonism but carries metabolic risks and is not specifically indicated for PTSD nightmares. It does not target the noradrenergic mechanism.",
    examTip: "PTSD nightmares = prazosin. Start at 1mg qHS and titrate slowly (watch for orthostatic hypotension and first-dose syncope). Monitor blood pressure. The effect is mechanism-specific: blocking alpha-1 reduces noradrenergic sleep disruption.",
    category: "Pharmacology",
    subtopic: "PTSD treatment",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Select mechanism-specific augmentation strategies for PTSD symptom clusters",
    questionType: "advanced",
    clinicalTopic: "trauma_related",
    pharmacologyFocus: "receptor_activity,moa,adverse_effects",
    bennerBreakdown: "Competent-level reasoning requires going beyond first-line PTSD treatment (SSRIs/SNRIs) to target specific symptom clusters with mechanism-matched interventions. The clinician must understand the noradrenergic theory of PTSD nightmares and match it with prazosin's receptor profile."
  },
  // --- ADHD ---
  {
    stem: "A 17-year-old male with ADHD-combined type has been on methylphenidate ER 54mg daily for 3 years with good symptom control. He now reports a 2-month history of motor tics (eye blinking, shoulder shrugging) and vocal tics (throat clearing) that are socially distressing. Family history is positive for Tourette syndrome. The methylphenidate has been critical for his academic performance. What is the most appropriate pharmacological approach?",
    optionA: "Immediately discontinue methylphenidate as stimulants cause tic disorders",
    optionB: "Continue methylphenidate and add alpha-2 agonist (guanfacine ER) to address both tics and ADHD symptoms",
    optionC: "Switch to dextroamphetamine which has less tic risk than methylphenidate",
    optionD: "Replace methylphenidate with haloperidol for tic suppression",
    correctAnswer: "B",
    rationale: "The relationship between stimulants and tics is complex. Current evidence suggests stimulants do not cause tic disorders but may unmask or transiently worsen tics in genetically predisposed individuals. Given this patient's family history of Tourette syndrome, the tics likely represent the natural emergence of a tic disorder rather than a stimulant side effect. Guanfacine ER (an alpha-2A agonist) is FDA-approved for both ADHD and has demonstrated efficacy for tic reduction. Adding guanfacine addresses both problems without sacrificing the academic benefits of methylphenidate.",
    explanationA: "The old belief that stimulants cause tics has been largely disproven. Abruptly stopping effective ADHD treatment would significantly impair functioning without necessarily resolving tics.",
    explanationB: "Correct. Guanfacine ER treats both ADHD and tics through alpha-2A agonism. This combination approach preserves ADHD treatment while addressing tics.",
    explanationC: "There is no evidence that dextroamphetamine has a meaningfully different tic risk compared to methylphenidate. Switching stimulant class does not address the underlying tic disorder.",
    explanationD: "Haloperidol, while effective for tics, does not treat ADHD and carries significant extrapyramidal, metabolic, and cognitive side effects inappropriate for an adolescent. It would also not address the ADHD symptoms.",
    examTip: "Stimulants + tics: don't panic. Current AAP and AACAP guidelines say stimulants are NOT contraindicated with tic disorders. Alpha-2 agonists (guanfacine, clonidine) are the bridge — they treat both ADHD and tics.",
    category: "Pharmacology",
    subtopic: "ADHD and comorbid tic disorders",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Navigate comorbid ADHD and tic disorder management using evidence-based combination strategies",
    questionType: "advanced",
    clinicalTopic: "adhd",
    pharmacologyFocus: "moa,receptor_activity,adverse_effects,drug_interactions",
    bennerBreakdown: "Proficient reasoning requires the clinician to challenge outdated dogma (stimulants cause tics), recognize genetic predisposition in family history, and implement a combination strategy that optimizes treatment for both conditions simultaneously."
  },
  // --- SUBSTANCE USE DISORDERS ---
  {
    stem: "A 48-year-old male with severe alcohol use disorder has been drinking 12-15 standard drinks daily for 10 years. He presents to the ED with tremor, diaphoresis, tachycardia (HR 110), hypertension (BP 160/100), visual hallucinations, and a CIWA-Ar score of 28. He has a history of alcohol withdrawal seizures. After initial stabilization with IV lorazepam, the PMHNP plans long-term pharmacotherapy for relapse prevention. The patient has comorbid opioid cravings from prior opioid use. Which medication addresses BOTH alcohol relapse prevention and opioid craving reduction through its mechanism of action?",
    optionA: "Disulfiram 250mg daily",
    optionB: "Acamprosate 666mg three times daily",
    optionC: "Naltrexone 50mg daily",
    optionD: "Gabapentin 300mg three times daily",
    correctAnswer: "C",
    rationale: "Naltrexone is a mu-opioid receptor antagonist that reduces alcohol craving by blocking the opioid-mediated reinforcing effects of alcohol. Alcohol stimulates endogenous opioid release (endorphins), which activates the mesolimbic reward pathway. By blocking mu-opioid receptors, naltrexone diminishes the rewarding effects of alcohol and reduces craving. The same mechanism addresses opioid cravings — by blocking mu receptors, naltrexone eliminates the euphoric effects of opioids if used. It is FDA-approved for both alcohol use disorder and opioid use disorder.",
    explanationA: "Disulfiram works through acetaldehyde dehydrogenase inhibition (aversive conditioning), not opioid receptor blockade. It does not address opioid cravings and requires high patient motivation and compliance.",
    explanationB: "Acamprosate modulates glutamatergic NMDA transmission, restoring the excitatory/inhibitory balance disrupted by chronic alcohol use. It does not affect opioid receptors or address opioid cravings.",
    explanationC: "Correct. Naltrexone's mu-opioid antagonism addresses both alcohol craving (via blocking opioid-mediated reward) and opioid craving (via blocking opioid euphoria).",
    explanationD: "Gabapentin (calcium channel modulation) has emerging evidence for alcohol use disorder but does not affect opioid receptors or address opioid cravings.",
    examTip: "Naltrexone is a dual-purpose medication for alcohol + opioid use disorders. CRITICAL: ensure patient is opioid-free for 7-10 days before starting naltrexone to avoid precipitated withdrawal. Also available as monthly IM injection (Vivitrol) for adherence.",
    category: "Pharmacology",
    subtopic: "Substance use disorder treatment",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Select pharmacotherapy that addresses multiple substance use disorders through shared receptor mechanisms",
    questionType: "advanced",
    clinicalTopic: "substance_use",
    pharmacologyFocus: "receptor_activity,moa,contraindications,adverse_effects",
    bennerBreakdown: "Competent reasoning requires understanding of opioid receptor pharmacology in the alcohol reward pathway — a concept that bridges two seemingly separate substance use conditions. The clinician must also recognize the precipitated withdrawal risk as a safety consideration."
  },
  // --- SLEEP DISORDERS ---
  {
    stem: "A 55-year-old male with major depressive disorder and severe insomnia (both sleep-onset and sleep-maintenance) has failed to respond to sleep hygiene, CBT-I, and melatonin. He is currently on bupropion XL 300mg for depression (which is working well). He tried zolpidem but experienced next-day amnesia and complex sleep behaviors. The PMHNP considers suvorexant. What is suvorexant's unique mechanism of action?",
    optionA: "GABA-A receptor positive allosteric modulation at the benzodiazepine binding site",
    optionB: "Melatonin MT1/MT2 receptor agonism mimicking endogenous sleep signals",
    optionC: "Dual orexin receptor antagonism (DORA) blocking wake-promoting orexin-A and orexin-B signals",
    optionD: "Histamine H1 receptor inverse agonism reducing histaminergic wake-promoting activity",
    correctAnswer: "C",
    rationale: "Suvorexant (Belsomra) is a dual orexin receptor antagonist (DORA). Orexin (hypocretin) is a neuropeptide produced in the lateral hypothalamus that promotes and maintains wakefulness. By blocking both OX1 and OX2 receptors, suvorexant reduces the wake drive, allowing the natural sleep process to proceed. This is mechanistically distinct from GABA-enhancing drugs (benzodiazepines, Z-drugs) and has a different side effect profile — notably lower risk of next-day impairment, complex sleep behaviors, and dependence.",
    explanationA: "This describes benzodiazepines and Z-drugs (zolpidem, zaleplon, eszopiclone). Suvorexant has no GABAergic activity.",
    explanationB: "This describes ramelteon and tasimelteon. Suvorexant does not interact with melatonin receptors.",
    explanationC: "Correct. Suvorexant blocks orexin receptors, reducing wake promotion rather than enhancing sleep drive — a fundamentally different approach to insomnia treatment.",
    explanationD: "This describes antihistamines and low-dose doxepin (Silenor). While H1 blockade promotes sleep, suvorexant works through the orexin system, not histamine.",
    examTip: "Know the 4 mechanisms of insomnia pharmacotherapy: (1) GABA enhancement (benzos, Z-drugs), (2) Melatonin agonism (ramelteon), (3) Orexin antagonism (suvorexant, lemborexant), (4) H1 antagonism (doxepin). DORAs are the newest class and a high-yield exam topic.",
    category: "Pharmacology",
    subtopic: "Sleep pharmacology",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Compare novel sleep medication mechanisms and select based on prior treatment response and risk profile",
    questionType: "advanced",
    clinicalTopic: "sleep_disorders",
    pharmacologyFocus: "moa,receptor_activity,neurotransmitter_effects,adverse_effects",
    bennerBreakdown: "The competent clinician must know insomnia pharmacology beyond traditional agents. This question tests knowledge of the newest drug class (DORAs) and their mechanism, differentiating from older approaches. The scenario also requires recognizing why the patient's prior Z-drug experience (complex sleep behaviors) makes DORAs a better mechanistic choice."
  },
  // --- CHILD/ADOLESCENT PSYCHIATRY ---
  {
    stem: "A 7-year-old female is brought to the PMHNP by her parents for depressive symptoms: persistent sad mood, irritability, loss of interest in play, decreased appetite, and poor concentration for 8 weeks. The school reports declining academic performance. PHQ-A modified score suggests moderate depression. The parents ask about medication options. Per FDA labeling and the black box warning, which consideration is MOST critical when prescribing SSRIs in this age group?",
    optionA: "SSRIs are FDA-approved for MDD in all pediatric age groups and carry no additional risk compared to adults",
    optionB: "Fluoxetine is the only SSRI FDA-approved for MDD in children aged 8 and older; all SSRIs carry a black box warning for increased suicidal thinking and behavior in children and adolescents requiring close monitoring",
    optionC: "Sertraline is the preferred first-line SSRI for pediatric depression due to its shorter half-life",
    optionD: "The black box warning was removed in 2023 after evidence showed no increased suicide risk",
    correctAnswer: "B",
    rationale: "Fluoxetine is the ONLY SSRI FDA-approved for MDD in pediatric patients (ages 8-17). Escitalopram is approved for adolescents 12-17. ALL antidepressants carry a black box warning about increased risk of suicidal thinking and behavior in children, adolescents, and young adults (under 25). The PMHNP must counsel parents about this risk, implement close monitoring (weekly visits for the first 4 weeks, biweekly for weeks 5-8, then as clinically indicated), and weigh the risk of untreated depression against medication risk. This patient is only 7, which is below the FDA-approved age even for fluoxetine.",
    explanationA: "Not all SSRIs are FDA-approved for pediatric MDD, and children DO face additional risks (black box warning) compared to adults. This statement is incorrect.",
    explanationB: "Correct. Fluoxetine (age 8+) and escitalopram (age 12+) are the only SSRIs with pediatric MDD approval. The black box warning is a critical consideration requiring informed consent and close monitoring.",
    explanationC: "Sertraline is not FDA-approved for pediatric MDD (though it is approved for pediatric OCD). The rationale about half-life is not the primary prescribing consideration in this context.",
    explanationD: "The black box warning has NOT been removed and remains in effect as of 2026. It applies to all antidepressants for patients under 25.",
    examTip: "Pediatric antidepressant regulations: Fluoxetine = FDA-approved MDD ages 8+. Escitalopram = FDA-approved MDD ages 12+. Black box warning = ALL antidepressants in patients <25. Monitoring = weekly x4, biweekly x4, then monthly. This is heavily tested.",
    category: "Pharmacology",
    subtopic: "Pediatric psychopharmacology",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Apply FDA labeling, black box warnings, and evidence-based monitoring protocols to pediatric prescribing decisions",
    questionType: "advanced",
    clinicalTopic: "child_adolescent",
    pharmacologyFocus: "black_box_warnings,adverse_effects,contraindications",
    bennerBreakdown: "Competent-level prescribing requires precise knowledge of FDA approvals by age group, black box warning requirements, and the distinction between off-label use and contraindication. The clinician must also recognize that this 7-year-old falls below the approved age for fluoxetine, adding complexity to the treatment discussion."
  },
  // --- GERIATRIC PSYCHIATRY ---
  {
    stem: "An 82-year-old female nursing home resident with moderate Alzheimer's dementia has been exhibiting agitation, verbal aggression toward staff, and resistance to care for 3 weeks. Nonpharmacological interventions (environmental modification, redirection, music therapy) have been consistently attempted for 2 weeks without improvement. She has no evidence of delirium, pain, infection, or constipation. The facility physician requests the PMHNP prescribe an antipsychotic. What is the MOST important consideration before initiating antipsychotic therapy?",
    optionA: "Antipsychotics are first-line therapy for dementia-related agitation and can be started immediately",
    optionB: "All antipsychotics carry a black box warning for increased mortality in elderly patients with dementia-related psychosis, requiring careful risk-benefit analysis and informed consent",
    optionC: "Haloperidol is the safest antipsychotic option in elderly dementia patients due to its strict D2 selectivity",
    optionD: "Benzodiazepines should be tried before any antipsychotic in this population",
    correctAnswer: "B",
    rationale: "All antipsychotics (both typical and atypical) carry a FDA black box warning about increased risk of death in elderly patients with dementia-related psychosis. The mortality risk is approximately 1.6-1.7 times that of placebo, with deaths primarily from cardiovascular events or infections. Before prescribing, the PMHNP must: (1) document failure of nonpharmacological interventions, (2) perform thorough medical workup to rule out reversible causes, (3) conduct risk-benefit analysis, (4) obtain informed consent from the surrogate decision-maker, and (5) use the lowest effective dose for the shortest duration with regular reassessment.",
    explanationA: "Antipsychotics are NOT first-line for dementia-related agitation. Nonpharmacological approaches are always first-line. Antipsychotics are used only when there is significant distress or danger.",
    explanationB: "Correct. The black box warning applies to ALL antipsychotics in elderly dementia patients. This requires informed consent, documentation of nonpharmacological failure, and careful risk-benefit analysis.",
    explanationC: "Haloperidol is particularly risky in elderly dementia patients due to EPS, falls risk, QTc prolongation, and anticholinergic burden. High-potency typicals are generally avoided.",
    explanationD: "Benzodiazepines are generally CONTRAINDICATED in elderly dementia patients due to increased fall risk, paradoxical agitation, excessive sedation, delirium risk, and respiratory depression.",
    examTip: "Dementia + agitation: (1) Nonpharmacological first, (2) Rule out medical causes (UTI, pain, delirium, constipation), (3) If meds needed, risperidone or quetiapine at lowest dose, (4) Black box warning — informed consent required, (5) Regular reassessment with dose reduction attempts.",
    category: "Pharmacology",
    subtopic: "Geriatric psychopharmacology",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Navigate regulatory, ethical, and clinical complexity of antipsychotic prescribing in the elderly dementia population",
    questionType: "advanced",
    clinicalTopic: "geriatric",
    pharmacologyFocus: "black_box_warnings,adverse_effects,contraindications",
    bennerBreakdown: "Proficient reasoning integrates pharmacological knowledge with regulatory awareness (black box warning), ethical considerations (informed consent from surrogate), and the stepwise approach required by facility standards. The clinician must resist pressure to prescribe without proper documentation and risk-benefit analysis."
  },
  // --- PERINATAL PSYCHIATRY ---
  {
    stem: "A 28-year-old female at 32 weeks gestation with a history of bipolar I disorder has been stable on quetiapine 300mg/day throughout pregnancy. She now presents with severe insomnia, flight of ideas, grandiosity, and increased psychomotor activity for 4 days — consistent with an emerging manic episode. Her obstetrician is concerned about medication safety. Which of the following is the most appropriate pharmacological management for this acute manic episode in the third trimester?",
    optionA: "Add valproate 500mg BID for rapid mood stabilization",
    optionB: "Increase quetiapine to 600mg/day and consider lithium addition with close monitoring of levels, renal function, and delivery planning",
    optionC: "Discontinue quetiapine and start carbamazepine for fetal safety",
    optionD: "Add lorazepam 2mg TID as monotherapy until delivery",
    correctAnswer: "B",
    rationale: "In the third trimester, the priority is rapid stabilization of mania to prevent harm to both mother and fetus. Quetiapine dose optimization is a reasonable first step. If insufficient, lithium is the most studied mood stabilizer in pregnancy. Third trimester lithium use requires: (1) more frequent level monitoring (levels can fluctuate due to increased renal clearance then rebound at delivery), (2) holding lithium 24-48 hours before planned delivery, (3) neonatal monitoring for lithium toxicity (floppy baby syndrome), (4) coordination with OB and neonatology. While lithium carries first-trimester cardiac risk (Ebstein's anomaly), this patient is in the third trimester where that risk is not applicable.",
    explanationA: "Valproate is CONTRAINDICATED in pregnancy at any stage — it carries 10% neural tube defect risk, is FDA Category X, and is associated with lower IQ and neurodevelopmental delays. Never use in women of childbearing potential without extreme caution.",
    explanationB: "Correct. Quetiapine optimization plus potential lithium addition (with close monitoring) is the most appropriate approach in the third trimester for acute mania.",
    explanationC: "Carbamazepine is also teratogenic (neural tube defects, though lower risk than valproate) and has complex drug interactions. Switching from a working medication mid-pregnancy is destabilizing.",
    explanationD: "Benzodiazepine monotherapy does not treat mania — it only provides sedation. Chronic third-trimester benzodiazepine use risks neonatal withdrawal syndrome (floppy infant, respiratory depression).",
    examTip: "Pregnancy + mania: Quetiapine and olanzapine are generally continued if working. Lithium can be added in 2nd/3rd trimester with close monitoring. Valproate is ALWAYS contraindicated in pregnancy. Coordination with OB is mandatory.",
    category: "Pharmacology",
    subtopic: "Perinatal psychopharmacology",
    difficulty: "hard",
    bennerStage: "expert",
    clinicalReasoningObj: "Manage acute psychiatric emergencies during pregnancy balancing maternal mental health with fetal safety",
    questionType: "advanced",
    clinicalTopic: "perinatal",
    pharmacologyFocus: "pregnancy,contraindications,adverse_effects,lithium_monitoring",
    bennerBreakdown: "Expert reasoning requires simultaneously weighing maternal psychiatric stability, fetal safety across different trimesters, pharmacokinetic changes of pregnancy, delivery planning, and neonatal risks. The clinician must know that valproate is absolutely contraindicated while lithium's risk profile changes by trimester."
  },
  // --- PSYCHOTHERAPY PRINCIPLES ---
  {
    stem: "A PMHNP is treating a 25-year-old patient with borderline personality disorder who repeatedly engages in parasuicidal behavior (cutting) when experiencing intense abandonment fears. During a session, the patient reports cutting after her therapist cancelled an appointment. From a Dialectical Behavior Therapy (DBT) framework, which therapeutic strategy BEST addresses this pattern?",
    optionA: "Prescribe an SSRI to treat the underlying depression causing the cutting behavior",
    optionB: "Conduct a behavioral chain analysis to identify the sequence from triggering event to self-harm, then develop distress tolerance skills for the vulnerability points",
    optionC: "Hospitalize the patient involuntarily for safety",
    optionD: "Terminate the therapeutic relationship as the patient is not complying with treatment",
    correctAnswer: "B",
    rationale: "Behavioral chain analysis is a core DBT intervention that maps the entire sequence: prompting event (therapist cancelled) → vulnerability factors (fear of abandonment, emotional dysregulation) → links in the chain (thoughts, emotions, body sensations, behaviors) → problem behavior (cutting) → consequences. By identifying each link, the clinician and patient can insert skills-based interventions at specific vulnerability points — particularly distress tolerance skills (TIPP, ACCEPTS, self-soothing) and emotion regulation skills. This is mechanism-matched treatment for BPD's core pathology.",
    explanationA: "While medication may be adjunctive, SSRIs do not address the core skill deficits in BPD. Cutting in BPD is primarily an emotion regulation strategy, not a depressive symptom.",
    explanationB: "Correct. Chain analysis identifies the functional sequence leading to self-harm, and distress tolerance skills provide alternative responses at each vulnerability point — core DBT methodology.",
    explanationC: "Hospitalization for chronic parasuicidal behavior in BPD is generally contraindicated unless there is imminent lethal intent. Repeated hospitalization reinforces the behavior pattern and disrupts treatment.",
    explanationD: "Terminating the relationship would confirm the patient's abandonment fears and is antitherapeutic. DBT specifically addresses therapist-patient relationship dynamics.",
    examTip: "DBT for BPD: Chain analysis + skills training (distress tolerance, emotion regulation, interpersonal effectiveness, mindfulness). Hospitalization for chronic self-harm in BPD is generally counterproductive. Know that DBT is the gold-standard psychotherapy for BPD.",
    category: "Pathophysiology",
    subtopic: "Psychotherapy models",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Apply evidence-based psychotherapy frameworks to complex personality disorder presentations",
    questionType: "advanced",
    clinicalTopic: "psychotherapy",
    pharmacologyFocus: "",
    bennerBreakdown: "Proficient reasoning requires understanding DBT's specific interventions (chain analysis, skills modules) and their clinical application. The clinician must recognize that BPD self-harm is functionally different from suicidal behavior in depression and requires a psychotherapy-first approach."
  },
  // --- LEGAL/ETHICAL ISSUES ---
  {
    stem: "A 38-year-old patient with schizophrenia, currently stable on long-acting injectable paliperidone, informs the PMHNP that he plans to stop his medication and 'live free.' He demonstrates understanding of his diagnosis, the purpose of medication, the consequences of stopping (past hospitalizations), and the risks and benefits. He has no current psychotic symptoms, suicidal ideation, or homicidal ideation. His reasoning is coherent though the PMHNP disagrees with his decision. What is the MOST ethically and legally appropriate response?",
    optionA: "Respect his autonomous decision after documenting his capacity, provide information about relapse warning signs, and establish a follow-up plan",
    optionB: "Initiate involuntary commitment because schizophrenia inherently impairs decision-making capacity",
    optionC: "Contact his family to override his decision since they have his best interest in mind",
    optionD: "Refuse to see the patient further as he is being non-compliant with treatment recommendations",
    correctAnswer: "A",
    rationale: "This patient demonstrates all four components of decision-making capacity: (1) Understanding — he understands his diagnosis and medication, (2) Appreciation — he acknowledges the consequences of stopping, (3) Reasoning — his thinking is coherent, (4) Choice — he is expressing a clear decision. Even when a clinician disagrees with a patient's decision, a competent adult has the ethical and legal right to refuse treatment (autonomy). The PMHNP should document the capacity assessment, provide psychoeducation about relapse warning signs, ensure the patient knows how to access care if needed, and offer continued follow-up.",
    explanationA: "Correct. A patient with demonstrated capacity has the legal right to refuse treatment. The PMHNP's ethical obligation is to respect autonomy while ensuring informed decision-making and continued access to care.",
    explanationB: "Having a diagnosis of schizophrenia does NOT automatically impair capacity. Capacity is assessed in the moment and can fluctuate. This patient currently demonstrates intact capacity on all four components.",
    explanationC: "Family cannot override a competent adult's healthcare decisions unless they have legal guardianship or healthcare power of attorney. Contacting family without consent would violate confidentiality (HIPAA).",
    explanationD: "Abandoning a patient for disagreeing with your recommendation is ethically impermissible and may constitute patient abandonment — a legal liability.",
    examTip: "Capacity ≠ Competency. Capacity is a clinical determination (4 components: understanding, appreciation, reasoning, choice). Competency is a legal determination made by a court. A patient with a psychiatric diagnosis can absolutely have capacity to make medical decisions.",
    category: "Physical Assessment",
    subtopic: "Ethical and legal frameworks",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Apply ethical principles and capacity assessment to complex treatment decision scenarios",
    questionType: "advanced",
    clinicalTopic: "legal_ethical",
    pharmacologyFocus: "",
    bennerBreakdown: "Proficient ethical reasoning requires distinguishing between capacity and competency, recognizing that psychiatric diagnosis alone does not impair capacity, and prioritizing patient autonomy when capacity criteria are met — even when the clinician disagrees with the patient's choice."
  },
  // --- DSM-BASED DIAGNOSIS ---
  {
    stem: "A 20-year-old college student presents with 3 months of persistent worry about multiple domains (academic performance, health, relationships, finances). She reports muscle tension, difficulty concentrating, irritability, restlessness, fatigue, and sleep disturbance. She denies panic attacks, obsessions/compulsions, specific phobias, or recent trauma. She uses alcohol socially (2-3 drinks/month) and denies substance use. Medical workup including thyroid function is normal. Which DSM-5-TR diagnosis requires a minimum of 6 months of symptoms, and how does this affect the current diagnostic formulation?",
    optionA: "Major depressive disorder requires 6 months; patient meets criteria",
    optionB: "Generalized anxiety disorder requires 6 months of excessive worry; the patient currently has 3 months and does not yet meet full criteria — diagnose as unspecified anxiety disorder and reassess",
    optionC: "Panic disorder requires 6 months of recurrent attacks; patient does not have panic attacks",
    optionD: "Social anxiety disorder requires 6 months; patient's worries are too broad for this diagnosis",
    correctAnswer: "B",
    rationale: "DSM-5-TR criteria for Generalized Anxiety Disorder require excessive anxiety and worry occurring more days than not for AT LEAST 6 MONTHS, accompanied by 3+ of 6 somatic/cognitive symptoms (restlessness, fatigue, concentration difficulty, irritability, muscle tension, sleep disturbance). This patient has the symptom profile but only 3 months of duration. The correct approach is to diagnose as Unspecified Anxiety Disorder (F41.9), begin appropriate treatment (as 3 months of significant symptoms warrants intervention), and reassess at 6 months for formal GAD diagnosis.",
    explanationA: "MDD requires 2 weeks minimum, not 6 months. The patient's profile is anxiety-predominant, not depressive.",
    explanationB: "Correct. GAD has a strict 6-month duration criterion. At 3 months, the patient doesn't meet full criteria, but treatment should not be withheld — use unspecified anxiety disorder.",
    explanationC: "Panic disorder does not require 6 months of attacks. It requires recurrent unexpected panic attacks with at least 1 month of concern about future attacks or behavioral changes. This patient denies panic attacks.",
    explanationD: "Social anxiety disorder can be diagnosed with 6-month duration requirement (per DSM-5-TR), but the patient's worry domains are too broad and diverse for social anxiety, which is specifically about social situations and evaluation.",
    examTip: "Duration criteria are heavily tested: GAD = 6 months. MDD = 2 weeks. Mania = 1 week (or any duration if hospitalized). Hypomania = 4 days. PTSD = 1 month. ASD = 3 days to 1 month. Know these cold.",
    category: "Pathophysiology",
    subtopic: "DSM-5-TR diagnostic criteria",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Apply precise DSM-5-TR duration criteria to formulate accurate provisional diagnoses",
    questionType: "advanced",
    clinicalTopic: "dsm_diagnosis",
    pharmacologyFocus: "",
    bennerBreakdown: "Competent diagnosticians must apply DSM criteria precisely — not just symptom lists but also duration requirements, exclusion criteria, and appropriate provisional diagnoses when full criteria are not yet met. This question tests the 6-month duration criterion that distinguishes GAD from other anxiety presentations."
  },
  // --- PSYCHIATRIC ASSESSMENT ---
  {
    stem: "A PMHNP is conducting an initial psychiatric evaluation of a 55-year-old male referred for 'anxiety and depression.' During the interview, the patient reports sudden-onset episodes of intense fear with palpitations, diaphoresis, and a sense of doom lasting 2-3 minutes, occurring exclusively during physical exertion. He has lost 20 pounds over 3 months without trying, reports flushing and headaches, and his blood pressure is 178/110. These episodes began 4 months ago. Which psychiatric assessment finding should trigger an URGENT medical referral before initiating psychiatric treatment?",
    optionA: "The 20-pound weight loss suggests anorexia nervosa requiring nutritional consultation",
    optionB: "The pattern of episodic anxiety with severe hypertension, weight loss, and exertion-triggered attacks suggests pheochromocytoma requiring urgent catecholamine testing",
    optionC: "The palpitations and fear suggest panic disorder requiring immediate SSRI initiation",
    optionD: "The flushing suggests carcinoid syndrome but this can be evaluated at routine follow-up",
    correctAnswer: "B",
    rationale: "This presentation contains critical red flags for pheochromocytoma — a catecholamine-secreting adrenal tumor: (1) Paroxysmal episodes of anxiety/fear with autonomic activation (classic 'panic attack' mimicker), (2) SEVERE hypertension (178/110), (3) Episodes triggered by physical exertion (which stimulates catecholamine release from the tumor), (4) Unexplained weight loss, (5) Headaches and flushing. The triad of headaches, diaphoresis, and palpitations with hypertension has >90% sensitivity for pheochromocytoma. This is a medical emergency — undiagnosed pheochromocytoma can cause hypertensive crisis, stroke, or death. Urgent 24-hour urine catecholamines/metanephrines and plasma metanephrines are indicated.",
    explanationA: "The weight loss is involuntary and accompanied by severe autonomic symptoms, making anorexia nervosa extremely unlikely. The pattern suggests an underlying medical condition.",
    explanationB: "Correct. The combination of paroxysmal anxiety, severe hypertension, exertion-triggered episodes, weight loss, flushing, and headaches strongly suggests pheochromocytoma — a potentially life-threatening condition requiring urgent medical evaluation.",
    explanationC: "Initiating psychiatric medication without medical workup in this presentation could be dangerous. SSRIs would not address the underlying pathology, and the severe hypertension warrants emergency medical evaluation.",
    explanationD: "While carcinoid syndrome includes flushing, the complete symptom picture (severe paroxysmal hypertension, exertion-triggered attacks) points more strongly to pheochromocytoma. Either way, this cannot wait for routine follow-up.",
    examTip: "Medical mimics of panic disorder: pheochromocytoma, hyperthyroidism, cardiac arrhythmias, pulmonary embolism, temporal lobe epilepsy. KEY DIFFERENTIATOR: true panic attacks are NOT reliably triggered by exertion and do not cause sustained hypertension. Always check vitals during psychiatric assessment.",
    category: "Physical Assessment",
    subtopic: "Medical differential in psychiatric presentations",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Identify life-threatening medical conditions presenting as psychiatric emergencies through comprehensive assessment",
    questionType: "advanced",
    clinicalTopic: "psychiatric_assessment",
    pharmacologyFocus: "",
    bennerBreakdown: "Proficient psychiatric assessment requires global clinical thinking — recognizing when 'psychiatric symptoms' are actually medical emergencies. The exertion-triggered pattern and severe hypertension are key differentiators from true panic disorder that the proficient clinician must catch."
  },
  // --- ADDITIONAL PSYCHOPHARMACOLOGY QUESTIONS ---
  // EPS and Tardive Dyskinesia
  {
    stem: "A 50-year-old female with chronic schizophrenia managed on haloperidol 10mg daily for 15 years presents with involuntary, repetitive movements: lip smacking, tongue protrusion, lateral jaw movements, and choreiform finger movements. The movements are persistent and worsen with stress. What is this condition, and what is the FDA-approved pharmacological treatment?",
    optionA: "Acute dystonia; treat with benztropine 2mg IM",
    optionB: "Tardive dyskinesia; treat with valbenazine (VMAT2 inhibitor)",
    optionC: "Neuroleptic malignant syndrome; discontinue haloperidol and provide supportive care",
    optionD: "Akathisia; treat with propranolol",
    correctAnswer: "B",
    rationale: "This presentation is classic tardive dyskinesia (TD): involuntary, repetitive orofacial movements (lip smacking, tongue protrusion, jaw movements) and choreiform limb movements occurring after prolonged antipsychotic use. TD results from dopaminergic receptor supersensitivity in the nigrostriatal pathway after chronic D2 blockade. Valbenazine (Ingrezza) is FDA-approved for tardive dyskinesia. It is a vesicular monoamine transporter 2 (VMAT2) inhibitor that reduces dopamine packaging into synaptic vesicles, thereby decreasing dopaminergic tone in the affected circuits. Deutetrabenazine (Austedo) is also FDA-approved for TD via the same mechanism.",
    explanationA: "Acute dystonia presents with sustained, painful muscle contractions (torticollis, oculogyric crisis) and occurs within hours to days of antipsychotic initiation, not after 15 years.",
    explanationB: "Correct. Tardive dyskinesia from chronic D2 blockade is treated with VMAT2 inhibitors (valbenazine or deutetrabenazine), the only FDA-approved treatments.",
    explanationC: "NMS presents with hyperthermia, severe rigidity, autonomic instability, and altered consciousness — a medical emergency distinct from the chronic, rhythmic movements of TD.",
    explanationD: "Akathisia is subjective restlessness and inability to sit still, not rhythmic orofacial movements. Propranolol helps akathisia but would not treat TD.",
    examTip: "EPS timeline: Acute dystonia (hours-days) → Akathisia (days-weeks) → Parkinsonism (weeks-months) → Tardive dyskinesia (months-years). TD treatment: VMAT2 inhibitors (valbenazine, deutetrabenazine). Anticholinergics do NOT treat TD and may worsen it.",
    category: "Pharmacology",
    subtopic: "Extrapyramidal side effects",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Differentiate EPS subtypes by timeline and presentation and identify mechanism-specific treatments",
    questionType: "advanced",
    clinicalTopic: "psychotic_disorders",
    pharmacologyFocus: "eps,tardive_dyskinesia,moa,receptor_activity",
    bennerBreakdown: "Competent clinicians must differentiate four EPS subtypes by timeline, presentation, and treatment. This question specifically tests the distinction between TD (chronic, orofacial, treated with VMAT2 inhibitors) and other EPS — a common board exam topic."
  },
  // NMS
  {
    stem: "A 32-year-old male was started on haloperidol 10mg IM in the emergency department for acute agitation 36 hours ago. He now presents with temperature 104.2°F, severe generalized muscle rigidity ('lead-pipe'), altered mental status (confused and diaphoretic), blood pressure 180/100, heart rate 128, and CPK of 14,000 U/L. What is the diagnosis and the most critical management steps?",
    optionA: "Serotonin syndrome; administer cyproheptadine and discontinue all serotonergic agents",
    optionB: "Neuroleptic malignant syndrome; immediately discontinue haloperidol, provide aggressive cooling, IV fluids, and consider dantrolene or bromocriptine",
    optionC: "Malignant hyperthermia; administer dantrolene and prepare for intubation",
    optionD: "Catatonia; administer lorazepam 2mg IV",
    correctAnswer: "B",
    rationale: "This is a classic presentation of neuroleptic malignant syndrome (NMS): the tetrad of hyperthermia, severe muscle rigidity, autonomic instability, and altered mental status occurring within days of antipsychotic initiation or dose increase. The markedly elevated CPK (14,000; normal <200) confirms rhabdomyolysis from sustained muscle contraction. NMS is a medical emergency with 5-10% mortality. Management: (1) STOP the causative agent immediately, (2) Aggressive IV hydration to prevent renal failure from myoglobinuria, (3) Active cooling measures, (4) Dantrolene (skeletal muscle relaxant) for severe rigidity, (5) Bromocriptine (dopamine agonist) to restore dopaminergic tone, (6) ICU monitoring with renal function tracking.",
    explanationA: "Serotonin syndrome presents with clonus, hyperreflexia, and agitation — typically from serotonergic drug combinations. This patient's 'lead-pipe' rigidity and recent antipsychotic use points to NMS, not serotonin syndrome. Key differentiator: NMS = rigidity, serotonin syndrome = clonus/hyperreflexia.",
    explanationB: "Correct. NMS requires immediate antipsychotic cessation, aggressive supportive care, and consideration of dantrolene and bromocriptine. This is a medical emergency.",
    explanationC: "Malignant hyperthermia occurs in the operating room from anesthetic agents (succinylcholine, volatile anesthetics), not from antipsychotics.",
    explanationD: "While catatonia can present with rigidity and hyperthermia (lethal catatonia), the direct temporal relationship to haloperidol initiation and the full NMS tetrad makes NMS the primary diagnosis. However, there is diagnostic overlap, and lorazepam trial may be considered.",
    examTip: "NMS vs Serotonin Syndrome: NMS = LEAD-PIPE rigidity, slow onset (days), from antipsychotics. SS = CLONUS/hyperreflexia, rapid onset (hours), from serotonergic drugs. Both are emergencies. Know the difference - this is a board favorite.",
    category: "Pharmacology",
    subtopic: "Psychiatric emergencies",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Recognize and initiate emergency management of neuroleptic malignant syndrome",
    questionType: "advanced",
    clinicalTopic: "psychotic_disorders",
    pharmacologyFocus: "nms,adverse_effects,receptor_activity",
    bennerBreakdown: "Competent clinicians must recognize NMS as a medical emergency from its cardinal features and distinguish it from serotonin syndrome (a common diagnostic trap). The key differentiator is rigidity type (lead-pipe vs. clonus) and temporal relationship to causative agent class."
  },
  // Serotonin Syndrome
  {
    stem: "A 40-year-old patient on fluoxetine 40mg daily presents to the PMHNP reporting she was prescribed tramadol by her orthopedic surgeon for a fracture 2 days ago. She now reports agitation, diaphoresis, diarrhea, tremor, and myoclonus. On examination: temperature 100.8°F, HR 102, BP 150/90, dilated pupils, hyperreflexia throughout, inducible ankle clonus, and diffuse muscle hypertonicity. What is the diagnosis and the critical intervention?",
    optionA: "Neuroleptic malignant syndrome from fluoxetine; start dantrolene",
    optionB: "Serotonin syndrome from fluoxetine-tramadol interaction; discontinue both agents, provide supportive care, and administer cyproheptadine if needed",
    optionC: "Anticholinergic toxicity from fluoxetine; administer physostigmine",
    optionD: "Panic disorder exacerbation; increase fluoxetine to 60mg",
    correctAnswer: "B",
    rationale: "This is serotonin syndrome resulting from the combination of fluoxetine (SSRI — serotonin reuptake inhibitor) and tramadol (weak opioid with serotonin reuptake inhibition and serotonin release properties). The Hunter criteria for serotonin syndrome are met: spontaneous clonus with agitation and diaphoresis. Additional features include hyperreflexia, myoclonus, tremor, dilated pupils, tachycardia, hyperthermia, and diarrhea. Management: (1) Discontinue ALL serotonergic agents, (2) Supportive care (IV fluids, cooling, benzodiazepines for agitation), (3) Cyproheptadine (5-HT2A antagonist) 12mg initial dose then 4mg q4-6h for moderate-severe cases.",
    explanationA: "NMS is from antipsychotics, presents with LEAD-PIPE rigidity (not clonus/hyperreflexia), and has slower onset. Fluoxetine is an SSRI, not an antipsychotic.",
    explanationB: "Correct. Fluoxetine + tramadol is a classic serotonin syndrome trigger. Tramadol's serotonergic properties are often underrecognized by non-psychiatric prescribers.",
    explanationC: "Anticholinergic toxicity presents with dry skin ('dry as a bone'), urinary retention, ileus, and delirium — essentially the OPPOSITE of serotonin syndrome's diaphoresis and diarrhea.",
    explanationD: "This is a drug interaction emergency, not a psychiatric exacerbation. Increasing fluoxetine would be dangerous.",
    examTip: "Serotonin syndrome triggers to know: SSRI + MAOI (most dangerous), SSRI + tramadol, SSRI + linezolid, SSRI + triptans (lower risk), SSRI + St. John's wort. Tramadol is the most commonly tested 'hidden' serotonergic drug. Always screen for non-psychiatric serotonergic medications.",
    category: "Pharmacology",
    subtopic: "Drug interactions",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Identify serotonin syndrome from multi-prescriber drug interactions and initiate appropriate emergency management",
    questionType: "advanced",
    clinicalTopic: "mood_disorders",
    pharmacologyFocus: "serotonin_syndrome,drug_interactions,adverse_effects",
    bennerBreakdown: "Competent clinicians must recognize that serotonin syndrome often results from multi-prescriber drug interactions where the psychiatrist's medication interacts with medications prescribed by other providers. Tramadol's serotonergic activity is a critical 'hidden interaction' that the PMHNP must proactively screen for."
  },
  // QT Prolongation
  {
    stem: "A PMHNP is prescribing ziprasidone for a 45-year-old patient with schizophrenia. Baseline ECG shows a QTc interval of 455 ms. The patient is also taking methadone 80mg daily for opioid use disorder and ondansetron as needed for nausea. Which pharmacological consideration is MOST critical?",
    optionA: "Ziprasidone is safe to prescribe regardless of QTc interval because it is an atypical antipsychotic",
    optionB: "The combination of ziprasidone, methadone, and ondansetron creates additive QT prolongation risk; ziprasidone should be avoided and an alternative antipsychotic with lower QT risk should be selected",
    optionC: "Methadone does not affect the QT interval and can be safely combined with any antipsychotic",
    optionD: "QTc of 455 ms is normal and does not require any monitoring or medication adjustments",
    correctAnswer: "B",
    rationale: "This patient has THREE QT-prolonging medications: ziprasidone (one of the highest QT-prolonging antipsychotics), methadone (significant QT prolongation — documented cause of torsades de pointes), and ondansetron (FDA warning for QT prolongation at higher doses). The baseline QTc of 455 ms is already borderline prolonged (normal <440 ms in males, <460 ms in females). Adding ziprasidone to this regimen creates dangerous additive QT prolongation risk, potentially leading to torsades de pointes and sudden cardiac death. Alternative antipsychotics with lower QT risk include aripiprazole, olanzapine, or lurasidone.",
    explanationA: "Ziprasidone has the longest QTc prolongation potential among commonly used atypical antipsychotics (+20ms mean increase). It is NOT safe to prescribe without considering QTc and concomitant medications.",
    explanationB: "Correct. The triple QT-prolonging drug combination with a borderline QTc creates unacceptable cardiac risk. Ziprasidone should be avoided in favor of a QT-friendlier alternative.",
    explanationC: "Methadone is a well-documented cause of QT prolongation and torsades de pointes. ECG monitoring is standard practice for patients on methadone.",
    explanationD: "QTc of 455 ms is borderline prolonged and warrants monitoring. Adding QT-prolonging medications to this baseline is high-risk. QTc >500 ms is considered dangerous.",
    examTip: "QT-prolonging psych medications (highest to lowest risk): thioridazine > ziprasidone > IV haloperidol > iloperidone > quetiapine > chlorpromazine. Safest: aripiprazole, lurasidone. ALWAYS check baseline ECG and concomitant medications. QTc >500 = danger zone.",
    category: "Pharmacology",
    subtopic: "Cardiac safety",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Assess cumulative QT prolongation risk from multiple drug interactions and select cardiac-safe alternatives",
    questionType: "advanced",
    clinicalTopic: "psychiatric_assessment",
    pharmacologyFocus: "qt_prolongation,drug_interactions,adverse_effects,contraindications",
    bennerBreakdown: "Proficient reasoning requires systematic identification of ALL QT-prolonging medications in a patient's regimen (including non-psychiatric drugs like methadone and ondansetron), assessment of cumulative risk at a specific baseline QTc, and selection of a mechanistically safer alternative."
  },
  // Clozapine Monitoring
  {
    stem: "A 38-year-old patient with treatment-resistant schizophrenia has been on clozapine 400mg/day for 8 months with excellent symptom control. The most recent ANC (absolute neutrophil count) result is 1,200/μL (previously stable at >2,000). The patient reports a mild sore throat and low-grade fever. What is the MOST appropriate action?",
    optionA: "Continue clozapine at current dose and recheck ANC in 1 month as planned",
    optionB: "This ANC represents mild neutropenia (1,000-1,499/μL); increase monitoring to 3x weekly, perform a repeat ANC, and obtain a complete medical workup for the sore throat and fever",
    optionC: "Immediately discontinue clozapine permanently as this ANC confirms agranulocytosis",
    optionD: "Reduce clozapine dose to 200mg and recheck ANC in 2 weeks",
    correctAnswer: "B",
    rationale: "Clozapine-induced neutropenia follows a specific monitoring protocol (REMS). An ANC of 1,200/μL falls in the 'mild neutropenia' range (1,000-1,499/μL), requiring increased monitoring to 3x weekly. Agranulocytosis is defined as ANC <500/μL. The concurrent sore throat and fever are concerning because neutropenic patients are at increased infection risk — a CBC with differential and infection workup (blood cultures, chest X-ray if indicated) should be performed urgently. If ANC drops below 1,000, clozapine must be interrupted. If below 500, clozapine must be discontinued permanently and the patient is banned from rechallenge.",
    explanationA: "Monthly monitoring is only appropriate for stable ANC values >1,500/μL after 12 months. An ANC of 1,200 requires escalated monitoring to 3x weekly.",
    explanationB: "Correct. ANC 1,000-1,499 = mild neutropenia requiring increased monitoring frequency. The infectious symptoms necessitate concurrent medical evaluation.",
    explanationC: "ANC 1,200 is NOT agranulocytosis (which is ANC <500). Premature permanent discontinuation of effective clozapine would deprive this patient of potentially their only effective treatment.",
    explanationD: "Dose reduction is not the standard protocol for neutropenia. The monitoring frequency must be increased according to REMS requirements. Dose reduction would also risk loss of antipsychotic efficacy.",
    examTip: "Clozapine REMS ANC thresholds: ≥1,500 = normal frequency. 1,000-1,499 = mild (3x/week). 500-999 = moderate (daily + hold clozapine). <500 = severe agranulocytosis (DC permanently, never rechallenge). Know these thresholds exactly.",
    category: "Pharmacology",
    subtopic: "Clozapine monitoring",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Apply clozapine REMS monitoring protocols and manage neutropenia with appropriate clinical escalation",
    questionType: "advanced",
    clinicalTopic: "psychotic_disorders",
    pharmacologyFocus: "clozapine_monitoring,adverse_effects,contraindications",
    bennerBreakdown: "Proficient clinicians must know clozapine REMS thresholds exactly and respond with algorithmic precision. This question tests the mild neutropenia protocol (increased monitoring, NOT discontinuation) while also requiring recognition that concurrent infection symptoms demand medical workup in a neutropenic patient."
  },
  // Lithium Monitoring
  {
    stem: "A 62-year-old patient with bipolar I disorder has been on lithium 900mg/day for 5 years with good mood stability. She presents for routine follow-up and reports starting lisinopril (ACE inhibitor) 2 months ago for hypertension and ibuprofen daily for knee osteoarthritis. Current labs: lithium level 1.4 mEq/L (previous 0.8), creatinine 1.5 mg/dL (previous 1.0), TSH 6.8 mIU/L (previous 3.0). What is the MOST critical pharmacological concern?",
    optionA: "The lithium level is therapeutic and no changes are needed",
    optionB: "Both lisinopril and ibuprofen reduce renal lithium clearance, causing the lithium level to rise from 0.8 to 1.4 — approaching toxicity; ibuprofen should be immediately discontinued and lithium dose reduced with close monitoring",
    optionC: "TSH elevation is unrelated to lithium and requires only thyroid supplementation",
    optionD: "Creatinine elevation is expected with age and requires no intervention",
    correctAnswer: "B",
    rationale: "This case demonstrates two critical lithium drug interactions: (1) NSAIDs (ibuprofen) reduce renal prostaglandin synthesis, decreasing renal blood flow and lithium clearance by 20-40%. (2) ACE inhibitors (lisinopril) decrease GFR and aldosterone, reducing lithium clearance. Together, these two medications have increased this patient's lithium level from 0.8 to 1.4 mEq/L — approaching the toxic range. The rising creatinine also suggests worsening renal function. Immediate action: discontinue ibuprofen (most impactful), reduce lithium dose, recheck level in 3-5 days, substitute acetaminophen for pain. The TSH elevation is likely lithium-induced hypothyroidism (a known long-term effect) requiring levothyroxine.",
    explanationA: "A lithium level of 1.4 is at the high end of the extended range and above the typical target (0.6-1.2). Given the trajectory (0.8 → 1.4) and identifiable cause, this is not a safe steady state.",
    explanationB: "Correct. The NSAID + ACE inhibitor combination has dangerously reduced lithium clearance. NSAID discontinuation and lithium dose reduction are urgent priorities.",
    explanationC: "TSH elevation in a long-term lithium patient IS related to lithium (15-20% of patients develop hypothyroidism). Levothyroxine is needed, but the acute lithium toxicity risk takes priority.",
    explanationD: "The creatinine rise is concurrent with lithium level elevation and likely reflects the combined effect of NSAID + ACE inhibitor on renal function. This is not benign age-related change.",
    examTip: "Drugs that increase lithium levels: NSAIDs (most common exam answer), ACE inhibitors, ARBs, thiazide diuretics. Drugs that decrease lithium levels: theophylline, caffeine, osmotic diuretics. ALWAYS screen for new medications when lithium levels change unexpectedly.",
    category: "Pharmacology",
    subtopic: "Lithium drug interactions",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Identify cumulative drug interactions affecting lithium clearance and implement corrective pharmacological management",
    questionType: "advanced",
    clinicalTopic: "mood_disorders",
    pharmacologyFocus: "lithium_monitoring,drug_interactions,renal_hepatic,adverse_effects",
    bennerBreakdown: "Proficient pharmacological reasoning requires recognizing that two independently prescribed medications (by different providers) have created additive renal effects that elevated lithium to a dangerous level. The clinician must understand renal prostaglandin and renin-angiotensin pharmacology to explain the mechanism."
  },
  // Valproate Issues
  {
    stem: "A 24-year-old female with bipolar I disorder is being considered for valproate (divalproex sodium) therapy. She reports irregular menstrual cycles and has a BMI of 32. Which critical valproate adverse effect is MOST relevant to this patient's profile, and what monitoring is required?",
    optionA: "Hepatotoxicity requiring monthly liver function tests for the first 6 months",
    optionB: "Valproate is associated with polycystic ovary syndrome (PCOS), weight gain, hyperinsulinemia, and teratogenicity — making it a poor choice for women of childbearing age; if prescribed, pregnancy testing, comprehensive metabolic monitoring, and effective contraception are mandatory",
    optionC: "Neural tube defects but only when taken during the third trimester",
    optionD: "Thrombocytopenia requiring weekly platelet counts",
    correctAnswer: "B",
    rationale: "Valproate poses unique risks for women of reproductive age: (1) Teratogenicity: FDA Category X with 10% risk of neural tube defects (spina bifida), reduced IQ, and higher rates of autism spectrum disorder in offspring. Risk is highest in first trimester (often before pregnancy is recognized). (2) PCOS risk: valproate is associated with weight gain, hyperandrogenism, menstrual irregularities, and polycystic ovary morphology — this patient already has irregular cycles and obesity, creating additional PCOS risk. (3) Metabolic effects: weight gain, insulin resistance. Monitoring requirements: pregnancy test before and periodically during treatment, reliable contraception counseling, CBC (thrombocytopenia), liver function tests, valproate levels, and metabolic parameters (weight, lipids, fasting glucose).",
    explanationA: "While hepatotoxicity is a valproate risk (especially in children under 2 with metabolic disorders), it is not the MOST relevant concern for this specific patient profile.",
    explanationB: "Correct. For a young woman of childbearing potential with existing menstrual irregularity and obesity, valproate's teratogenicity, PCOS association, and weight effects are the most critical considerations.",
    explanationC: "Neural tube defects occur during FIRST trimester organogenesis (weeks 3-4), not the third trimester. This makes early pregnancy exposure the highest risk period.",
    explanationD: "While valproate can cause dose-dependent thrombocytopenia, weekly platelet counts are not standard — periodic CBC monitoring is sufficient unless symptomatic.",
    examTip: "Valproate + women of childbearing age = RED FLAG. If prescribed: pregnancy test, contraception counseling, folate supplementation, informed consent about risks. Many guidelines now recommend AVOIDING valproate entirely in women who may become pregnant. Know the 10% NTD risk.",
    category: "Pharmacology",
    subtopic: "Valproate reproductive risks",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Evaluate gender-specific adverse effect profiles and apply reproductive safety considerations to medication selection",
    questionType: "advanced",
    clinicalTopic: "perinatal",
    pharmacologyFocus: "valproate_issues,pregnancy,adverse_effects,contraindications",
    bennerBreakdown: "Competent prescribers must recognize that medication selection is not gender-neutral. Valproate's reproductive implications are severe and often inadequately communicated. This question tests the ability to connect a patient's existing risk factors (irregular cycles, obesity) with valproate's known hormonal and metabolic effects."
  },
  // Renal/Hepatic Considerations
  {
    stem: "A 58-year-old patient with schizophrenia and stage 4 chronic kidney disease (eGFR 22 mL/min) requires antipsychotic therapy. He was previously on risperidone but developed severe EPS. Which atypical antipsychotic requires the LEAST renal dose adjustment and would be most appropriate for this patient?",
    optionA: "Paliperidone (extended-release), as it is the active metabolite of risperidone",
    optionB: "Quetiapine, which is primarily hepatically metabolized with minimal renal excretion",
    optionC: "Lithium, as it has a wide therapeutic window",
    optionD: "Aripiprazole extended-release injection, as depot formulations bypass renal clearance",
    correctAnswer: "B",
    rationale: "Quetiapine is primarily metabolized by the liver (CYP3A4) with minimal renal excretion of unchanged drug (<1%). This makes it one of the safest atypical antipsychotics for patients with significant renal impairment. No dose adjustment is needed based on renal function alone. In contrast, paliperidone and risperidone's active metabolite are significantly renally cleared and require substantial dose reduction in CKD. This patient also had EPS on risperidone, making paliperidone (same active metabolite) inappropriate. Quetiapine has low D2 affinity, reducing EPS risk.",
    explanationA: "Paliperidone is the WORST choice for renal impairment — approximately 59% is renally excreted unchanged. It also shares the same active metabolite as risperidone (which caused EPS), so EPS would likely recur.",
    explanationB: "Correct. Quetiapine is hepatically metabolized with <1% renal excretion. It also has lower D2 binding affinity, reducing EPS risk compared to risperidone/paliperidone.",
    explanationC: "Lithium is almost entirely renally cleared and is CONTRAINDICATED in severe CKD. It is not an antipsychotic and is dangerous in renal impairment.",
    explanationD: "While depot formulations alter absorption kinetics, aripiprazole is still metabolized and cleared systemically. The route of administration does not bypass the need for renal function consideration in drug clearance.",
    examTip: "Renal impairment psych drug cautions: AVOID paliperidone, lithium, gabapentin/pregabalin (renally cleared). SAFER choices: quetiapine, olanzapine, aripiprazole (hepatically metabolized). Always check route of elimination when selecting psychotropics in organ impairment.",
    category: "Pharmacology",
    subtopic: "Organ-impairment pharmacology",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Select psychotropic medications considering organ-specific elimination routes and prior adverse effect history",
    questionType: "advanced",
    clinicalTopic: "psychiatric_assessment",
    pharmacologyFocus: "renal_hepatic,adverse_effects,drug_interactions,eps",
    bennerBreakdown: "Proficient prescribers must know the primary elimination route of every major psychotropic. This question requires integrating THREE factors: renal function status (which rules out renally cleared drugs), prior adverse effects (EPS on risperidone rules out paliperidone), and pharmacokinetic reasoning to select quetiapine."
  },
  // Additional Mood Disorders - Expert
  {
    stem: "A 55-year-old male with recurrent major depressive disorder has a 6-week history of persistent depressive symptoms despite adequate trials of escitalopram, bupropion, and venlafaxine plus aripiprazole augmentation. He reports psychomotor retardation, near-catatonic immobility, mutism, and food refusal. He has lost 18 pounds and is becoming dehydrated. He has no paranoid ideation or hallucinations. Given the severity and time-sensitivity, what is the MOST appropriate intervention?",
    optionA: "Add lithium augmentation and reassess in 4-6 weeks",
    optionB: "Switch to an MAOI (tranylcypromine) with a 2-week washout from venlafaxine",
    optionC: "Refer for electroconvulsive therapy (ECT), which is indicated for severe, treatment-resistant depression with catatonic features and medical compromise",
    optionD: "Start IV ketamine infusion for rapid antidepressant effect",
    correctAnswer: "C",
    rationale: "This patient has treatment-resistant depression with catatonic features (psychomotor retardation approaching immobility, mutism, food refusal) and is medically compromised (weight loss, dehydration). ECT is the gold-standard treatment for: (1) treatment-resistant depression, (2) depression with catatonic features, (3) situations where rapid response is medically necessary. ECT response rates in treatment-resistant depression are 50-70%, and catatonic features are among the strongest predictors of ECT response. The medical compromise (food refusal, dehydration) creates urgency that precludes waiting 4-6 weeks for medication trials.",
    explanationA: "Lithium augmentation takes 4-6 weeks to assess — this patient cannot safely wait that long given medical compromise from food refusal and dehydration.",
    explanationB: "MAOI switching requires a 2-week washout from venlafaxine (to avoid serotonin syndrome), then another 4-6 weeks for MAOI response. This timeline is unsafe given the patient's deteriorating medical status.",
    explanationC: "Correct. ECT provides the fastest, most effective intervention for severe treatment-resistant depression with catatonic features and medical urgency.",
    explanationD: "While IV ketamine has rapid onset, it is not first-line for catatonic depression and does not have the same evidence base as ECT for catatonic features. It also provides transient effects requiring repeated dosing.",
    examTip: "Top ECT indications: (1) catatonia, (2) treatment-resistant depression, (3) severe depression with psychotic features, (4) medical urgency (food refusal, suicidality), (5) pregnancy where medications are limited. ECT is NOT a last resort — it is a first-line treatment for these specific presentations.",
    category: "Pharmacology",
    subtopic: "Somatic treatments",
    difficulty: "hard",
    bennerStage: "expert",
    clinicalReasoningObj: "Identify clinical presentations where somatic treatments (ECT) are the primary indicated intervention over pharmacotherapy",
    questionType: "advanced",
    clinicalTopic: "mood_disorders",
    pharmacologyFocus: "moa,contraindications",
    bennerBreakdown: "Expert reasoning recognizes that ECT is not a 'last resort' but a PRIMARY treatment for specific presentations. The expert clinician integrates: treatment resistance (multiple failures), catatonic features (strong ECT predictor), and medical urgency (dehydration/malnutrition) to select ECT as the first-line intervention rather than the next pharmacological trial."
  },
  // Substance Use - Opioid MAT
  {
    stem: "A 32-year-old female with severe opioid use disorder is being initiated on buprenorphine/naloxone (Suboxone) for medication-assisted treatment. She last used heroin 8 hours ago and is not yet in withdrawal (COWS score 4). The PMHNP should wait to initiate buprenorphine until what clinical condition is met, and why?",
    optionA: "Wait until the patient has been opioid-free for 48 hours to ensure complete detoxification",
    optionB: "Initiate immediately regardless of withdrawal status for fastest stabilization",
    optionC: "Wait until the patient is in moderate opioid withdrawal (COWS ≥12) because buprenorphine's partial agonist activity at mu-opioid receptors will displace full agonists and precipitate severe withdrawal if given too early",
    optionD: "Wait 24 hours and only initiate if patient has no residual opioid effects",
    correctAnswer: "C",
    rationale: "Buprenorphine is a partial mu-opioid receptor agonist with VERY HIGH receptor binding affinity. If administered while full agonist opioids (heroin, fentanyl) are still occupying mu receptors, buprenorphine will displace them (due to its higher affinity) but provide less receptor activation (due to its partial agonist nature). This displacement causes precipitated withdrawal — sudden, severe withdrawal that is far worse than natural withdrawal. The standard induction protocol requires waiting until COWS ≥12 (moderate withdrawal), indicating sufficient opioid dissipation from receptors. Note: fentanyl's lipophilicity may require longer waiting periods (36-72 hours or micro-dosing protocols).",
    explanationA: "48 hours of abstinence is unnecessarily long for heroin (short half-life) and would subject the patient to prolonged suffering. The clinical marker is withdrawal severity (COWS), not a set time period.",
    explanationB: "Premature initiation when opioids are still on receptors will cause precipitated withdrawal — a severe, distressing event that can destroy treatment engagement and is medically dangerous.",
    explanationC: "Correct. COWS ≥12 ensures sufficient mu-receptor vacancy for buprenorphine to bind without displacing remaining full agonists. The partial agonist pharmacology is the key mechanism.",
    explanationD: "24 hours is an arbitrary timeframe. With short-acting opioids like heroin, COWS score is a more reliable clinical marker than clock time. Some patients enter moderate withdrawal sooner; others, especially with fentanyl exposure, may take longer.",
    examTip: "Buprenorphine induction = WAIT for COWS ≥12. Precipitated withdrawal is the #1 risk of premature induction. With fentanyl (highly lipophilic, stored in fat), consider micro-dosing protocols (Bernese method) to avoid precipitated withdrawal from slow fentanyl release. This is increasingly tested.",
    category: "Pharmacology",
    subtopic: "Opioid use disorder treatment",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Apply partial agonist pharmacology to safely initiate buprenorphine treatment and prevent precipitated withdrawal",
    questionType: "advanced",
    clinicalTopic: "substance_use",
    pharmacologyFocus: "receptor_activity,moa,adverse_effects,contraindications",
    bennerBreakdown: "Competent MAT prescribers must understand WHY precipitated withdrawal occurs (partial agonist displacement of full agonists) to apply induction protocols safely. This pharmacological reasoning, not rote memorization of time windows, enables adaptation to complex scenarios like fentanyl exposure."
  },
  // Geriatric - Anticholinergic burden
  {
    stem: "A 78-year-old male with major depressive disorder, overactive bladder, allergic rhinitis, and insomnia is currently taking paroxetine 20mg, oxybutynin 5mg BID, diphenhydramine 50mg at bedtime, and benztropine 1mg BID (from a previous antipsychotic). He presents with new-onset confusion, dry mouth, constipation, urinary retention, and visual blurring. What is the MOST likely cause and management priority?",
    optionA: "Major depressive disorder exacerbation causing psychomotor slowing; increase paroxetine to 40mg",
    optionB: "Cumulative anticholinergic burden from four anticholinergic medications causing anticholinergic toxicity/delirium; systematically reduce anticholinergic load by switching to alternatives",
    optionC: "Urinary tract infection causing delirium; order urinalysis",
    optionD: "Early Alzheimer's dementia; refer for neuropsychological testing",
    correctAnswer: "B",
    rationale: "This patient is on FOUR medications with significant anticholinergic properties: paroxetine (highest anticholinergic SSRI), oxybutynin (strong anticholinergic), diphenhydramine (first-generation antihistamine — strongly anticholinergic), and benztropine (anticholinergic anti-Parkinsonian agent). The cumulative anticholinergic burden in an elderly patient produces the classic anticholinergic toxicity syndrome: confusion (delirium), dry mouth, constipation, urinary retention, and visual blurring. Elderly patients are especially vulnerable due to decreased cholinergic reserve. Management: systematically deprescribe — switch paroxetine to sertraline (low anticholinergic), discontinue benztropine (no current antipsychotic), switch oxybutynin to mirabegron (beta-3 agonist), replace diphenhydramine with melatonin or trazodone.",
    explanationA: "MDD would not cause the constellation of peripheral anticholinergic symptoms (dry mouth, constipation, urinary retention, visual blurring). This is a medication side effect pattern, not a psychiatric relapse.",
    explanationB: "Correct. Four anticholinergic medications in a 78-year-old create cumulative toxicity. Systematic medication review and anticholinergic deprescribing is the priority.",
    explanationC: "While UTI should be checked (standard delirium workup), the symptom pattern perfectly matches anticholinergic toxicity with clear medication causation.",
    explanationD: "The acute onset of confusion with identifiable medication causes should not be attributed to dementia without first addressing reversible factors.",
    examTip: "Anticholinergic mnemonic: 'Hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter.' In elderly patients, calculate total anticholinergic burden using the Anticholinergic Cognitive Burden (ACB) scale. Paroxetine is the SSRI to avoid in the elderly — always check anticholinergic burden.",
    category: "Pharmacology",
    subtopic: "Geriatric polypharmacy",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Identify cumulative anticholinergic burden from multiple medications and implement systematic deprescribing",
    questionType: "advanced",
    clinicalTopic: "geriatric",
    pharmacologyFocus: "adverse_effects,drug_interactions,renal_hepatic",
    bennerBreakdown: "Proficient geriatric prescribers must assess total anticholinergic burden across all medications — not just psychiatric ones. This requires cross-disciplinary medication knowledge (urology, allergy, neurology) and the ability to propose alternatives that maintain therapeutic effect while reducing anticholinergic load."
  },
  // Child/Adolescent - additional
  {
    stem: "A 10-year-old male with autism spectrum disorder and severe irritability/aggression is being evaluated for pharmacotherapy. He headbangs, bites himself, and has injured peers at school despite behavioral interventions. His parents have tried melatonin for sleep (somewhat helpful) but are hesitant about medications. Which medication is FDA-approved specifically for irritability associated with autistic disorder in children and has the strongest evidence base?",
    optionA: "Fluoxetine 10mg for anxiety reduction",
    optionB: "Risperidone, which is FDA-approved for irritability associated with autistic disorder in children aged 5-16",
    optionC: "Methylphenidate for hyperactivity component",
    optionD: "Clonidine for aggression reduction",
    correctAnswer: "B",
    rationale: "Risperidone is one of only two medications FDA-approved for irritability associated with autistic disorder (the other is aripiprazole). Risperidone is approved for children ages 5-16 for this specific indication, with robust evidence from the RUPP (Research Units on Pediatric Psychopharmacology) Autism Network trials showing significant reduction in irritability, aggression, self-injury, and tantrums. Starting dose is typically 0.25mg/day with gradual titration. Monitoring includes: weight/BMI (risperidone causes significant weight gain in children), metabolic labs (glucose, lipids), prolactin, and EPS assessment.",
    explanationA: "Fluoxetine is not FDA-approved for autism-related irritability. SSRIs may help repetitive behaviors in ASD but have not shown robust efficacy for severe irritability/aggression.",
    explanationB: "Correct. Risperidone (ages 5-16) and aripiprazole (ages 6-17) are the ONLY FDA-approved medications for irritability in autistic disorder. Strong evidence from randomized controlled trials.",
    explanationC: "Methylphenidate may help ADHD symptoms comorbid with autism but is not FDA-approved for autism-related irritability. Response rates are lower and side effect sensitivity is higher in ASD populations.",
    explanationD: "Clonidine may be used adjunctively but is not FDA-approved for this indication and has a weaker evidence base than risperidone for autism-related irritability.",
    examTip: "FDA-approved for irritability in autism: Risperidone (5-16 years) and Aripiprazole (6-17 years). Both are second-generation antipsychotics. Key monitoring in pediatric patients: weight gain is dramatic — track height/weight/BMI at every visit.",
    category: "Pharmacology",
    subtopic: "Pediatric neuropsychiatry",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Identify FDA-approved pharmacotherapy for autism-related neurobehavioral symptoms and implement appropriate monitoring",
    questionType: "advanced",
    clinicalTopic: "child_adolescent",
    pharmacologyFocus: "receptor_activity,adverse_effects,moa",
    bennerBreakdown: "Competent prescribers must know the narrow set of FDA-approved treatments for autism-related irritability and distinguish from off-label options. This question tests specific FDA knowledge (age ranges, indications) combined with monitoring requirements that are especially important in pediatric populations."
  },
  // Sleep Disorders - additional
  {
    stem: "A 60-year-old female with chronic insomnia, comorbid MDD (well-controlled on sertraline 150mg), and a BMI of 34 reports difficulty with both sleep onset and sleep maintenance. She previously tried zolpidem (caused next-day sedation) and melatonin (ineffective). She is concerned about weight gain and dependency. Which medication address both sleep onset and maintenance with minimal weight gain and low dependency risk?",
    optionA: "Clonazepam 0.5mg at bedtime",
    optionB: "Low-dose doxepin (6mg) at bedtime, which selectively antagonizes H1 receptors at this dose to improve sleep maintenance with minimal anticholinergic effects",
    optionC: "Mirtazapine 15mg at bedtime for combined antidepressant and sleep effects",
    optionD: "Gabapentin 300mg at bedtime",
    correctAnswer: "B",
    rationale: "Low-dose doxepin (3mg and 6mg — brand name Silenor) is FDA-approved specifically for insomnia characterized by difficulty with sleep maintenance. At these ultra-low doses, doxepin acts as a highly selective histamine H1 antagonist, blocking wake-promoting histaminergic signals. Unlike higher therapeutic doses used as an antidepressant (75-300mg), the 6mg dose has minimal anticholinergic, antinoradrenergic, and serotonergic effects, resulting in no significant weight gain, no dependency risk, and no next-day impairment. It is particularly effective for sleep maintenance insomnia in elderly patients.",
    explanationA: "Clonazepam has high dependency risk (this patient expressed concern), causes next-day sedation, and is classified as a benzodiazepine — generally avoided for chronic insomnia.",
    explanationB: "Correct. Low-dose doxepin (6mg) provides selective H1 antagonism for sleep maintenance with minimal side effects, no dependency, and no weight gain — addressing all of the patient's concerns.",
    explanationC: "Mirtazapine causes significant weight gain (this patient has BMI 34 and expressed weight concern) through H1 and 5-HT2C antagonism. It would also be adding an unnecessary antidepressant to an already-controlled depression.",
    explanationD: "Gabapentin may help sleep but is not FDA-approved for insomnia, has emerging concerns about misuse potential, and would be considered off-label. It is less precisely targeted than low-dose doxepin.",
    examTip: "Low-dose doxepin (3-6mg) ≠ antidepressant-dose doxepin (75-300mg). At ultra-low doses, it is a pure H1 antagonist. This pharmacological selectivity at low dose is a high-yield concept — the same drug can have completely different pharmacological profiles at different doses.",
    category: "Pharmacology",
    subtopic: "Insomnia pharmacotherapy",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Apply dose-dependent pharmacological selectivity to optimize insomnia treatment that addresses patient-specific concerns",
    questionType: "advanced",
    clinicalTopic: "sleep_disorders",
    pharmacologyFocus: "receptor_activity,moa,adverse_effects",
    bennerBreakdown: "Proficient pharmacological reasoning includes understanding that drug selectivity can change dramatically with dose. Low-dose doxepin exemplifies this principle — at 6mg it is purely antihistaminic, while at 150mg it is a potent TCA with multiple receptor effects. This nuanced understanding enables precise prescribing."
  },
  // DSM Diagnosis - additional
  {
    stem: "A 19-year-old female presents with 4 days of elevated mood, decreased need for sleep (3 hours/night yet feeling rested), increased goal-directed activity (started three new business ventures), rapid pressured speech, and grandiosity (believes she will become the youngest billionaire). She has no prior psychiatric history, substance use (confirmed with urine drug screen), or medical conditions. Her symptoms cause significant social/occupational impairment. According to DSM-5-TR, what is the CORRECT diagnosis?",
    optionA: "Bipolar I disorder, current episode manic — because she meets criteria for a manic episode (≥1 week or any duration if hospitalization required)",
    optionB: "Bipolar II disorder, hypomanic episode — because this is her first episode and it has only been 4 days",
    optionC: "Bipolar I disorder, current episode manic — because the episode duration of 4 days with significant impairment meets manic episode criteria since the impairment criterion can substitute for duration",
    optionD: "Cyclothymic disorder — because of the short duration of mood elevation",
    correctAnswer: "A",
    rationale: "DSM-5-TR criteria for a manic episode require: (1) Distinct period of abnormally elevated, expansive, or irritable mood AND increased energy/activity lasting ≥1 week (or ANY duration if hospitalization is necessitated). (2) During the mood disturbance, ≥3 of the following: inflated self-esteem/grandiosity, decreased need for sleep, pressured speech, flight of ideas, distractibility, increased goal-directed activity, excessive involvement in risky activities. (3) Significant impairment or psychotic features. This patient has only 4 days — BUT the significant functional impairment (starting three business ventures — likely financially reckless) and severity of presentation raise the question of whether hospitalization is warranted, which would satisfy the 'any duration' clause. Actually, the correct answer here focuses on a careful reading — the question says 4 days, which is below the 1-week threshold. However, given the functional impairment and severity, if this warrants hospitalization, the duration criterion is met at any length.",
    explanationA: "Correct. If the severity warrants hospitalization (which this degree of impairment and grandiosity likely does), the 1-week minimum is waived to 'any duration.' Bipolar I is diagnosed based on the presence of at least one manic episode.",
    explanationB: "Hypomanic episodes are 4+ days but WITHOUT marked impairment. This patient has significant impairment (starting reckless business ventures), which elevates this from hypomania to mania. Bipolar II would be incorrect — hypomania + impairment = mania.",
    explanationC: "This explanation is partially correct about the outcome but the reasoning is wrong — it's not that impairment substitutes for duration. Rather, severity requiring hospitalization waives the 1-week minimum.",
    explanationD: "Cyclothymic disorder requires subthreshold hypomanic and depressive periods over ≥2 years. This acute severe presentation does not fit cyclothymia.",
    examTip: "Mania vs. hypomania: the KEY differentiator is FUNCTIONAL IMPAIRMENT. Same symptoms, different severity. Mania = marked impairment, hospitalization, or psychosis. Hypomania = change from baseline but no marked impairment. Duration: mania ≥1 week (or any if hospitalized), hypomania ≥4 days.",
    category: "Pathophysiology",
    subtopic: "Bipolar spectrum diagnosis",
    difficulty: "hard",
    bennerStage: "competent",
    clinicalReasoningObj: "Apply DSM-5-TR mania versus hypomania criteria with precise attention to duration and impairment thresholds",
    questionType: "advanced",
    clinicalTopic: "dsm_diagnosis",
    pharmacologyFocus: "",
    bennerBreakdown: "Competent diagnosticians must navigate the nuanced DSM-5-TR duration rules for manic episodes. The 'any duration if hospitalization required' exception is commonly tested and requires clinical judgment about when severity warrants hospitalization — not just memorization of time thresholds."
  },
  // Psychotherapy - additional
  {
    stem: "A PMHNP is providing integrated treatment for a 35-year-old male with PTSD related to military combat. He has been on sertraline 200mg for 16 weeks with modest improvement in hyperarousal but persistent re-experiencing symptoms (intrusive memories, flashbacks, nightmares). He is able to discuss trauma but avoids the most intense memories. Per APA and VA/DoD guidelines, which psychotherapy approach has the STRONGEST evidence for PTSD and should be recommended as the PRIMARY treatment modality?",
    optionA: "Supportive psychotherapy with a focus on building trust and rapport over 12-18 months",
    optionB: "Prolonged Exposure (PE) therapy or Cognitive Processing Therapy (CPT), both of which are strongly recommended trauma-focused psychotherapies with the highest evidence grade for PTSD",
    optionC: "Psychodynamic psychotherapy to explore unconscious conflicts related to combat experiences",
    optionD: "Mindfulness-based stress reduction (MBSR) as monotherapy for combat PTSD",
    correctAnswer: "B",
    rationale: "Both Prolonged Exposure (PE) and Cognitive Processing Therapy (CPT) receive the STRONGEST recommendation (Grade A evidence) from the APA Clinical Practice Guideline and VA/DoD Clinical Practice Guideline for PTSD. PE works through habituation (repeated exposure to trauma memories until distress diminishes) and in-vivo exposure (confronting avoided situations). CPT works through cognitive restructuring of trauma-related 'stuck points' (maladaptive beliefs). Both are typically 12-session protocols. For this patient with persistent re-experiencing symptoms despite optimized pharmacotherapy, trauma-focused psychotherapy is the next essential step.",
    explanationA: "Supportive therapy is not a recommended treatment for PTSD — it does not address the core mechanisms of re-experiencing and avoidance. It may be a component of overall care but should not be the primary intervention.",
    explanationB: "Correct. PE and CPT are the gold-standard psychotherapies for PTSD with the highest level of evidence. VA/DoD guidelines strongly recommend them as first-line treatment alongside or even before pharmacotherapy.",
    explanationC: "Psychodynamic therapy has limited evidence for PTSD treatment. It is not recommended as a primary PTSD intervention by major guidelines.",
    explanationD: "MBSR has some evidence for anxiety and general well-being but is NOT recommended as monotherapy for PTSD. It may be a helpful adjunct but does not constitute trauma-focused treatment.",
    examTip: "PTSD psychotherapy evidence hierarchy: Strongest = PE, CPT (also EMDR). Moderate = Written Exposure Therapy. Psychopharmacology: First-line = sertraline, paroxetine, venlafaxine. The exam expects you to know that trauma-focused therapy is ESSENTIAL for PTSD recovery — medication alone is often insufficient.",
    category: "Physical Assessment",
    subtopic: "Evidence-based psychotherapy",
    difficulty: "hard",
    bennerStage: "proficient",
    clinicalReasoningObj: "Integrate guideline-recommended psychotherapy modalities with pharmacotherapy for comprehensive PTSD treatment",
    questionType: "advanced",
    clinicalTopic: "psychotherapy",
    pharmacologyFocus: "",
    bennerBreakdown: "Proficient integrated treatment requires knowing the evidence hierarchy for PTSD psychotherapies and recognizing when pharmacotherapy optimization has reached its ceiling and trauma-focused therapy must be the next step. The PMHNP must advocate for evidence-based psychotherapy referral as a primary treatment component."
  }
];

const allQuestions = [
  ...coreQuestions,
  ...neuroPnsCnsQuestions,
  ...cardiovascularQuestions,
  ...endocrineQuestions,
  ...digestiveMusculoskeletalUrinaryQuestions,
  ...mensWomensHealthQuestions,
  ...antimicrobialCellWallQuestions,
  ...antidepressantMoaQuestions,
  ...anxiolyticAntipsychoticQuestions,
  ...additionalFnpPaQuestions,
  ...generatedBookSystemQuestions,
];

// Deduplicate by stem (keep first occurrence)
const seen = new Set();
const questions = allQuestions.filter(q => {
  if (seen.has(q.stem)) return false;
  seen.add(q.stem);
  return true;
});
console.log(`${allQuestions.length} total → ${questions.length} unique (${allQuestions.length - questions.length} duplicates removed)`);

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pmhnpprep.com' },
    update: {},
    create: {
      email: 'admin@pmhnpprep.com',
      passwordHash: adminHash,
      name: 'Admin User',
      role: 'admin',
      tier: 'premium'
    }
  });
  console.log(`Created admin: ${admin.email}`);

  // Create demo student
  const studentHash = await bcrypt.hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@pmhnpprep.com' },
    update: {},
    create: {
      email: 'student@pmhnpprep.com',
      passwordHash: studentHash,
      name: 'Demo Student',
      role: 'student',
      tier: 'premium'
    }
  });
  console.log(`Created student: ${student.email}`);

  // Seed questions (clear existing, then insert fresh)
  await prisma.quizAnswer.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.note.deleteMany();
  await prisma.question.deleteMany();
  console.log('Cleared existing questions');

  let seeded = 0;
  for (const q of questions) {
    await prisma.question.create({ data: q });
    seeded++;
  }
  console.log(`Seeded ${seeded} questions`);

  // Create sample progress for demo student
  const stages = ['novice', 'advanced_beginner', 'competent', 'proficient', 'expert'];
  const categories = ['Pathophysiology', 'Pharmacology', 'Physical Assessment', 'Pharmacology_Systems'];
  for (const cat of categories) {
    for (const stage of stages) {
      await prisma.userProgress.upsert({
        where: { userId_category_bennerStage: { userId: student.id, category: cat, bennerStage: stage } },
        update: {},
        create: {
          userId: student.id,
          category: cat,
          bennerStage: stage,
          totalAnswered: Math.floor(Math.random() * 20) + 5,
          totalCorrect: Math.floor(Math.random() * 15) + 3
        }
      });
    }
  }
  console.log('Created sample progress data');

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
