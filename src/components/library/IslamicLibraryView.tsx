import React, { useState } from 'react';
import { IslamicLibraryService } from '../../services/islamicLibraryService';
import type { IslamicLibraryItem, IslamicContentType } from '../../types/library';
import { 
  Library, 
  Search, 
  Film, 
  Image as ImageIcon, 
  Volume2, 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  CheckCircle2,
  BookOpen,
  Sparkles,
  Layers,
  RefreshCw
} from 'lucide-react';

interface IslamicLibraryViewProps {
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const IslamicLibraryView: React.FC<IslamicLibraryViewProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<IslamicLibraryItem[]>(() => IslamicLibraryService.getItems());
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Automatically synchronize with Cloud / GitHub Actions registry on mount
  React.useEffect(() => {
    let isMounted = true;
    const sync = async () => {
      setIsSyncing(true);
      try {
        const synced = await IslamicLibraryService.fetchSyncedItems();
        if (isMounted) {
          setItems(synced);
        }
      } catch (e) {
        console.warn('Sync notice:', e);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };
    sync();
    return () => { isMounted = false; };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const synced = await IslamicLibraryService.fetchSyncedItems();
      setItems(synced);
      onShowToast('success', `✨ Synchronisation réussie (${synced.length} publications au total).`);
    } catch (e) {
      onShowToast('error', 'Échec de la synchronisation avec le registre cloud.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = searchQuery.trim() === '' || 
      item.themeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translationFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arabicText.includes(searchQuery);

    return matchesType && matchesSearch;
  });

  // Audio Playback
  const handleToggleAudio = (item: IslamicLibraryItem) => {
    if (!item.audioUrl) return;

    if (playingAudioId === item.id && audioElement) {
      audioElement.pause();
      setPlayingAudioId(null);
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(item.audioUrl);
    audio.play().catch(e => console.warn('Audio play error:', e));
    audio.onended = () => setPlayingAudioId(null);
    setAudioElement(audio);
    setPlayingAudioId(item.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous retirer cette publication de la bibliothèque ?')) {
      IslamicLibraryService.deleteItem(id);
      const updated = IslamicLibraryService.getItems();
      setItems(updated);
      onShowToast('info', 'Publication retirée de la bibliothèque.');
    }
  };

  // Stats calculation
  const totalPosts = items.length;
  const totalReels = items.filter(i => i.format === 'reel').length;
  const totalQuran = items.filter(i => i.type === 'quran').length;
  const totalHadith = items.filter(i => i.type === 'hadith').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner & Stats */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%)',
        border: '1px solid rgba(217, 119, 6, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📚</span>
              <h1 style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Bibliothèque & Registre Anti-Doublons
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Toutes les publications & Reels enregistrés. L'algorithme exclut automatiquement ces sujets pour garantir 100% de contenu inédit.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(217, 119, 6, 0.1)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>{totalPosts}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Total Publiés</div>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>{totalReels}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Vidéos Reels</div>
            </div>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#60a5fa' }}>{totalQuran}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Versets Coran</div>
            </div>

            <div style={{
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f472b6' }}>{totalHadith}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Hadiths Sahih</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Filters & Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        background: 'var(--bg-card)',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-medium)'
      }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Tous les Rappels' },
            { id: 'quran', label: '📖 Noble Coran' },
            { id: 'hadith', label: '📜 Hadiths Sahih' },
            { id: 'dua', label: '🤲 Invocations' },
            { id: 'wisdom', label: '💡 Sagesse & Nasîha' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '999px',
                border: 'none',
                background: selectedType === tab.id 
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                  : 'rgba(255,255,255,0.05)',
                color: selectedType === tab.id ? '#020617' : 'var(--text-secondary)',
                fontWeight: selectedType === tab.id ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input & Sync Button */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par sourate, hadith, mot-clé..."
              style={{
                width: '100%',
                padding: '0.45rem 0.85rem 0.45rem 2.4rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: isSyncing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            title="Synchroniser avec le registre cloud GitHub Actions"
          >
            <RefreshCw size={14} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isSyncing ? 'Sync en cours...' : 'Sync Cloud'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Library Cards */}
      {filteredItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-medium)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem 0' }}>
            Aucun contenu trouvé dans cette catégorie
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', margin: 0 }}>
            Publiez des rappels depuis le Studio ou lancez l'Auto-Pilot pour enrichir votre bibliothèque.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                transition: 'border-color 0.2s, transform 0.2s'
              }}
            >
              <div>
                {/* Top Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      background: item.format === 'reel' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: item.format === 'reel' ? '#34d399' : '#60a5fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {item.format === 'reel' ? <Film size={11} /> : <ImageIcon size={11} />}
                      {item.format === 'reel' ? 'Reel Vidéo' : 'Affiche Photo'}
                    </span>

                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      {new Date(item.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Retirer de l'historique"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      display: 'flex'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Theme Title */}
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#fef08a',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.3
                }}>
                  {item.themeTitle}
                </h4>

                {/* Arabic Text preview */}
                {item.arabicText ? (
                  <div style={{
                    fontFamily: 'Amiri, Traditional Arabic, serif',
                    fontSize: '1.05rem',
                    color: '#fff',
                    direction: 'rtl',
                    lineHeight: 1.6,
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.65rem',
                    maxHeight: '80px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.arabicText}
                  </div>
                ) : null}

                {/* French Translation */}
                {item.translationFr ? (
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    margin: '0 0 0.65rem 0',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.translationFr}
                  </p>
                ) : null}

                {/* Reference */}
                <div style={{
                  fontSize: '0.73rem',
                  color: '#f59e0b',
                  fontWeight: 600,
                  marginBottom: '0.85rem'
                }}>
                  📍 {item.referenceText}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {/* Audio Button */}
                {item.audioUrl ? (
                  <button
                    onClick={() => handleToggleAudio(item)}
                    style={{
                      background: playingAudioId === item.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${playingAudioId === item.id ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '999px',
                      padding: '0.35rem 0.75rem',
                      color: playingAudioId === item.id ? '#34d399' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {playingAudioId === item.id ? <Pause size={12} /> : <Play size={12} />}
                    <span>{item.reciterName ? item.reciterName.split(' ')[0] : 'Audio'}</span>
                  </button>
                ) : (
                  <div />
                )}

                {/* Platform Badges & Direct Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {item.videoUrl && (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Télécharger la vidéo MP4"
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '6px',
                        padding: '0.3rem 0.55rem',
                        color: '#f59e0b',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Download size={11} />
                      <span>MP4</span>
                    </a>
                  )}

                  <span style={{
                    fontSize: '0.7rem',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    <CheckCircle2 size={12} color="#10b981" />
                    <span>Instagram & TikTok</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
