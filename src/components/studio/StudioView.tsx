import React, { useState } from 'react';
import type { ScheduledPost } from '../../types/content';
import type { IslamicPostItem } from '../../types/islamic';
import { IslamicContentService } from '../../services/islamicContentService';
import { StorageService } from '../../services/storageService';
import { IslamicQuoteCardGenerator } from './IslamicQuoteCardGenerator';

interface StudioViewProps {
  editingPost: ScheduledPost | null;
  onPostSaved: (post: ScheduledPost) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  onPostSaved,
  onShowToast
}) => {
  const handleApplyIslamicPost = (item: IslamicPostItem, cardImageUrl: string) => {
    const post = IslamicContentService.convertToScheduledPost(item, cardImageUrl);
    StorageService.savePost(post);
    onPostSaved(post);
    onShowToast('success', 'Rappel enregistré dans votre bibliothèque ! 🕋');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <IslamicQuoteCardGenerator
        onApplyPost={handleApplyIslamicPost}
        onShowToast={onShowToast}
      />
    </div>
  );
};
