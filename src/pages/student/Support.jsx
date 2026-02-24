import { useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import api from '../../services/api';

const concernCards = [
  {
    title: 'Stress & Anxiety',
    description: 'Guided techniques for calming your mind and reducing pressure.',
  },
  {
    title: 'Academic Pressure',
    description: 'Study balance support for deadlines, workload, and burnout.',
  },
  {
    title: 'Sleep & Burnout',
    description: 'Practical routines to improve sleep and recover energy.',
  },
  {
    title: 'Talk to a Counselor',
    description: 'Connect with support staff for confidential one-on-one help.',
  },
];

const supportOptions = [
  {
    title: 'One-on-One Counseling',
    description: 'Private support session with a counselor.',
    cta: 'Talk to Someone',
  },
  {
    title: 'Academic Support',
    description: 'Stress management for assignments and exams.',
    cta: 'Explore Resources',
  },
  {
    title: 'Sleep Recovery',
    description: 'Burnout-focused sleep and energy recovery tips.',
    cta: 'Book Appointment',
  },
  {
    title: 'Emergency Support',
    description: 'Immediate guidance when you need urgent help.',
    cta: 'Book Appointment',
  },
];

const resourceTabs = ['Articles', 'Videos', 'Meditations', 'Exercises'];

const resourceCards = {
  Articles: [
    { title: '5 Tips for Managing Anxiety', meta: '3 min read' },
    { title: 'How to Reset During Exam Week', meta: '4 min read' },
  ],
  Videos: [
    { title: '10-Minute Guided Breathing', meta: '10 min video' },
    { title: 'Desk Stretch for Stress Relief', meta: '6 min video' },
  ],
  Meditations: [
    { title: 'Calm Before Sleep', meta: '8 min session' },
    { title: 'Morning Focus Meditation', meta: '7 min session' },
  ],
  Exercises: [
    { title: 'Grounding Exercise 5-4-3-2-1', meta: '5 min practice' },
    { title: 'Body Scan for Burnout', meta: '6 min practice' },
  ],
};

function Support() {
  const [activeTab, setActiveTab] = useState('Articles');
  const [form, setForm] = useState({
    subject: '',
    category: 'GENERAL',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/support-requests', form);
      setSuccess('Your request has been submitted. Our team will contact you soon.');
      setForm({ subject: '', category: 'GENERAL', message: '' });
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to submit your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-brand-50 to-white p-6">
        <h1 className="text-3xl font-semibold text-slate-800">You&apos;re not alone.</h1>
        <p className="mt-1 text-2xl text-slate-700">Support is always here.</p>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Whatever you&apos;re going through, this space helps you find resources and request support quickly.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="#support-form"
            className="rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Talk to Someone
          </a>
          <a
            href="#helpful-resources"
            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Explore Resources
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {concernCards.map((card) => (
          <Card key={card.title} title={card.title}>
            <p className="text-sm text-slate-600">{card.description}</p>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-center text-3xl font-semibold text-slate-800">Find Support That Fits Your Needs</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {supportOptions.map((option) => (
            <Card key={option.title} title={option.title}>
              <p className="mb-4 text-sm text-slate-600">{option.description}</p>
              <button className="rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700">
                {option.cta}
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section id="helpful-resources" className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-3xl font-semibold text-slate-800">Explore Helpful Resources</h2>
        <div className="mt-4 inline-flex rounded-full border border-slate-300 p-1">
          {resourceTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {resourceCards[activeTab].map((resource) => (
            <div key={resource.title} className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800">{resource.title}</h3>
              <p className="mt-2 text-xs text-slate-500">{resource.meta}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="support-form">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Request Personal Support</h2>
          <p className="mt-1 text-sm text-slate-600">Submit this form and our team will follow up soon.</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-700">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring"
                placeholder="Brief title for your request"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring"
              >
                <option value="GENERAL">General</option>
                <option value="MENTAL">Mental Health</option>
                <option value="FITNESS">Fitness</option>
                <option value="NUTRITION">Nutrition</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring"
                placeholder="Describe your issue or request"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}

export default Support;
