import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ collapsed }) => {
  return (
    <Link to="/admin/dashboard">
      <div style={{ 
        height: '32px', 
        margin: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start'
      }}>
        {!collapsed && <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Admin PomPom</span>}
        {collapsed && <span style={{ fontSize: '18px', fontWeight: 'bold' }}>AP</span>}
      </div>
    </Link>
  );
};

export default Logo; 