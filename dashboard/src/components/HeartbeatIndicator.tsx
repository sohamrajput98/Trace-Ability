import React from 'react';

export const HeartbeatIndicator = () => {
  return (
    <div className="flex items-center justify-center w-16 h-12">
      <svg width="64px" height="48px" className="ekg-svg">
        {/* Background faded line */}
        <polyline
          className="ekg-back"
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
        />
        {/* First animated pulse */}
        <polyline
          className="ekg-front"
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
        />
        {/* Second trailing pulse */}
        <polyline
          className="ekg-front delay"
          points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
        />
      </svg>
    </div>
  );
};