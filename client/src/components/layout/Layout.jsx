import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, hideFooter = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      {children}
    </main>
    {!hideFooter && <Footer />}
  </div>
);

export default Layout;
