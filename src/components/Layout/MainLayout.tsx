import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './MainLayout.css';

export interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
}

interface MainLayoutProps {
  routes: RouteConfig[];
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ routes, children }) => {
  const history = useHistory();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleNavClick = (path: string) => {
    history.push(path);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="main-layout">
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{collapsed ? 'D' : 'Demo应用'}</h2>
          <button 
            className="collapse-btn" 
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {routes.map((route) => (
            <div
              key={route.path}
              className={`nav-item ${isActive(route.path) ? 'active' : ''}`}
              onClick={() => handleNavClick(route.path)}
            >
              {route.icon && <span className="nav-icon">{route.icon}</span>}
              {!collapsed && <span className="nav-label">{route.label}</span>}
            </div>
          ))}
        </nav>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;

