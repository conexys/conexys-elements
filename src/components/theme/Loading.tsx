/**
 * @fileoverview
 * @module components/header/AppNotifications
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import React from 'react';
import GppBadIcon from '@mui/icons-material/GppBad';
import type { LoadingProps } from '../../types/components/theme.types';

const FadingBalls: React.FC<{ color?: string }> = ({ color = '#777' }) => {
  const ballStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
    margin: '0 4px',
    display: 'inline-block',
    animation: 'fadingBalls 1.4s ease-in-out infinite both',
  };

  return (
    <>
      <style>
        {`
                    @keyframes fadingBalls {
                        0%, 80%, 100% {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        40% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                `}
      </style>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ ...ballStyle, animationDelay: '-0.32s' }} />
        <div style={{ ...ballStyle, animationDelay: '-0.16s' }} />
        <div style={{ ...ballStyle, animationDelay: '0s' }} />
      </div>
    </>
  );
};

/**
 * Component to display a Loading
 * @param props - The component props.
 * @returns The Loading component.
 */
const Loading: React.FC<LoadingProps> = ({
  children,
  type,
  error = false,
  loading = false,
}) => {
  if (type === 'flex') {
    return (
      <div
        className="bounce-loader"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <FadingBalls color="#777" />
      </div>
    );
  } else if (type === 'appnotifications') {
    return (
      <>
        {error ? (
          <ul className="notifications">
            <li>
              <div style={{ top: 10 }}>ERROR</div>
            </li>
          </ul>
        ) : loading ? (
          <ul className="notifications">
            <li>
              <div style={{ top: 10 }}>
                <FadingBalls color="#777" />
              </div>
            </li>
          </ul>
        ) : (
          children
        )}
      </>
    );
  } else {
    return (
      <>
        {error ? (
          <div>
            <GppBadIcon />{' '}
          </div>
        ) : loading ? (
          <div>
            <FadingBalls color="#777" />
          </div>
        ) : (
          children
        )}
      </>
    );
  }
};

export default Loading;
