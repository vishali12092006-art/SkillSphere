import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, MessageSquare, Award, TrendingUp, User, ChevronRight,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import Rating from '../components/ui/Rating';
import EmptyState from '../components/ui/EmptyState';
import { PageSpinner } from '../components/ui/Spinner';
import { reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/helpers';

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewService.getReviews(user._id);
      setReviews(res.data.reviews);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // Statistics
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }));

  return (
    <Layout>
      <div className="page">
        <div className="container" style={{ maxWidth: 800 }}>
          {/* Page Header */}
          <div className="page-header">
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>
              <Star size={12} /> Reviews
            </div>
            <h1 className="page-title">My Reviews</h1>
            <p className="page-subtitle">See what others are saying about your skill exchanges.</p>
          </div>

          {loading ? (
            <PageSpinner />
          ) : (
            <>
              {/* Summary Card */}
              {reviews.length > 0 && (
                <div
                  className="card"
                  style={{
                    marginBottom: '2rem',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                    border: 'none',
                    color: 'white',
                  }}
                >
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Big rating */}
                    <div style={{ textAlign: 'center', minWidth: 100 }}>
                      <div style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1, color: 'white' }}>
                        {avgRating}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '0.375rem 0' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} style={{ fontSize: '1rem', color: parseFloat(avgRating) >= s ? '#FDE68A' : 'rgba(255,255,255,0.3)' }}>★</span>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>
                        {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Rating breakdown */}
                    <div style={{ flex: 1, minWidth: 180 }}>
                      {ratingCounts.map(({ rating: r, count }) => (
                        <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                          <span style={{ fontSize: '0.8125rem', opacity: 0.9, minWidth: 10 }}>{r}</span>
                          <span style={{ fontSize: '0.875rem', color: '#FDE68A' }}>★</span>
                          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 9999, overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%',
                                background: 'rgba(255,255,255,0.8)',
                                borderRadius: 9999,
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.8125rem', opacity: 0.8, minWidth: 16 }}>{count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                          {reviews.filter((r) => r.rating >= 4).length}
                        </div>
                        <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>Positive reviews</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                          {reviews.filter((r) => r.comment).length}
                        </div>
                        <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>With comments</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  description="Complete skill exchange sessions to receive reviews from your peers."
                  action={
                    <Link to="/sessions">
                      <button className="btn btn-outline btn-sm">
                        View My Sessions
                      </button>
                    </Link>
                  }
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="card"
                      style={{ padding: '1.25rem' }}
                      id={`review-${review._id}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Link to={`/profile/${review.reviewer?._id}`}>
                            <Avatar user={review.reviewer} size="md" />
                          </Link>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                              {review.reviewer?.name}
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                              {timeAgo(review.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                          <Rating value={review.rating} size={14} />
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: review.rating >= 4
                                ? 'var(--color-success)'
                                : review.rating >= 3
                                ? 'var(--color-warning)'
                                : 'var(--color-error)',
                            }}
                          >
                            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][review.rating]}
                          </span>
                        </div>
                      </div>

                      {review.comment && (
                        <div style={{
                          padding: '0.875rem 1rem',
                          background: 'var(--color-bg)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          borderLeft: '3px solid var(--color-primary)',
                        }}>
                          <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--color-text)',
                            lineHeight: 1.7,
                            margin: 0,
                            fontStyle: 'italic',
                          }}>
                            "{review.comment}"
                          </p>
                        </div>
                      )}

                      {/* View reviewer's profile */}
                      <Link
                        to={`/profile/${review.reviewer?._id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          fontSize: '0.8125rem',
                          color: 'var(--color-primary)',
                          fontWeight: 500,
                          marginTop: '0.75rem',
                          transition: 'opacity 0.15s',
                        }}
                      >
                        <User size={13} /> View {review.reviewer?.name}'s Profile
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReviewsPage;
