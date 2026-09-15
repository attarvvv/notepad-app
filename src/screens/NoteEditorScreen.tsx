import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Share,
  ActionSheetIOS,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  CircleEllipsis,
  Share2,
  SquarePen,
  ListTodo,
  Paperclip,
  PenTool,
  Trash2,
} from 'lucide-react-native';
import { AppStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { theme } from '../theme/colors';
import { formatDetailedDate } from '../utils/formatDate';

type Props = NativeStackScreenProps<AppStackParamList, 'NoteEditor'>;

export const NoteEditorScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const existingNote = route.params?.note;

  const [noteId, setNoteId] = useState<string | undefined>(existingNote?.id);
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [menuVisible, setMenuVisible] = useState(false);
  const [, setIsKeyboardVisible] = useState(false);

  // References for auto-saving without state race condition
  const titleRef = useRef(title);
  const contentRef = useRef(content);
  const noteIdRef = useRef(noteId);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    noteIdRef.current = noteId;
  }, [noteId]);

  // Keyboard listener
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Save / Sync function
  const saveNote = useCallback(async () => {
    const currentTitle = titleRef.current.trim();
    const currentContent = contentRef.current.trim();
    const currentId = noteIdRef.current;

    // Do not save empty notes
    if (!currentTitle && !currentContent) return;
    if (!user) return;

    try {
      if (currentId) {
        // Update existing note
        await supabase
          .from('notes')
          .update({
            title: currentTitle,
            content: currentContent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentId);
      } else {
        // Insert new note
        const { data, error } = await supabase
          .from('notes')
          .insert({
            user_id: user.id,
            title: currentTitle,
            content: currentContent,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (data && !error) {
          setNoteId(data.id);
          noteIdRef.current = data.id;
        }
      }
    } catch (err) {
      console.warn('Auto-save failed:', err);
    }
  }, [user]);

  // Debounced auto-save on content change
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      saveNote();
    }, 800);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, content, saveNote]);

  // Save immediately on exiting
  const handleBack = async () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    await saveNote();
    navigation.goBack();
  };

  // Delete note
  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const currentId = noteIdRef.current;
            if (currentId) {
              await supabase.from('notes').delete().eq('id', currentId);
            }
            navigation.goBack();
          },
        },
      ]
    );
  };

  // Share note
  const handleShare = async () => {
    setMenuVisible(false);
    const fullText = [title.trim(), content.trim()].filter(Boolean).join('\n\n');
    if (!fullText) {
      Alert.alert('Empty Note', 'Nothing to share yet.');
      return;
    }
    try {
      await Share.share({
        message: fullText,
        title: title.trim() || 'Note',
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  // 3-dots Menu action
  const handleMorePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Share Note', 'Delete Note'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
          tintColor: theme.colors.primary,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleShare();
          if (buttonIndex === 2) handleDelete();
        }
      );
    } else {
      setMenuVisible(true);
    }
  };

  // Quick insert checklist item into text
  const handleInsertChecklist = () => {
    setContent((prev) => (prev ? `${prev}\n• ` : '• '));
  };

  // Create another note right from toolbar
  const handleCreateNew = async () => {
    await saveNote();
    setNoteId(undefined);
    noteIdRef.current = undefined;
    setTitle('');
    setContent('');
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const displayDate = existingNote?.updated_at
    ? formatDetailedDate(existingNote.updated_at)
    : formatDetailedDate(new Date().toISOString());

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      {/* iOS Top Navigation Bar */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-black">
        {/* Left: < Notes */}
        <TouchableOpacity
          onPress={handleBack}
          className="flex-row items-center -ml-2"
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeft size={28} color={theme.colors.primary} strokeWidth={2.5} className="-mr-0.5" />
          <Text className="text-primary text-[17px] font-normal">Notes</Text>
        </TouchableOpacity>

        {/* Right Action Icons: Share & 3-Dots */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleShare}
            className="ml-4"
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Share2 size={22} color={theme.colors.primary} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMorePress}
            className="ml-4"
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CircleEllipsis size={24} color={theme.colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Canvas Scroll */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 bg-black"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: insets.bottom + 80,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Centered Date Header */}
          <Text className="text-center text-xs text-[#8E8E93] mb-4 mt-1 font-normal">
            {displayDate}
          </Text>

          {/* Title Input */}
          <TextInput
            className="text-[30px] font-bold text-white mb-3 p-0 tracking-tight"
            placeholder="Title"
            placeholderTextColor={theme.colors.textMuted}
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
            multiline={false}
          />

          {/* Body Content Input */}
          <TextInput
            className="text-[17px] leading-[26px] text-white p-0 min-h-[400px]"
            placeholder="Type note here..."
            placeholderTextColor={theme.colors.textMuted}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
            autoCapitalize="sentences"
          />
        </ScrollView>

        {/* Signature iOS Notes Bottom Toolbar */}
        <View
          className="flex-row items-center justify-between px-5 pt-3 bg-[#121212] border-t border-[#2C2C2E]"
          style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleInsertChecklist}
              className="mr-6"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ListTodo size={22} color={theme.colors.textSecondary} strokeWidth={1.8} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Attachment', 'Attachment feature')}
              className="mr-6"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Paperclip size={22} color={theme.colors.textSecondary} strokeWidth={1.8} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Drawing', 'Sketch tool')}
              className="mr-6"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <PenTool size={22} color={theme.colors.textSecondary} strokeWidth={1.8} />
            </TouchableOpacity>
          </View>

          {/* New note button on bottom right */}
          <TouchableOpacity
            onPress={handleCreateNew}
            className="p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SquarePen size={24} color={theme.colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 3-Dots Action Sheet Modal for Android / Fallback */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/60 justify-end"
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View
            className="bg-[#1C1C1E] rounded-t-[20px] pt-4 px-4"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <View className="items-center pb-4 border-b border-[#2C2C2E] mb-2">
              <Text className="text-base font-semibold text-white">Note Options</Text>
              <Text className="text-xs text-[#8E8E93] mt-1">
                {wordCount} words · {charCount} characters
              </Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center py-3.5 px-3 border-b border-[#2C2C2E]"
              onPress={handleShare}
            >
              <Share2 size={20} color={theme.colors.textPrimary} style={{ marginRight: 14 }} />
              <Text className="text-[17px] text-white">Share Note</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3.5 px-3"
              onPress={handleDelete}
            >
              <Trash2 size={20} color={theme.colors.danger} style={{ marginRight: 14 }} />
              <Text className="text-[17px] text-danger">Delete Note</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 bg-[#2C2C2E] rounded-xl py-3.5 items-center"
              onPress={() => setMenuVisible(false)}
            >
              <Text className="text-[17px] font-semibold text-primary">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
