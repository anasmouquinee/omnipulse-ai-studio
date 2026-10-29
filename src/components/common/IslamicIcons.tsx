import React from 'react';

interface IslamicIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 1. Kaaba Icon (الكعبة المشرفة)
 * 3D Isometric Holy Kaaba draped with golden Kiswah belt and door (Bab Al-Kaaba).
 */
export const KaabaIcon: React.FC<IslamicIconProps> = ({ size = 20, color = 'currentColor', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    {/* Base Cube */}
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#091410" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M12 22V12L22 7" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M12 12L2 7" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    {/* Golden Kiswah Belt (حزام الكعبة) */}
    <path d="M2 9.5L12 14.5L22 9.5" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="1 1" />
    {/* Golden Door (باب الكعبة) */}
    <rect x="14" y="11" width="3.5" height="5" rx="0.5" fill="#f59e0b" fillOpacity="0.85" stroke="#fef08a" strokeWidth="0.5" />
    {/* Upper Gilded Border */}
    <path d="M5 5.5L12 9L19 5.5" stroke="#fbbf24" strokeWidth="0.8" strokeOpacity="0.7" />
  </svg>
);

/**
 * 2. Mosque Dome & Minaret Icon (المسجد النبوي وقبة الصخرة)
 * Islamic dome with crescent and flanking minarets.
 */
export const MosqueDomeIcon: React.FC<IslamicIconProps> = ({ size = 20, color = 'currentColor', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    {/* Minaret Left */}
    <path d="M3 21V10L4.5 8L6 10V21H3Z" fill="currentColor" fillOpacity="0.15" stroke={color} strokeWidth="1.2" />
    <circle cx="4.5" cy="6" r="1" fill="#f59e0b" />
    {/* Minaret Right */}
    <path d="M18 21V10L19.5 8L21 10V21H18Z" fill="currentColor" fillOpacity="0.15" stroke={color} strokeWidth="1.2" />
    <circle cx="19.5" cy="6" r="1" fill="#f59e0b" />
    {/* Central Dome */}
    <path d="M7 21V14C7 9.5 12 7 12 7C12 7 17 9.5 17 14V21H7Z" fill="currentColor" fillOpacity="0.25" stroke={color} strokeWidth="1.3" />
    {/* Crescent Finial (الهلال) */}
    <path d="M12 7V4M12 4C11.5 3.5 11.5 2.5 12 2C12.8 2.2 13.2 3.2 12.8 4C12.6 4.3 12.3 4.5 12 4.5" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
    {/* Arch Door */}
    <path d="M10 21V17C10 16 11 15.2 12 15.2C13 15.2 14 16 14 17V21" stroke="#f59e0b" strokeWidth="1.2" />
  </svg>
);

/**
 * 3. Quran Mushaf on Rihal Icon (المصحف الشريف)
 * Open Holy Quran resting on traditional carved wooden Rihal stand.
 */
export const QuranMushafIcon: React.FC<IslamicIconProps> = ({ size = 20, color = 'currentColor', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    {/* Open Book Left & Right Pages */}
    <path d="M12 6C10 4.5 6 4.5 3 5V17C6 16.5 10 16.5 12 18C14 16.5 18 16.5 21 17V5C18 4.5 14 4.5 12 6Z" fill="currentColor" fillOpacity="0.2" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M12 6V18" stroke="#f59e0b" strokeWidth="1.4" />
    {/* Calligraphy Lines */}
    <path d="M5.5 8H9.5M5.5 11H9.5M5.5 14H8.5" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
    <path d="M14.5 8H18.5M14.5 11H18.5M15.5 14H18.5" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
    {/* Rihal Crossed Stand (حامل المصحف) */}
    <path d="M4 18L10 22M20 18L14 22" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 4. Crescent Moon with Rub el Hizb (الهلال والنجمة الثمانية)
 */
export const CrescentMoonIcon: React.FC<IslamicIconProps> = ({ size = 20, color = '#f59e0b', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C14.83 21 17.34 19.69 19 17.65C14.5 17.2 11 13.5 11 9C11 6.5 12.2 4.3 14.1 3C13.4 3 12.7 3 12 3Z" fill="currentColor" fillOpacity="0.25" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    {/* 8-Pointed Star (نجمة ثمانية) */}
    <polygon points="17,6 18.5,8 20.5,8 19,10 20.5,12 18.5,12 17,14 15.5,12 13.5,12 15,10 13.5,8 15.5,8" fill="#fef08a" stroke={color} strokeWidth="0.6" />
  </svg>
);

/**
 * 5. Rub El Hizb Star Medallion (۞ الربع الحزب)
 */
export const RubElHizbIcon: React.FC<IslamicIconProps> = ({ size = 20, color = '#f59e0b', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    {/* Outer Square */}
    <rect x="5" y="5" width="14" height="14" rx="1.5" fill="currentColor" fillOpacity="0.15" stroke={color} strokeWidth="1.3" />
    {/* Rotated Square 45 deg */}
    <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" fill="currentColor" fillOpacity="0.15" stroke={color} strokeWidth="1.3" />
    {/* Central Holy Eye/Dot */}
    <circle cx="12" cy="12" r="2.2" fill="#fef08a" stroke={color} strokeWidth="0.8" />
  </svg>
);

/**
 * 6. Ramadan Fanous Lantern (فانوس رمضان)
 */
export const FanousLanternIcon: React.FC<IslamicIconProps> = ({ size = 20, color = '#f59e0b', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    {/* Hanging Ring */}
    <circle cx="12" cy="3.5" r="1.5" stroke={color} strokeWidth="1.2" />
    {/* Dome Cap */}
    <path d="M8 8L12 5L16 8H8Z" fill="#b45309" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    {/* Glass Body */}
    <path d="M8 8L6 14L9 18H15L18 14L16 8H8Z" fill="currentColor" fillOpacity="0.25" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    {/* Glowing Candle Flame inside */}
    <path d="M12 11C11 12.5 11 14.5 12 15C13 14.5 13 12.5 12 11Z" fill="#fef08a" filter="drop-shadow(0 0 4px #f59e0b)" />
    {/* Base Stand */}
    <path d="M9 18L8 21H16L15 18" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

/**
 * 7. Tasbih Prayer Beads Icon (السبحة المباركة)
 */
export const PrayerBeadsIcon: React.FC<IslamicIconProps> = ({ size = 20, color = 'currentColor', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    {/* Circle of Beads */}
    <circle cx="12" cy="10" r="7.5" stroke={color} strokeWidth="1.2" strokeDasharray="2.5 2.5" />
    {/* Lead Bead (الشاهد) */}
    <circle cx="12" cy="17.5" r="1.8" fill="#f59e0b" stroke="#fef08a" strokeWidth="0.6" />
    {/* Tassel (الشرابة) */}
    <path d="M12 19.3V22M10.5 22H13.5" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 8. Moorish Mihrab Arch Icon (المحراب الأندلسي)
 */
export const MihrabArchIcon: React.FC<IslamicIconProps> = ({ size = 20, color = 'currentColor', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M4 21V10C4 5.5 8 2 12 2C16 2 20 5.5 20 10V21" stroke={color} strokeWidth="1.3" />
    {/* Horseshoe Pointed Arch */}
    <path d="M7 21V12C7 9.5 9 6.5 12 6.5C15 6.5 17 9.5 17 12V21" fill="currentColor" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="1.2" />
    <circle cx="12" cy="9.5" r="1" fill="#fef08a" />
  </svg>
);

/**
 * 9. Traditional Calligraphy Qalam Feather (القلم القرآني)
 */
export const QalamPenIcon: React.FC<IslamicIconProps> = ({ size = 20, color = '#f59e0b', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M18 2L22 6L9 19L3 21L5 15L18 2Z" fill="currentColor" fillOpacity="0.2" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M14 6L18 10" stroke={color} strokeWidth="1.2" />
    <circle cx="5" cy="19" r="1" fill="#fef08a" />
  </svg>
);

/**
 * 10. Sunnah / Fajr Palm & Ray Icon (السنة النبوية والنخيل)
 */
export const SunnahPalmIcon: React.FC<IslamicIconProps> = ({ size = 20, color = 'currentColor', className, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    {/* Palm Trunk */}
    <path d="M12 21V11" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
    {/* Palm Fronds */}
    <path d="M12 11C9 9 6 10 4 12M12 11C15 9 18 10 20 12M12 11C10 7 7 6 5 7M12 11C14 7 17 6 19 7M12 11C12 7 12 5 12 3" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" />
    {/* Crescent Above */}
    <circle cx="12" cy="3" r="1" fill="#f59e0b" />
  </svg>
);
