import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star, BookOpen, Lightbulb, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import EmptyState from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import { userService } from '../services/api';
import { SKILL_CATEGORIES } from '../utils/helpers';

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat !== null && paramCat !== category) {
      setCategory(paramCat);
    }
  }, [searchParams, category]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debounced, category]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (debounced) params.skill = debounced;
      if (category) params.category = category;

      const res = await userService.searchUsers(params);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [debounced, category, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  const hasFilters = search || category;

  return (
    <Layout>
      <div className="page">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>
              <Search size={12} /> Skill Explorer
            </div>
            <h1 className="page-title">Find Your Perfect Match</h1>
            <p className="page-subtitle">Browse talented people ready to teach and learn alongside you.</p>
          </div>

          {/* Search & Filters */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {/* Search input */}
              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <label className="form-label" style={{ marginBottom: '0.375rem', display: 'block' }}>
                  Search by skill
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <input
                    id="explore-search"
                    type="text"
                    className="form-input"
                    placeholder="e.g. React, Guitar, Spanish..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>

              {/* Category filter */}
              <div style={{ minWidth: 180 }}>
                <label className="form-label" style={{ marginBottom: '0.375rem', display: 'block' }}>
                  <Filter size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Category
                </label>
                <select
                  id="explore-category"
                  className="form-input form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {SKILL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {hasFilters && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={clearFilters}
                  style={{ alignSelf: 'flex-end', marginBottom: '0px' }}
                >
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Results info */}
          {!loading && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {pagination.total > 0
                  ? `Showing ${users.length} of ${pagination.total} members`
                  : 'No members found'}
              </p>
            </div>
          )}

          {/* User Grid */}
          {loading ? (
            <PageSpinner />
          ) : users.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No members found"
              description={hasFilters ? 'Try adjusting your search or removing filters.' : 'No users have joined yet. Be the first!'}
              action={hasFilters ? <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear Filters</button> : null}
            />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {users.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === pagination.pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const UserCard = ({ user }) => (
  <Link to={`/profile/${user._id}`} style={{ textDecoration: 'none' }}>
    <div className="card card-hover" style={{ height: '100%' }}>
      {/* Top section */}
      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <Avatar user={user} size="lg" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name}
          </div>
          {user.city && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
              <MapPin size={12} /> {user.city}
            </div>
          )}
          <Rating value={user.averageRating} showCount count={user.reviewCount} size={12} />
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {user.bio}
        </p>
      )}

      {/* Skills Teaching */}
      {user.skillsTeach?.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
            <BookOpen size={11} /> Can Teach
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {user.skillsTeach.slice(0, 3).map((s) => (
              <span key={s._id} className="skill-tag skill-tag-teach">{s.name}</span>
            ))}
            {user.skillsTeach.length > 3 && (
              <span className="badge badge-neutral">+{user.skillsTeach.length - 3}</span>
            )}
          </div>
        </div>
      )}

      {/* Skills Learning */}
      {user.skillsLearn?.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '0.4rem' }}>
            <Lightbulb size={11} /> Wants to Learn
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {user.skillsLearn.slice(0, 3).map((s) => (
              <span key={s._id} className="skill-tag skill-tag-learn">{s.name}</span>
            ))}
            {user.skillsLearn.length > 3 && (
              <span className="badge badge-neutral">+{user.skillsLearn.length - 3}</span>
            )}
          </div>
        </div>
      )}
    </div>
  </Link>
);

export default ExplorePage;
