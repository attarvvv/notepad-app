import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Note } from '../types';
import { theme } from '../theme/colors';
import { formatNoteDate } from '../utils/formatDate';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {
  const displayTitle = note.title.trim() || 'New Note';
  const displayContent = note.content.trim() || 'No additional text';
  const formattedDate = formatNoteDate(note.updated_at || note.created_at);

  return (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={onPress}
      style={styles.card}
    >
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {displayTitle}
      </Text>

      <View style={styles.detailsRow}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.snippetText} numberOfLines={1} ellipsizeMode="tail">
          {displayContent}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    ...theme.typography.titleMedium,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...theme.typography.bodySmall,
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  snippetText: {
    ...theme.typography.bodySmall,
    fontSize: 14,
    color: '#636366',
    flex: 1,
  },
});
