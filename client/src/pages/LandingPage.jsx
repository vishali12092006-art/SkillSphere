import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Users, Calendar, Star, CheckCircle, ChevronDown, ChevronUp,
  Zap, Shield, Globe, TrendingUp, Award, Clock,
} from 'lucide-react';
import Layout from '../components/layout/Layout';

const FEATURES = [
  {
    icon: Users,
    title: 'Smart Matching',
    description: 'Discover users whose teachable skills match exactly what you want to learn.',
  },
  {
    icon: Calendar,
    title: 'Schedule Sessions',
    description: 'Book learning sessions at times that work for both parties with ease.',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    description: 'Build trust through transparent ratings and detailed post-session reviews.',
  },
  {
    icon: Globe,
    title: 'Any Skill, Any Domain',
    description: 'From coding to cooking, photography to public speaking — all skills welcome.',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'JWT-secured accounts with profile verification to ensure a safe exchange.',
  },
  {
    icon: Zap,
    title: 'Instant Requests',
    description: 'Send and receive learning requests instantly with real-time status updates.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up and list the skills you can teach and the ones you want to learn.',
  },
  {
    step: '02',
    title: 'Discover Matches',
    description: 'Browse the Skill Explorer to find users whose skills complement yours.',
  },
  {
    step: '03',
    title: 'Send a Request',
    description: 'Send a personalized learning request specifying the skill you want to exchange.',
  },
  {
    step: '04',
    title: 'Learn & Grow',
    description: 'Schedule a session, meet virtually, exchange knowledge, and leave a review.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'UX Designer',
    content: 'I traded my Figma skills for Python lessons. Best exchange ever! SkillSphere made it seamless.',
    rating: 5,
    initials: 'PS',
  },
  {
    name: 'Rahul Verma',
    role: 'Software Engineer',
    content: 'Found a guitar teacher within two days. She learned React from me in return. Incredible platform.',
    rating: 5,
    initials: 'RV',
  },
  {
    name: 'Aisha Khan',
    role: 'Marketing Manager',
    content: 'Exchanged my marketing knowledge for Spanish lessons. SkillSphere is a game changer.',
    rating: 5,
    initials: 'AK',
  },
];

const FAQS = [
  {
    q: 'Is SkillSphere free to use?',
    a: 'Yes! SkillSphere is completely free. We believe knowledge should flow freely between people who are passionate about sharing it.',
  },
  {
    q: 'Do I need to have a skill to teach to join?',
    a: 'Everyone has something to offer. Even beginners can share what they know. You can also just list skills you want to learn and explore first.',
  },
  {
    q: 'How do sessions happen?',
    a: 'Sessions are conducted online via video calls. You and your match agree on a meeting link (Zoom, Google Meet, etc.) and a time that works for both.',
  },
  {
    q: 'What if I have a bad experience?',
    a: 'You can leave an honest review after each session. We take quality seriously and low-rated profiles are monitored by our admin team.',
  },
  {
    q: 'Can I teach multiple skills?',
    a: 'Absolutely! You can add as many skills as you want under both "Skills I Teach" and "Skills I Want to Learn".',
  },
];

const STATS = [
  { value: '2,400+', label: 'Active Members' },
  { value: '150+', label: 'Skills Available' },
  { value: '1,800+', label: 'Sessions Completed' },
  { value: '4.8★', label: 'Average Rating' },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.125rem 1.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '1rem',
        }}
      >
        <span style={{ fontWeight: 500, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{q}</span>
        {open ? <ChevronUp size={18} color="var(--color-text-muted)" /> : <ChevronDown size={18} color="var(--color-text-muted)" />}
      </button>
      {open && (
        <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  );
};

const LandingPage = () => {
  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section style={{
        padding: '5rem 0 4rem',
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="animate-fade-in-up">
            <div className="section-label" style={{ display: 'inline-flex', margin: '0 auto 1.25rem' }}>
              <Zap size={12} />
              Peer-to-Peer Skill Exchange Platform
            </div>
          </div>

          <h1 className="animate-fade-in-up" style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            animationDelay: '0.05s',
          }}>
            Where Knowledge Connects
            <br />
            <span style={{ color: 'var(--color-primary)' }}>and Skills Grow.</span>
          </h1>

          <p className="animate-fade-in-up" style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            maxWidth: 560,
            margin: '0 auto 2.5rem',
            animationDelay: '0.1s',
          }}>
            Teach what you know. Learn what you love. Connect with passionate learners and
            expert practitioners through meaningful skill exchanges.
          </p>

          <div
            className="animate-fade-in-up"
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.15s' }}
          >
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-get-started">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn btn-outline btn-lg" id="hero-explore-skills">
              Explore Skills
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '2.5rem',
              flexWrap: 'wrap',
              animationDelay: '0.2s',
            }}
          >
            {['No payment required', 'Verified profiles', 'Rated sessions'].map((item) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <CheckCircle size={14} color="var(--color-primary)" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ padding: '3rem 0', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.375rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ display: 'inline-flex' }}>
              <TrendingUp size={12} /> Why SkillSphere
            </div>
            <h2 className="section-title">Everything you need to exchange skills</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              A complete platform built to make knowledge exchange effortless, trustworthy, and rewarding.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-hover animate-fade-in-up" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(47, 107, 95, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(47, 107, 95, 0.15)',
                }}>
                  <f.icon size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.375rem' }}>{f.title}</h4>
                  <p style={{ fontSize: '0.875rem' }}>{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ display: 'inline-flex' }}>
              <Clock size={12} /> Process
            </div>
            <h2 className="section-title">How SkillSphere Works</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Four simple steps to start exchanging skills and growing your knowledge.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {HOW_IT_WORKS.map((item, idx) => (
              <div key={item.step} className="card" style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'rgba(47,107,95,0.12)',
                  lineHeight: 1,
                  marginBottom: '1rem',
                }}>
                  {item.step}
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.875rem' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="section-label">
                <Award size={12} /> Benefits
              </div>
              <h2 className="section-title" style={{ marginTop: '0.75rem' }}>
                Learn faster by teaching others
              </h2>
              <p style={{ marginBottom: '2rem' }}>
                Studies show that teaching a skill deepens your own understanding. SkillSphere
                creates a virtuous cycle where everyone grows — both teachers and learners.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'No monetary exchange', desc: 'Skills are the only currency here.' },
                  { title: 'Flexible scheduling', desc: 'Meet when it works for both of you.' },
                  { title: 'Diverse skill categories', desc: 'Tech, arts, languages, music, and more.' },
                  { title: 'Community-driven quality', desc: 'Reviews keep the platform trustworthy.' },
                ].map((b) => (
                  <div key={b.title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)', marginBottom: '0.125rem' }}>{b.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: Users, label: 'Find Your Match', color: '#2F6B5F' },
                { icon: BookOpen, label: 'Share Knowledge', color: '#C48A3A' },
                { icon: Calendar, label: 'Schedule Easily', color: '#2F6B5F' },
                { icon: Award, label: 'Earn Recognition', color: '#C48A3A' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="card"
                  style={{ textAlign: 'center', padding: '1.75rem 1rem' }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: `${item.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.875rem',
                    border: `1px solid ${item.color}25`,
                  }}>
                    <item.icon size={22} color={item.color} />
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ display: 'inline-flex' }}>
              <Star size={12} /> Testimonials
            </div>
            <h2 className="section-title">What our members say</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card card-hover">
                {/* Stars */}
                <div style={{ display: 'flex', gap: 2, marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '0.9375rem', marginBottom: '1.25rem', lineHeight: 1.7, color: 'var(--color-text)' }}>
                  "{t.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="avatar-fallback avatar-md" style={{ fontSize: '0.8125rem' }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section">
        <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ display: 'inline-flex' }}>FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{
        padding: '5rem 0',
        background: 'var(--color-primary)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ color: 'white', fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Ready to start exchanging skills?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.0625rem', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Join thousands of learners and teachers building a community around knowledge.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg" id="cta-get-started" style={{
              background: 'white',
              color: 'var(--color-primary)',
              border: '2px solid white',
            }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn btn-lg" id="cta-explore" style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.5)',
            }}>
              Browse Skills
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
