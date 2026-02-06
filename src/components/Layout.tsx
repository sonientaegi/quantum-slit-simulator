/**
 * Top-level responsive layout
 * Desktop: Left sidebar (280px) + 3 visualization panels
 * Mobile (<768px): Collapsible sidebar overlay + stacked panels
 */

import { useState, useEffect, type ReactNode } from 'react';

export interface LayoutProps {
  sidebar: ReactNode;
  physicalView: ReactNode;
  diffractionPattern: ReactNode;
  groverVisualization: ReactNode;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

export function Layout({
  sidebar,
  physicalView,
  diffractionPattern,
  groverVisualization,
}: LayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isMobile) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
          color: '#e0e0e0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            borderRight: '1px solid #333',
            overflowY: 'auto',
            backgroundColor: '#111',
          }}
        >
          {sidebar}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            backgroundColor: '#000',
            overflow: 'hidden',
            height: '100vh',
          }}
        >
          <div style={{ flex: '1 1 33%', minHeight: 0, overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
            {physicalView}
          </div>
          <div style={{ flex: '1 1 33%', minHeight: 0, overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
            {diffractionPattern}
          </div>
          <div style={{ flex: '1 1 34%', minHeight: 0, overflow: 'hidden', backgroundColor: '#0a0a0a' }}>
            {groverVisualization}
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0a0a0a',
        color: '#e0e0e0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Mobile top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          backgroundColor: '#111',
          borderBottom: '1px solid #333',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none',
            border: '1px solid #444',
            borderRadius: '6px',
            color: '#e0e0e0',
            fontSize: '18px',
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: 600 }}>
          양자 슬릿 시뮬레이터
        </span>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '280px',
              height: '100vh',
              backgroundColor: '#111',
              borderRight: '1px solid #333',
              overflowY: 'auto',
              zIndex: 11,
            }}
          >
            {sidebar}
          </div>
        </>
      )}

      {/* Visualization panels */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          backgroundColor: '#000',
        }}
      >
        <div style={{ height: '200px', flexShrink: 0, backgroundColor: '#0a0a0a' }}>
          {physicalView}
        </div>
        <div style={{ height: '200px', flexShrink: 0, backgroundColor: '#0a0a0a' }}>
          {diffractionPattern}
        </div>
        <div style={{ height: '500px', flexShrink: 0, backgroundColor: '#0a0a0a' }}>
          {groverVisualization}
        </div>
      </div>
    </div>
  );
}
