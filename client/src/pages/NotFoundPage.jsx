import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, Compass } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--color-bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--color-primary)'
          }}>
            <HelpCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold" style={{ marginBottom: '0.75rem' }}>404 - Page Not Found</h1>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>
            Oops! The page you are looking for does not exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/">
              <Button icon={<Home size={16} />}>Go to Home</Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline" icon={<Compass size={16} />}>Explore Skills</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
