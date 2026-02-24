import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

const categories = ['ALL', 'MENTAL', 'FITNESS', 'NUTRITION'];

function Resources() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchResources = async () => {
      setLoading(true);
      setError('');

      try {
        const params = activeCategory === 'ALL' ? {} : { category: activeCategory };
        const response = await api.get('/resources', { params });
        const data = response.data?.data || response.data || [];

        if (mounted) {
          setResources(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.response?.data?.message || 'Unable to load resources.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchResources();

    return () => {
      mounted = false;
    };
  }, [activeCategory]);

  const emptyLabel = useMemo(() => {
    if (activeCategory === 'ALL') {
      return 'No resources available yet.';
    }

    return `No ${activeCategory.toLowerCase()} resources found.`;
  }, [activeCategory]);

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1 className="page-title">Resources</h1>
        <p className="page-subtitle">Browse mental, fitness, and nutrition support resources.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === category
                ? 'tab-pill tab-pill-active'
                : 'tab-pill'
            }`}
          >
            {category === 'ALL' ? 'All' : category}
          </button>
        ))}
      </div>

      {error ? <p className="state-error">{error}</p> : null}

      {loading ? <p className="state-info">Loading resources...</p> : null}

      {!loading && resources.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">{emptyLabel}</p>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.id || resource._id || resource.title} title={resource.title || 'Resource'}>
            <p className="text-sm text-slate-600">{resource.description || 'No description provided.'}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="soft-badge">
                {(resource.category || activeCategory).toString().toUpperCase()}
              </span>
              {resource.url ? (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-brand-600 hover:text-brand-500"
                >
                  Open
                </a>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Resources;
