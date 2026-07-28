import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CheckCircle, XCircle, ExternalLink, Clock,
  Video, Star, ChevronRight, BookOpen, Filter,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Rating from '../components/ui/Rating';
import { sessionService, reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, statusConfig, getErrorMessage } from '../utils/helpers';

const SessionsPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit session modal
  const [editModal, setEditModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [sessionDate, setSessionDate] = useState('');

  // Review modal
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewSession, setReviewSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sessionService.getSessions();
      setSessions(res.data.sessions);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const upcoming = sessions.filter((s) => s.status === 'upcoming');
  const completed = sessions.filter((s) => s.status === 'completed');
  const cancelled = sessions.filter((s) => s.status === 'cancelled');

  const current = tab === 'upcoming' ? upcoming : tab === 'completed' ? completed : cancelled;

  const handleComplete = async (sessionId) => {
    setActionLoading(sessionId + '_complete');
    setError('');
    try {
      await sessionService.completeSession(sessionId);
      setSuccessMsg('Session marked as completed!');
      fetchSessions();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (sessionId) => {
    setActionLoading(sessionId + '_cancel');
    setError('');
    try {
      await sessionService.cancelSession(sessionId);
      setSuccessMsg('Session cancelled.');
      fetchSessions();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (sess) => {
    setSelectedSession(sess);
    setMeetingLink(sess.meetingLink || '');
    setSessionDate(sess.date ? new Date(sess.date).toISOString().slice(0, 16) : '');
    setError('');
    setEditModal(true);
  };

  const handleSaveSession = async () => {
    setActionLoading('save');
    setError('');
    try {
      await sessionService.updateSession(selectedSession._id, {
        meetingLink,
        date: sessionDate ? new Date(sessionDate).toISOString() : undefined,
      });
      setSuccessMsg('Session details updated!');
      setEditModal(false);
      fetchSessions();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const openReviewModal = (sess) => {
    setReviewSession(sess);
    setRating(5);
    setComment('');
    setError('');
    setReviewModal(true);
  };

  const handleSubmitReview = async () => {
    setReviewLoading(true);
    setError('');
    try {
      const otherUser = reviewSession.requester?._id === user._id
        ? reviewSession.receiver
        : reviewSession.requester;
      await reviewService.addReview({
        revieweeId: otherUser._id,
        sessionId: reviewSession._id,
        rating,
        comment,
      });
      setSuccessMsg('Review submitted! Thank you for your feedback.');
      setReviewModal(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page">
        <div className="container" style={{ maxWidth: 800 }}>
          {/* Page Header */}
          <div className="page-header">
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>
              <Calendar size={12} /> Sessions
            </div>
            <h1 className="page-title">
              My Sessions
              {upcoming.length > 0 && (
                <span
                  className="badge badge-success"
                  style={{ marginLeft: '0.75rem', verticalAlign: 'middle', fontSize: '0.875rem' }}
                >
                  {upcoming.length} upcoming
                </span>
              )}
            </h1>
            <p className="page-subtitle">Track and manage your skill exchange sessions.</p>
          </div>

          {/* Alerts */}
          {successMsg && (
            <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
              <CheckCircle size={16} />
              <span>{successMsg}</span>
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <XCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs">
            {[
              { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
              { id: 'completed', label: 'Completed', count: completed.length },
              { id: 'cancelled', label: 'Cancelled', count: cancelled.length },
            ].map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
                id={`tab-${t.id}`}
              >
                {t.label}
                {t.count > 0 && (
                  <span
                    className="badge badge-neutral"
                    style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <PageSpinner />
          ) : current.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title={`No ${tab} sessions`}
              description={
                tab === 'upcoming'
                  ? 'Accept skill requests to schedule sessions with other members.'
                  : tab === 'completed'
                  ? 'Completed sessions will appear here.'
                  : 'Cancelled sessions will appear here.'
              }
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {current.map((sess) => {
                const otherUser = sess.requester?._id === user._id ? sess.receiver : sess.requester;
                const cfg = statusConfig[sess.status] || { label: sess.status, className: 'badge-neutral' };
                return (
                  <div
                    key={sess._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      borderLeft: sess.status === 'upcoming'
                        ? '3px solid var(--color-success)'
                        : sess.status === 'completed'
                        ? '3px solid var(--color-primary)'
                        : '3px solid var(--color-border)',
                    }}
                    id={`session-${sess._id}`}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <Link to={`/profile/${otherUser?._id}`}>
                        <Avatar user={otherUser} size="md" />
                      </Link>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{otherUser?.name}</span>
                          <span className={`badge ${cfg.className}`}>{cfg.label}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
                          <BookOpen size={13} color="var(--color-primary)" />
                          <span style={{ color: 'var(--color-text-secondary)' }}>
                            Skill: <strong style={{ color: 'var(--color-text)' }}>{sess.skill || sess.matchRequest?.skillRequested}</strong>
                          </span>
                        </div>

                        {sess.date && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
                            <Clock size={13} />
                            {formatDateTime(sess.date)}
                          </div>
                        )}

                        {sess.meetingLink && (
                          <a
                            href={sess.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 500, marginBottom: '0.5rem' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Video size={13} /> Join Meeting <ExternalLink size={11} />
                          </a>
                        )}

                        {/* Actions */}
                        {sess.status === 'upcoming' && (
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => openEditModal(sess)}
                              id={`edit-session-${sess._id}`}
                            >
                              <Clock size={13} /> Set Details
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleComplete(sess._id)}
                              disabled={actionLoading === sess._id + '_complete'}
                              id={`complete-session-${sess._id}`}
                            >
                              <CheckCircle size={13} />
                              {actionLoading === sess._id + '_complete' ? 'Saving...' : 'Mark Complete'}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleCancel(sess._id)}
                              disabled={actionLoading === sess._id + '_cancel'}
                              id={`cancel-session-${sess._id}`}
                            >
                              <XCircle size={13} />
                              {actionLoading === sess._id + '_cancel' ? '...' : 'Cancel'}
                            </button>
                          </div>
                        )}

                        {sess.status === 'completed' && (
                          <button
                            className="btn btn-accent btn-sm"
                            style={{ marginTop: '0.75rem' }}
                            onClick={() => openReviewModal(sess)}
                            id={`review-session-${sess._id}`}
                          >
                            <Star size={13} /> Leave a Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Session Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Update Session Details"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              loading={actionLoading === 'save'}
              onClick={handleSaveSession}
              id="save-session-btn"
            >
              <CheckCircle size={14} /> Save Changes
            </Button>
          </>
        }
      >
        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Session Date & Time</label>
            <input
              type="datetime-local"
              className="form-input"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              id="session-date-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <Video size={14} style={{ display: 'inline', marginRight: 6 }} />
              Meeting Link
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="https://meet.google.com/xxx-yyy-zzz"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              id="session-link-input"
            />
            <span className="text-xs text-muted">Zoom, Google Meet, Teams, or any video call link</span>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModal}
        onClose={() => setReviewModal(false)}
        title={`Review ${reviewSession ? (reviewSession.requester?._id === user._id ? reviewSession.receiver?.name : reviewSession.requester?.name) : ''}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setReviewModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              loading={reviewLoading}
              onClick={handleSubmitReview}
              id="submit-review-btn"
            >
              <Star size={14} /> Submit Review
            </Button>
          </>
        }
      >
        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
              Rating *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: '1.75rem',
                    color: star <= rating ? '#F59E0B' : 'var(--color-border)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.1s, color 0.1s',
                    transform: star <= rating ? 'scale(1.1)' : 'scale(1)',
                  }}
                  id={`star-${star}`}
                >
                  ★
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Comment (optional)</label>
            <textarea
              className="form-input form-textarea"
              rows={4}
              placeholder="Share your experience with this skill exchange..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              id="review-comment"
            />
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default SessionsPage;
