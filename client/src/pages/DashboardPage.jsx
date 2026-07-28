import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Lightbulb, Clock, Star, Send, Inbox,
  Calendar, ChevronRight, User, TrendingUp,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Rating from '../components/ui/Rating';
import EmptyState from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { requestService, sessionService, reviewService } from '../services/api';
import { formatDate, getProfileCompletion, statusConfig, timeAgo } from '../utils/helpers';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const profileCompletion = getProfileCompletion(user);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reqRes, sessRes, revRes] = await Promise.all([
          requestService.getRequests(),
          sessionService.getSessions(),
          reviewService.getReviews(user._id),
        ]);
        setRequests(reqRes.data.requests);
        setSessions(sessRes.data.sessions);
        setReviews(revRes.data.reviews);
      } catch {
        // graceful degradation
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user._id]);

  const pending = requests.filter((r) => r.status === 'pending');
  const accepted = requests.filter((r) => r.status === 'accepted');
  const upcoming = sessions.filter((s) => s.status === 'upcoming');
  const completed = sessions.filter((s) => s.status === 'completed');

  if (loading) return <Layout><PageSpinner /></Layout>;

  return (
    <Layout>
      <div className="page">
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '0.5rem' }}>
                <LayoutDashboard size={12} /> Dashboard
              </div>
              <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="page-subtitle">Here's an overview of your SkillSphere activity.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/settings')}>
                <User size={14} /> Edit Profile
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/explore')}>
                Explore Skills
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Skills Teaching', value: user?.skillsTeach?.length || 0, icon: BookOpen, color: 'var(--color-primary)' },
              { label: 'Skills Learning', value: user?.skillsLearn?.length || 0, icon: Lightbulb, color: 'var(--color-accent)' },
              { label: 'Pending Requests', value: pending.length, icon: Inbox, color: '#D97706' },
              { label: 'Sessions Done', value: completed.length, icon: Calendar, color: 'var(--color-success)' },
              { label: 'My Rating', value: user?.averageRating > 0 ? user.averageRating.toFixed(1) : '—', icon: Star, color: '#F59E0B' },
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Welcome Card / Profile Completion */}
              <div className="card" style={{ background: 'var(--color-primary)', border: 'none', color: 'white' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <Avatar user={user} size="lg" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>{user?.email}</div>
                    <div style={{ fontSize: '0.8125rem', opacity: 0.8, marginTop: '0.2rem' }}>
                      {user?.city || 'Add your city'} • {user?.experienceLevel || 'Set experience level'}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', opacity: 0.9 }}>Profile Completion</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, opacity: 0.95 }}>{profileCompletion}%</span>
                  </div>
                  <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.25)' }}>
                    <div className="progress-fill" style={{ width: `${profileCompletion}%`, background: 'white' }} />
                  </div>
                  {profileCompletion < 100 && (
                    <button
                      className="btn btn-sm"
                      style={{ marginTop: '0.875rem', background: 'white', color: 'var(--color-primary)', fontSize: '0.8125rem' }}
                      onClick={() => navigate('/settings')}
                    >
                      Complete Profile <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Pending Requests */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Inbox size={16} /> Pending Requests
                    {pending.length > 0 && <span className="badge badge-warning">{pending.length}</span>}
                  </h3>
                  <Link to="/requests" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View All <ChevronRight size={14} />
                  </Link>
                </div>

                {pending.length === 0 ? (
                  <EmptyState icon={Inbox} title="No pending requests" description="New match requests will appear here." />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pending.slice(0, 3).map((req) => {
                      const isReceiver = req.receiver?._id === user._id;
                      const otherUser = isReceiver ? req.sender : req.receiver;
                      return (
                        <div key={req._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                          <Avatar user={otherUser} size="sm" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{otherUser?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              {isReceiver ? 'Wants to learn' : 'You requested'}: <strong>{req.skillRequested}</strong>
                            </div>
                          </div>
                          <span className="badge badge-warning">Pending</span>
                          <Link to="/requests" className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
                            {isReceiver ? 'Respond' : 'View'}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upcoming Sessions */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} /> Upcoming Sessions
                    {upcoming.length > 0 && <span className="badge badge-success">{upcoming.length}</span>}
                  </h3>
                  <Link to="/sessions" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View All <ChevronRight size={14} />
                  </Link>
                </div>

                {upcoming.length === 0 ? (
                  <EmptyState icon={Calendar} title="No upcoming sessions" description="Accept requests to schedule sessions." />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {upcoming.slice(0, 3).map((sess) => {
                      const otherUser = sess.requester?._id === user._id ? sess.receiver : sess.requester;
                      return (
                        <div key={sess._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                          <Avatar user={otherUser} size="sm" />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{otherUser?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{sess.skill} • {formatDate(sess.date)}</div>
                          </div>
                          <span className="badge badge-success">Upcoming</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Quick Actions */}
              <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { label: 'Browse Skills', icon: TrendingUp, to: '/explore', variant: 'primary' },
                    { label: 'My Requests', icon: Send, to: '/requests', variant: 'outline' },
                    { label: 'My Sessions', icon: Calendar, to: '/sessions', variant: 'outline' },
                    { label: 'My Reviews', icon: Star, to: '/reviews', variant: 'outline' },
                    { label: 'Edit Profile', icon: User, to: '/settings', variant: 'ghost' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className={`btn btn-${action.variant}`}
                      style={{ justifyContent: 'flex-start', gap: '0.625rem' }}
                      onClick={() => navigate(action.to)}
                    >
                      <action.icon size={15} /> {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={16} /> Reviews
                  </h3>
                  {user?.averageRating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                      {user.averageRating.toFixed(1)} <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    </div>
                  )}
                </div>

                {reviews.length === 0 ? (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                    No reviews yet
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review._id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{review.reviewer?.name}</span>
                          <Rating value={review.rating} size={11} />
                        </div>
                        {review.comment && (
                          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            "{review.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
