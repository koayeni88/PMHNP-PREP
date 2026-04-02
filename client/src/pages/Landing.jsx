import { Link } from 'react-router-dom';
import { BENNER_STAGES, CATEGORIES } from '../utils/constants.js';

const STAGE_COLORS = {
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-600 dark:text-sky-400' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-cyan-700" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-8 backdrop-blur">
              ✨ Built on Benner's Clinical Competence Framework
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
              Master PMHNP Certification with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                Clinical Reasoning
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Go beyond memorization. Develop expert-level psychiatric clinical decision-making through
              Pathophysiology, Pharmacology, and Physical Assessment — the 3 Ps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register"
                className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xl text-lg">
                Start Free Trial
              </Link>
              <a href="#features"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur text-lg">
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Ps Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">The 3 Ps of PMHNP Preparation</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Comprehensive coverage across all certification domains</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {CATEGORIES.map((cat) => (
              <div key={cat.key} className="card text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.label}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {cat.key === 'Pathophysiology' && 'Neural circuits, neurotransmitter systems, disease mechanisms, and neurobiological foundations of psychiatric disorders.'}
                  {cat.key === 'Pharmacology' && 'Psychotropic medications, mechanisms of action, drug interactions, dosing strategies, and evidence-based prescribing.'}
                  {cat.key === 'Physical Assessment' && 'Mental status examination, psychiatric evaluation, screening tools, and medical differential diagnosis.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benner Framework */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Benner's Clinical Competence Ladder
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Progress from foundational knowledge to expert-level clinical reasoning through structured learning stages
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {BENNER_STAGES.map((stage, i) => (
              <div key={stage.key} className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${STAGE_COLORS[stage.color]?.bg || ''} 
                    flex items-center justify-center ${STAGE_COLORS[stage.color]?.text || ''} font-bold`}>
                    {i + 1}
                  </div>
                  {i < BENNER_STAGES.length - 1 && <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 mt-2" />}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{stage.label}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need to Pass</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📚', title: 'Searchable Question Bank', desc: 'Filter by category, Benner stage, subtopic, and difficulty' },
              { icon: '⏱️', title: 'Timed & Untimed Quizzes', desc: 'Practice at your pace or simulate exam conditions' },
              { icon: '🎯', title: 'Mock Exam Simulator', desc: '150 questions, 3.5 hours — just like the real ANCC exam' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Track accuracy by category and Benner stage over time' },
              { icon: '🔖', title: 'Bookmarks & Notes', desc: 'Save questions and add personal study notes' },
              { icon: '🧗', title: 'Progression Map', desc: 'Visual ladder showing your climb from novice to expert' },
              { icon: '💡', title: 'Detailed Rationales', desc: 'Every answer explained — right and wrong options' },
              { icon: '🎓', title: 'Exam Tips', desc: 'High-yield clinical pearls for every question' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Study anywhere on any device' }
            ].map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-blue-100 text-lg mb-8">Start with novice-level questions and progress to expert clinical reasoning.</p>
          <Link to="/register"
            className="inline-block px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xl text-lg">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg text-white">PMHNP Prep</span>
          </div>
          <p className="text-sm">Clinical Reasoning Development Platform</p>
          <p className="text-sm mt-2">© 2026 PMHNP Prep. Designed for ANCC/AACN certification preparation.</p>
        </div>
      </footer>
    </div>
  );
}
