import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Note } from '../types';
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
      className="bg-[#1C1C1E] rounded-[14px] py-3.5 px-4 mb-2.5"
    >
      <Text className="text-[17px] font-semibold text-white mb-1" numberOfLines={1} ellipsizeMode="tail">
        {displayTitle}
      </Text>

      <View className="flex-row items-center">
        <Text className="text-[14px] text-[#8E8E93] mr-2">{formattedDate}</Text>
        <Text className="text-[14px] text-[#636366] flex-1" numberOfLines={1} ellipsizeMode="tail">
          {displayContent}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
