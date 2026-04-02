import { useParams, Link, useNavigate } from 'react-router-dom';
import { BENNER_STAGES } from '../utils/constants.js';
import { api } from '../utils/api.js';
import { useState } from 'react';

export default function BennerStudy() {
  const { stage } = useParams();
  const navigate = useNavigate();
  const stageInfo = BENNER_STAGES.find(s => s.key === stage);
  const stageIndex = BENNER_STAGES.findIndex(s => s.key === stage);
  const [loading, setLoading] = useState(false);

  const startQuiz = async (mode) => {
    setLoading(true);
    try {
      const data = await api.createQuiz({
        mode,
        bennerStage: stage,
        questionCount: 20,
        timeLimit: mode === 'timed' ? 1800 : undefined
      });
      navigate(`/quiz/${data.attemptId}?quizId=${data.quizId}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!stageInfo) return <div className="p-8 text-center text-gray-500">Invalid Benner stage</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Stage Header */}
      <div className="card mb-8 bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            Stage {stageIndex + 1} of {BENNER_STAGES.length}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stageInfo.label}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">{stageInfo.description}</p>
      </div>

      {/* Stage Description */}
      <div className="card mb-8">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">What to Expect at This Stage</h2>
        {stage === 'novice' && (
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>Questions focus on single facts, definitions, and direct recall</li>
            <li>Identifying correct neurotransmitters, brain structures, and drug mechanisms</li>
            <li>Recognizing key terms and classification of disorders</li>
            <li>No complex clinical scenarios — just foundational knowledge</li>
          </ul>
        )}
        {stage === 'advanced_beginner' && (
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>Simple patient vignettes with straightforward presentations</li>
            <li>Matching symptoms to disorders and treatments</li>
            <li>Basic pattern recognition in clinical scenarios</li>
            <li>Connecting pathophysiology to clinical findings</li>
          </ul>
        )}
        {stage === 'competent' && (
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>Clinical prioritization and "what would you do first?" questions</li>
            <li>Differential diagnosis thinking — distinguishing between similar presentations</li>
            <li>Management planning with consideration of comorbidities</li>
            <li>Applying guidelines to specific patient contexts</li>
          </ul>
        )}
        {stage === 'proficient' && (
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>Complex multi-system case interpretations</li>
            <li>Nuanced medication decisions balancing efficacy and safety</li>
            <li>Recognizing when physical findings change the psychiatric approach</li>
            <li>Integrating lab values and vital signs into clinical reasoning</li>
          </ul>
        )}
        {stage === 'expert' && (
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>Highly integrated reasoning across multiple domains simultaneously</li>
            <li>Subtle distinctions between similar management approaches</li>
            <li>Triple comorbidity management and competing treatment considerations</li>
            <li>Advanced pathophysiology informing novel treatment decisions</li>
          </ul>
        )}
      </div>

      {/* Study Actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <button onClick={() => startQuiz('practice')} disabled={loading}
          className="card hover:shadow-md transition-shadow text-center cursor-pointer disabled:opacity-50">
          <div className="text-3xl mb-2">📖</div>
          <h3 className="font-bold text-gray-900 dark:text-white">Practice Mode</h3>
          <p className="text-sm text-gray-500">Untimed · See rationales instantly</p>
        </button>
        <button onClick={() => startQuiz('timed')} disabled={loading}
          className="card hover:shadow-md transition-shadow text-center cursor-pointer disabled:opacity-50">
          <div className="text-3xl mb-2">⏱️</div>
          <h3 className="font-bold text-gray-900 dark:text-white">Timed Mode</h3>
          <p className="text-sm text-gray-500">30 minutes · 20 questions</p>
        </button>
      </div>

      {/* Stage Navigation */}
      <div className="flex justify-between">
        {stageIndex > 0 ? (
          <Link to={`/study/benner/${BENNER_STAGES[stageIndex - 1].key}`} className="btn-secondary">
            ← {BENNER_STAGES[stageIndex - 1].label}
          </Link>
        ) : <div />}
        {stageIndex < BENNER_STAGES.length - 1 ? (
          <Link to={`/study/benner/${BENNER_STAGES[stageIndex + 1].key}`} className="btn-primary">
            {BENNER_STAGES[stageIndex + 1].label} →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
