import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, BookOpen, Lightbulb, Clock, BarChart2, MessageSquare, Send, ArrowLeft,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import { userService, reviewService, requestService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, timeAgo, getErrorMessage } from '../utils/helpers';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('teach');

  // Request modal
  const [requestModal, setRequestModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          userService.getProfile(id),
          reviewService.getReviews(id),
        ]);
        setProfile(profileRes.data.user);
        setReviews(reviewsRes.data.reviews);
      } catch {
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSendRequest = async () => {
    if (!selectedSkill) { setRequestError('Please select a skill'); return; }
    setRequestLoading(true);
    setRequestError('');
    try {
      await requestService.sendRequest({
        receiverId: id,
        skillRequested: selectedSkill,
        message,
      });
      setRequestSuccess(true);
    } catch (err) {
      setRequestError(getErrorMessage(err));
    } finally {
      setRequestLoading(false);
    }
  };

  const openRequestModal = (skill = '') => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setSelectedSkill(skill);
    setMessage('');
    setRequestError('');
    setRequestSuccess(false);
    setRequestModal(true);
  };

  if (loading) return <Layout><PageSpinner /></Layout>;
  if (!profile) return null;

  return (
    <Layout>
      <div className="page">
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Back button */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(-1)}
            style={{ marginBottom: '1.25rem' }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Profile Header Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Avatar user={profile} size="xl" />

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <div>
                    <h1 style={{ fontSize: '1.625rem', fontWeight: 700, marginBottom: '0.25rem' }}>{profile.name}</h1>
                    <Rating value={profile.averageRating} showCount count={profile.reviewCount} />
                  </div>

                  {isOwnProfile ? (
                    <Button variant="outline" onClick={() => navigate('/edit-profile')} size="sm">
                      Edit Profile
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={() => openRequestModal()} size="sm" id="send-request-btn">
                      <Send size={14} /> Send Request
                    </Button>
                  )}
                </div>

                {profile.bio && (
                  <p style={{ fontSize: '0.9375rem', marginBottom: '0.875rem', lineHeight: 1.6 }}>{profile.bio}</p>
                )}

                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {profile.city && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      <MapPin size={14} /> {profile.city}
                    </span>
                  )}
                  {profile.experienceLevel && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      <BarChart2 size={14} /> {profile.experienceLevel}
                    </span>
                  )}
                  {profile.availability && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      <Clock size={14} /> {profile.availability}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Skills I Teach */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.125rem' }}>
                <BookOpen size={16} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Skills I Teach</h3>
                <span className="badge badge-primary">{profile.skillsTeach?.length || 0}</span>
              </div>
              {profile.skillsTeach?.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>No teaching skills listed</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profile.skillsTeach?.map((skill) => (
                    <div
                      key={skill._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(47,107,95,0.05)',
                        border: '1px solid rgba(47,107,95,0.12)',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{skill.name}</span>
                        <span className="badge badge-neutral" style={{ marginLeft: 8, fontSize: '0.7rem' }}>{skill.category}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{skill.level}</span>
                        {!isOwnProfile && (
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.2rem 0.625rem', fontSize: '0.75rem' }}
                            onClick={() => openRequestModal(skill.name)}
                          >
                            Request
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills I Want to Learn */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.125rem' }}>
                <Lightbulb size={16} color="var(--color-accent)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Wants to Learn</h3>
                <span className="badge badge-accent">{profile.skillsLearn?.length || 0}</span>
              </div>
              {profile.skillsLearn?.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>No learning goals listed</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profile.skillsLearn?.map((skill) => (
                    <span key={skill._id} className="skill-tag skill-tag-learn">
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <MessageSquare size={16} color="var(--color-text-secondary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Reviews</h3>
              <span className="badge badge-neutral">{reviews.length}</span>
            </div>

            {reviews.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No reviews yet"
                description="Reviews will appear here after completed sessions."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <Avatar user={review.reviewer} size="sm" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{review.reviewer?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{timeAgo(review.createdAt)}</div>
                        </div>
                      </div>
                      <Rating value={review.rating} size={13} />
                    </div>
                    {review.comment && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.6 }}>{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Request Modal */}
      <Modal
        isOpen={requestModal}
        onClose={() => setRequestModal(false)}
        title={`Send Request to ${profile.name}`}
        footer={
          !requestSuccess && (
            <>
              <Button variant="ghost" onClick={() => setRequestModal(false)} size="sm">Cancel</Button>
              <Button variant="primary" loading={requestLoading} onClick={handleSendRequest} size="sm" id="confirm-request-btn">
                <Send size={14} /> Send Request
              </Button>
            </>
          )
        }
      >
        {requestSuccess ? (
          <div className="alert alert-success">
            Your request has been sent successfully! {profile.name} will be notified.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requestError && <div className="alert alert-error">{requestError}</div>}

            <div className="form-group">
              <label className="form-label">Skill you want to learn *</label>
              <select
                className="form-input form-select"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                id="request-skill-select"
              >
                <option value="">Select a skill...</option>
                {profile.skillsTeach?.map((s) => (
                  <option key={s._id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message (optional)</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Tell them why you want to learn this skill and what you can offer in return..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                id="request-message"
              />
              <span className="text-xs text-muted">{message.length}/500</span>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default UserProfilePage;
