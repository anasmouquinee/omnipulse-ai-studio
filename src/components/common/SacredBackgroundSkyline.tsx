import React from 'react';

/**
 * Sacred Islamic Architectural Skyline & Celestial Crescent
 * Silhouette of Prophet's Mosque minarets, grand domes and illuminated crescent moon.
 */
export const SacredBackgroundSkyline: React.FC = () => {
  return (
    <div className="sacred-skyline-root" aria-hidden="true">
      {/* 1. Upper Celestial Crescent Moon & Star */}
      <div className="celestial-crescent-halo">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id="crescentGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-gold-light)" stopOpacity="0.4" />
              <stop offset="60%" stopColor="var(--accent-gold)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Radial Ambient Glow Disk */}
          <circle cx="50" cy="50" r="48" fill="url(#crescentGlow)" />
          {/* Crescent Moon */}
          <path
            d="M52 18C34.33 18 20 32.33 20 50C20 67.67 34.33 82 52 82C60.2 82 67.6 78.9 73.2 73.8C61.4 72.4 52.2 62.3 52.2 50C52.2 37.7 61.4 27.6 73.2 26.2C67.6 21.1 60.2 18 52 18Z"
            fill="var(--accent-gold-light)"
            stroke="var(--accent-gold)"
            strokeWidth="1.2"
            filter="drop-shadow(0 0 12px var(--accent-gold))"
          />
          {/* 8-Pointed Rub el Hizb Star */}
          <polygon
            points="68,36 71,41 76,41 72,45 74,50 68,47 62,50 64,45 60,41 65,41"
            fill="#ffffff"
            stroke="var(--accent-gold-bright)"
            strokeWidth="0.8"
            filter="drop-shadow(0 0 6px var(--accent-gold-light))"
          />
        </svg>
      </div>

      {/* 2. Illuminated Bottom Mosque Skyline Silhouette */}
      <div className="mosque-skyline-wrapper">
        <svg
          className="mosque-skyline-svg"
          viewBox="0 0 1440 260"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="skylineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--surface-glass)" stopOpacity="0.9" />
              <stop offset="60%" stopColor="var(--bg-app)" stopOpacity="0.98" />
              <stop offset="100%" stopColor="var(--bg)" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="skylineBorder" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.1" />
              <stop offset="25%" stopColor="var(--accent-emerald-light)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="var(--accent-gold-light)" stopOpacity="0.6" />
              <stop offset="75%" stopColor="var(--accent-emerald)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Detailed Mosque Architecture Path: Minarets, Multiple Domes, Crescents */}
          <path
            d="
              M0,260 
              L0,220 
              L60,220 
              L60,130 
              L68,130 
              L68,60 
              L72,50 
              L72,32 
              L74,22 
              L74,32 
              L76,50 
              L80,60 
              L80,130 
              L88,130 
              L88,220 
              L150,220 
              C150,170 190,140 220,140 
              C250,140 290,170 290,220 
              L350,220 
              L350,150 
              L358,150 
              L358,80 
              L362,70 
              L362,45 
              L364,35 
              L364,45 
              L366,70 
              L370,80 
              L370,150 
              L378,150 
              L378,220 
              L440,220 
              C440,150 490,110 540,110 
              C590,110 640,150 640,220 
              L700,220 
              L700,110 
              L708,110 
              L708,40 
              L712,30 
              L712,12 
              L714,5 
              L714,12 
              L716,30 
              L720,40 
              L720,110 
              L728,110 
              L728,220 
              L800,220 
              C800,130 860,80 920,80 
              C980,80 1040,130 1040,220 
              L1100,220 
              L1100,140 
              L1108,140 
              L1108,70 
              L1112,60 
              L1112,38 
              L1114,28 
              L1114,38 
              L1116,60 
              L1120,70 
              L1120,140 
              L1128,140 
              L1128,220 
              L1200,220 
              C1200,165 1240,135 1270,135 
              C1300,135 1340,165 1340,220 
              L1380,220 
              L1380,120 
              L1388,120 
              L1388,55 
              L1392,45 
              L1392,25 
              L1394,18 
              L1394,25 
              L1396,45 
              L1400,55 
              L1400,120 
              L1408,120 
              L1408,220 
              L1440,220 
              L1440,260 
              Z
            "
            fill="url(#skylineGrad)"
            stroke="url(#skylineBorder)"
            strokeWidth="1.2"
          />

          {/* Illuminated Arched Windows Inside Grand Dome */}
          <g opacity="0.75">
            <path d="M890,160 C890,150 900,145 905,145 C910,145 920,150 920,160 L890,160 Z" fill="var(--accent-gold-light)" filter="drop-shadow(0 0 6px var(--accent-gold))" />
            <path d="M925,160 C925,150 935,145 940,145 C945,145 955,150 955,160 L925,160 Z" fill="var(--accent-gold-light)" filter="drop-shadow(0 0 6px var(--accent-gold))" />
            <path d="M525,175 C525,168 532,164 536,164 C540,164 547,168 547,175 L525,175 Z" fill="var(--accent-gold-light)" filter="drop-shadow(0 0 5px var(--accent-gold))" />
          </g>

          {/* Minaret Balconies & Crescent Finials Dots */}
          <circle cx="74" cy="18" r="3" fill="var(--accent-gold-light)" filter="drop-shadow(0 0 6px var(--accent-gold))" />
          <circle cx="364" cy="30" r="3" fill="var(--accent-gold-light)" filter="drop-shadow(0 0 6px var(--accent-gold))" />
          <circle cx="714" cy="5" r="3.5" fill="var(--accent-gold-light)" filter="drop-shadow(0 0 8px var(--accent-gold))" />
          <circle cx="1114" cy="24" r="3" fill="var(--accent-gold-light)" filter="drop-shadow(0 0 6px var(--accent-gold))" />
          <circle cx="1394" cy="15" r="3" fill="var(--accent-gold-light)" filter="drop-shadow(0 0 6px var(--accent-gold))" />
        </svg>
      </div>
    </div>
  );
};
