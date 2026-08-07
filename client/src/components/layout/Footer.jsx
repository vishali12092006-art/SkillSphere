import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, Share2, Code2 } from 'lucide-react';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            <BookOpen size={20} style={{ display: 'inline', marginRight: 8 }} />
            Skill<span>Sphere</span>
          </div>
          <p className="footer-desc">
            A peer-to-peer skill exchange platform where knowledge connects and skills grow.
            Teach what you know. Learn what you love.
          </p>
        </div>

        <div>
          <div className="footer-heading">Platform</div>
          <div className="footer-links">
            <Link to="/explore" className="footer-link">Explore Skills</Link>
            <Link to="/register" className="footer-link">Get Started</Link>
            <Link to="/login" className="footer-link">Login</Link>
          </div>
        </div>

        <div>
          <div className="footer-heading">Learn</div>
          <div className="footer-links">
            <Link to="/explore?category=Technology" className="footer-link">Technology</Link>
            <Link to="/explore?category=Design" className="footer-link">Design</Link>
            <Link to="/explore?category=Business" className="footer-link">Business</Link>
            <Link to="/explore?category=Language" className="footer-link">Languages</Link>
          </div>
        </div>

        <div>
          <div className="footer-heading">Company</div>
          <div className="footer-links">
            <Link to="/" className="footer-link">About</Link>
            <Link to="/" className="footer-link">Privacy Policy</Link>
            <Link to="/" className="footer-link">Terms of Service</Link>
            <Link to="/" className="footer-link">Contact</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SkillSphere. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Globe size={16} style={{ cursor: 'pointer', opacity: 0.7 }} />
          <Share2 size={16} style={{ cursor: 'pointer', opacity: 0.7 }} />
          <Code2 size={16} style={{ cursor: 'pointer', opacity: 0.7 }} />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
