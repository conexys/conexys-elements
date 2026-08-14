/**
 * @fileoverview
 * React component for displaying a "Backend Offline" message.
 * Shown when the application cannot reach the backend server.
 * Uses inline styles for maximum compatibility (no CSS bundling issues).
 * @module components/BackendStatus/BackendOfflinePage
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 1.1.0
 */

import React from 'react';

/**
 * Props for the BackendOfflinePage component.
 */
interface BackendOfflinePageProps {
  /** Callback function when the retry button is clicked */
  onRetry?: () => void;
  /** Whether a retry is currently in progress */
  isRetrying?: boolean;
  /** Timestamp of the last successful connection */
  lastConnected?: Date | null;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '75%',
    maxWidth: '700px',
    margin: '1.5rem auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: '"Nunito", "Segoe UI", Arial, sans-serif',
  },
  iconContainer: {
    width: '75%',
    height: '13rem',
    padding: '1rem 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: '#fb3958',
    fontSize: '3em',
    fontWeight: 700,
    textAlign: 'center',
    textShadow: '2px 2px 5px #b1041f',
    margin: '0 0 1rem 0',
  },
  infoBox: {
    background: '#FEFEFE',
    width: '80%',
    padding: '1.5rem',
    border: '1px solid #DCDCDC',
    borderRadius: '0.25rem',
    textAlign: 'center',
  },
  infoTitle: {
    fontSize: '1.25em',
    lineHeight: '1.3',
    color: '#e30528',
    marginBottom: '0.75rem',
  },
  infoText: {
    fontSize: '1.15em',
    lineHeight: '1.5',
    color: '#122125',
    marginBottom: '1rem',
  },
  retryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 2rem',
    background: '#fb3958',
    color: '#fff',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '1.1em',
    fontFamily: '"Nunito", "Segoe UI", Arial, sans-serif',
    cursor: 'pointer',
    transition: 'background 0.2s ease, transform 0.1s ease',
  },
  retryBtnDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  timestamp: {
    fontSize: '0.85em',
    color: '#888',
    marginTop: '0.5rem',
  },
};

/**
 * BackendOfflinePage component.
 * Displays a friendly message when the backend is unreachable.
 *
 * @param {BackendOfflinePageProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
const BackendOfflinePage: React.FC<BackendOfflinePageProps> = ({
  onRetry,
  isRetrying = false,
  lastConnected = null,
}) => {
  const formatLastConnected = (date: Date | null): string => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div style={styles.container}>
      {/* Broken monitor SVG icon */}
      <div style={styles.iconContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          style={{ maxWidth: '70%', maxHeight: '100%' }}
        >
          <defs>
            <style>{`
              @keyframes flicker {
                0%, 100% { opacity: 1; }
                10% { opacity: 0.6; }
                20% { opacity: 0.9; }
                30% { opacity: 0.3; }
                40% { opacity: 0.8; }
                50% { opacity: 0.2; }
                60% { opacity: 0.95; }
                70% { opacity: 0.4; }
                80% { opacity: 0.85; }
                90% { opacity: 0.1; }
              }
              @keyframes crack {
                0% { transform: scaleY(1); }
                50% { transform: scaleY(1.02); }
                100% { transform: scaleY(1); }
              }
              .monitor-body { animation: flicker 3s ease-in-out infinite; }
              .crack-line { animation: crack 2s ease-in-out infinite; }
            `}</style>
          </defs>

          {/* Monitor stand */}
          <rect x="200" y="400" width="112" height="20" rx="4" fill="#555" />
          <rect x="230" y="380" width="52" height="24" rx="4" fill="#555" />

          {/* Monitor body */}
          <g className="monitor-body">
            {/* Outer frame */}
            <rect
              x="40"
              y="20"
              width="432"
              height="320"
              rx="16"
              fill="#2c3e50"
              stroke="#1a252f"
              strokeWidth="4"
            />
            {/* Screen area - dark/off */}
            <rect
              x="56"
              y="38"
              width="400"
              height="280"
              rx="8"
              fill="#1a1a2e"
            />
            {/* Screen glow effect */}
            <rect
              x="56"
              y="38"
              width="400"
              height="280"
              rx="8"
              fill="none"
              stroke="#16213e"
              strokeWidth="2"
            />

            {/* "No signal" text on screen */}
            <text
              x="256"
              y="200"
              textAnchor="middle"
              fill="#ff6b6b"
              fontSize="24"
              fontFamily="monospace"
              fontWeight="bold"
            >
              NO SIGNAL
            </text>

            {/* Scan lines */}
            <line
              x1="56"
              y1="80"
              x2="456"
              y2="80"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
            <line
              x1="56"
              y1="120"
              x2="456"
              y2="120"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
            <line
              x1="56"
              y1="160"
              x2="456"
              y2="160"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
            <line
              x1="56"
              y1="200"
              x2="456"
              y2="200"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
            <line
              x1="56"
              y1="240"
              x2="456"
              y2="240"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
            <line
              x1="56"
              y1="280"
              x2="456"
              y2="280"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </g>

          {/* Crack on screen */}
          <g className="crack-line">
            <polyline
              points="180,80 200,130 185,185 210,240 195,290"
              fill="none"
              stroke="#ff6b6b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
            <polyline
              points="200,130 230,140 215,170"
              fill="none"
              stroke="#ff6b6b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
            <polyline
              points="185,185 160,200"
              fill="none"
              stroke="#ff6b6b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          </g>
        </svg>
      </div>

      <h1 style={styles.header}>¡Sin conexión!</h1>

      <div style={styles.infoBox}>
        <h2 style={styles.infoTitle}>El servidor backend no está disponible</h2>
        <p style={styles.infoText}>
          No se puede establecer conexión con el servidor. La aplicación no
          podrá cargar los datos hasta que el servidor esté disponible.
        </p>
        <p style={styles.infoText}>
          Verifica que el servidor esté en ejecución o contacta con el
          administrador del sistema.
        </p>

        <button
          style={{
            ...styles.retryBtn,
            ...(isRetrying ? styles.retryBtnDisabled : {}),
          }}
          onClick={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeDasharray="31.4 31.4"
                  strokeLinecap="round"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
              Comprobando...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M1 4v6h6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Reintentar conexión
            </>
          )}
        </button>

        {lastConnected && (
          <div style={styles.timestamp}>
            Última conexión exitosa: {formatLastConnected(lastConnected)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendOfflinePage;
