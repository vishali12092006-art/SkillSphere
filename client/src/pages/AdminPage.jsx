import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield, Users, Inbox, Calendar, Star, CheckCircle, Trash2, Search, RefreshCw, AlertCircle
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import EmptyState from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { adminService } from '../services/api';
import { formatDate, getErrorMessage } from '../utils/helpers';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ page, limit: 10, search: debouncedSearch }),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setPagination(usersRes.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(selectedUser._id);
    setError('');
    setSuccess('');
    try {
      await adminService.deleteUser(selectedUser._id);
      setSuccess(`User ${selectedUser.name} deleted successfully.`);
      setDeleteModal(false);
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = (u) => {
    setSelectedUser(u);
    setDeleteModal(true);
  };

  return (
    <Layout>
      <div className="page">
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '0.5rem', background: 'rgba(220, 38, 38, 0.1)', color: 'var(--color-error)', borderColor: 'rgba(220, 38, 38, 0.2)' }}>
                <Shield size={12} /> Admin Control Center
              </div>
              <h1 className="page-title">Platform Administration</h1>
              <p className="page-subtitle">Monitor community activity and manage registered users.</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={fetchData} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spinner-sm' : ''} /> Refresh Data
            </button>
          </div>

          {/* Feedback messages */}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              <CheckCircle size={16} /> {success}
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Stats Overview Grid */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'var(--color-primary)' },
                { label: 'Match Requests', value: stats.totalRequests, icon: Inbox, color: '#D97706' },
                { label: 'Accepted Matches', value: stats.acceptedRequests, icon: CheckCircle, color: 'var(--color-success)' },
                { label: 'Total Sessions', value: stats.totalSessions, icon: Calendar, color: '#3B82F6' },
                { label: 'Completed Sessions', value: stats.completedSessions, icon: CheckCircle, color: 'var(--color-primary-dark)' },
                { label: 'Total Reviews', value: stats.totalReviews, icon: Star, color: '#F59E0B' },
              ].map((stat) => (
                <div key={stat.label} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <stat.icon size={18} color={stat.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* User Management Section */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>User Management</h2>

              {/* Search user */}
              <div style={{ position: 'relative', width: 280 }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {loading ? (
              <PageSpinner />
            ) : users.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No users found"
                description={debouncedSearch ? 'No users matching your search.' : 'No registered users on the platform.'}
              />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>User</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Skills (Teach/Learn)</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Rating</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Joined</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Avatar user={u} size="sm" />
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{u.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span className={`badge ${u.role === 'admin' ? 'badge-error' : 'badge-neutral'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span className="badge badge-primary" style={{ marginRight: '0.375rem' }}>
                            {u.skillsTeach?.length || 0} Teach
                          </span>
                          <span className="badge badge-accent">
                            {u.skillsLearn?.length || 0} Learn
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <Rating value={u.averageRating} showCount count={u.reviewCount} size={12} />
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                          {formatDate(u.createdAt)}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                          {u.role !== 'admin' && (
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.3rem 0.625rem' }}
                              onClick={() => confirmDelete(u)}
                              title="Delete user"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete User Modal */}
      {selectedUser && (
        <Modal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          title="Confirm Delete User"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setDeleteModal(false)}>Cancel</Button>
              <Button
                variant="danger"
                size="sm"
                loading={actionLoading === selectedUser._id}
                onClick={handleDeleteUser}
              >
                <Trash2 size={14} /> Permanently Delete
              </Button>
            </>
          }
        >
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
            Are you sure you want to delete user <strong>{selectedUser.name}</strong> ({selectedUser.email})?
            This action cannot be undone.
          </p>
        </Modal>
      )}
    </Layout>
  );
};

export default AdminPage;
