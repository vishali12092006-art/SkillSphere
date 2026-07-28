import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox, Send, CheckCircle, XCircle, Clock, ChevronRight,
  MessageSquare, BookOpen, ArrowRight, Filter,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { requestService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { timeAgo, statusConfig, getErrorMessage } from '../utils/helpers';

const RequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('received');
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Detail modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await requestService.getRequests();
      setRequests(res.data.requests);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const received = requests.filter((r) => r.receiver?._id === user._id);
  const sent = requests.filter((r) => r.sender?._id === user._id);

  const current = tab === 'received' ? received : sent;

  const handleAccept = async (reqId) => {
    setActionLoading(reqId);
    setError('');
    try {
      await requestService.acceptRequest(reqId);
      setSuccessMsg('Request accepted! A session has been created.');
      setModalOpen(false);
      fetchRequests();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reqId) => {
    setActionLoading(reqId + '_reject');
    setError('');
    try {
      await requestService.rejectRequest(reqId);
      setSuccessMsg('Request declined.');
      setModalOpen(false);
      fetchRequests();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const openDetail = (req) => {
    setSelectedRequest(req);
    setError('');
    setModalOpen(true);
  };

  const pendingCount = received.filter((r) => r.status === 'pending').length;

  return (
    <Layout>
      <div className="page">
        <div className="container" style={{ maxWidth: 800 }}>
          {/* Page Header */}
          <div className="page-header">
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>
              <Inbox size={12} /> Match Requests
            </div>
            <h1 className="page-title">
              Skill Requests
              {pendingCount > 0 && (
                <span
                  className="badge badge-warning"
                  style={{ marginLeft: '0.75rem', verticalAlign: 'middle', fontSize: '0.875rem' }}
                >
                  {pendingCount} pending
                </span>
              )}
            </h1>
            <p className="page-subtitle">Manage your incoming and outgoing skill exchange requests.</p>
          </div>

          {/* Alert Messages */}
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
            <button
              className={`tab-btn ${tab === 'received' ? 'active' : ''}`}
              onClick={() => setTab('received')}
              id="tab-received"
            >
              <Inbox size={14} style={{ display: 'inline', marginRight: 6 }} />
              Received
              {received.length > 0 && (
                <span className="badge badge-neutral" style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                  {received.length}
                </span>
              )}
            </button>
            <button
              className={`tab-btn ${tab === 'sent' ? 'active' : ''}`}
              onClick={() => setTab('sent')}
              id="tab-sent"
            >
              <Send size={14} style={{ display: 'inline', marginRight: 6 }} />
              Sent
              {sent.length > 0 && (
                <span className="badge badge-neutral" style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                  {sent.length}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <PageSpinner />
          ) : current.length === 0 ? (
            <EmptyState
              icon={tab === 'received' ? Inbox : Send}
              title={tab === 'received' ? 'No requests received' : 'No requests sent'}
              description={
                tab === 'received'
                  ? 'When someone wants to learn a skill you teach, their request will appear here.'
                  : 'Browse skills and send a request to start a skill exchange.'
              }
              action={
                tab === 'sent' && (
                  <Link to="/explore">
                    <button className="btn btn-primary btn-sm">
                      Explore Skills <ArrowRight size={14} />
                    </button>
                  </Link>
                )
              }
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {current.map((req) => {
                const isReceiver = req.receiver?._id === user._id;
                const otherUser = isReceiver ? req.sender : req.receiver;
                const cfg = statusConfig[req.status] || { label: req.status, className: 'badge-neutral' };
                return (
                  <div
                    key={req._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      transition: 'box-shadow 0.15s',
                      cursor: 'pointer',
                      borderLeft: req.status === 'pending' ? '3px solid var(--color-warning)' : '3px solid var(--color-border)',
                    }}
                    onClick={() => openDetail(req)}
                    id={`request-${req._id}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Link
                        to={`/profile/${otherUser?._id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Avatar user={otherUser} size="md" />
                      </Link>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                              {otherUser?.name}
                            </span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                              {timeAgo(req.createdAt)}
                            </span>
                          </div>
                          <span className={`badge ${cfg.className}`}>{cfg.label}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                          <BookOpen size={13} color="var(--color-primary)" />
                          <span style={{ fontSize: '0.875rem' }}>
                            {isReceiver ? 'Wants to learn' : 'You requested'}:{' '}
                            <strong>{req.skillRequested}</strong>
                          </span>
                        </div>

                        {req.message && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                            <MessageSquare size={12} style={{ marginTop: 2, flexShrink: 0 }} />
                            <span style={{
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                            }}>
                              {req.message}
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0, marginLeft: '0.5rem' }}>
                        {isReceiver && req.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={(e) => { e.stopPropagation(); handleAccept(req._id); }}
                              disabled={actionLoading === req._id}
                              id={`accept-${req._id}`}
                            >
                              {actionLoading === req._id ? '...' : <><CheckCircle size={14} /> Accept</>}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={(e) => { e.stopPropagation(); handleReject(req._id); }}
                              disabled={actionLoading === req._id + '_reject'}
                              id={`reject-${req._id}`}
                            >
                              {actionLoading === req._id + '_reject' ? '...' : <><XCircle size={14} /> Decline</>}
                            </button>
                          </>
                        )}
                        <ChevronRight size={16} color="var(--color-text-muted)" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Request Details"
          footer={
            selectedRequest.receiver?._id === user._id && selectedRequest.status === 'pending' && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  loading={actionLoading === selectedRequest._id + '_reject'}
                  onClick={() => handleReject(selectedRequest._id)}
                >
                  <XCircle size={14} /> Decline
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={actionLoading === selectedRequest._id}
                  onClick={() => handleAccept(selectedRequest._id)}
                >
                  <CheckCircle size={14} /> Accept Request
                </Button>
              </>
            )
          }
        >
          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* User info */}
            <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <Avatar user={selectedRequest.receiver?._id === user._id ? selectedRequest.sender : selectedRequest.receiver} size="lg" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                  {(selectedRequest.receiver?._id === user._id ? selectedRequest.sender : selectedRequest.receiver)?.name}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  {timeAgo(selectedRequest.createdAt)}
                </div>
              </div>
              <span
                className={`badge ${statusConfig[selectedRequest.status]?.className || 'badge-neutral'}`}
                style={{ marginLeft: 'auto' }}
              >
                {statusConfig[selectedRequest.status]?.label || selectedRequest.status}
              </span>
            </div>

            {/* Skill */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9375rem' }}>
              <BookOpen size={16} color="var(--color-primary)" />
              <span>Skill requested: <strong>{selectedRequest.skillRequested}</strong></span>
            </div>

            {/* Message */}
            {selectedRequest.message && (
              <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Message
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
                  {selectedRequest.message}
                </p>
              </div>
            )}

            {/* View profile */}
            <Link
              to={`/profile/${(selectedRequest.receiver?._id === user._id ? selectedRequest.sender : selectedRequest.receiver)?._id}`}
              onClick={() => setModalOpen(false)}
            >
              <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                View Profile <ChevronRight size={14} />
              </button>
            </Link>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default RequestsPage;
