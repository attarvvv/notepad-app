import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
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
  Copy,
  Info,
  X,
} from 'lucide-react-native';
import { AppStackParamList, Note } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { theme } from '../theme/colors';
import { formatDetailedDate } from '../utils/formatDate';

type Props = NativeStackScreenProps<AppStackParamList, 'NoteEditor'>;

export const NoteEditorScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const existingNote = route.params?.note;
  const isEditing = !!existingNote;

  const [noteId, setNoteId] = useState<string | undefined>(existingNote?.id);
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* iOS Top Navigation Bar */}
      <View style={styles.navBar}>
        {/* Left: < Notes */}
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeft size={28} color={theme.colors.primary} strokeWidth={2.5} style={styles.chevronIcon} />
          <Text style={styles.backLabel}>Notes</Text>
        </TouchableOpacity>

        {/* Right Action Icons: Share & 3-Dots */}
        <View style={styles.navRightActions}>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.navIconButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Share2 size={22} color={theme.colors.primary} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMorePress}
            style={styles.navIconButton}
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
        style={styles.flex}
      >
        <ScrollView
          style={styles.scrollCanvas}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Centered Date Header */}
          <Text style={styles.dateStamp}>{displayDate}</Text>

          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor={theme.colors.textMuted}
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
            multiline={false}
          />

          {/* Body Content Input */}
          <TextInput
            style={styles.bodyInput}
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
        <View style={[styles.bottomToolbar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
          <View style={styles.toolbarLeft}>
            <TouchableOpacity
              onPress={handleInsertChecklist}
              style={styles.toolbarButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ListTodo size={22} color={theme.colors.textSecondary} strokeWidth={1.8} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Attachment', 'Attachment feature')}
              style={styles.toolbarButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Paperclip size={22} color={theme.colors.textSecondary} strokeWidth={1.8} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Drawing', 'Sketch tool')}
              style={styles.toolbarButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <PenTool size={22} color={theme.colors.textSecondary} strokeWidth={1.8} />
            </TouchableOpacity>
          </View>

          {/* New note button on bottom right */}
          <TouchableOpacity
            onPress={handleCreateNew}
            style={styles.toolbarComposeButton}
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
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.actionSheetContainer, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.actionSheetHeader}>
              <Text style={styles.actionSheetTitle}>Note Options</Text>
              <Text style={styles.actionSheetSub}>{wordCount} words · {charCount} characters</Text>
            </View>

            <TouchableOpacity
              style={styles.actionSheetRow}
              onPress={handleShare}
            >
              <Share2 size={20} color={theme.colors.textPrimary} style={{ marginRight: 14 }} />
              <Text style={styles.actionSheetRowText}>Share Note</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionSheetRow, styles.actionSheetDestructive]}
              onPress={handleDelete}
            >
              <Trash2 size={20} color={theme.colors.danger} style={{ marginRight: 14 }} />
              <Text style={[styles.actionSheetRowText, { color: theme.colors.danger }]}>Delete Note</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionSheetCancelButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.actionSheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    backgroundColor: '#000000',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  chevronIcon: {
    marginRight: -2,
  },
  backLabel: {
    ...theme.typography.titleMedium,
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: '400',
  },
  navRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIconButton: {
    marginLeft: theme.spacing.lg,
  },
  scrollCanvas: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xs,
  },
  dateStamp: {
    ...theme.typography.timestamp,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    color: '#8E8E93',
  },
  titleInput: {
    ...theme.typography.noteTitle,
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
    padding: 0,
  },
  bodyInput: {
    ...theme.typography.bodyLarge,
    fontSize: 17,
    lineHeight: 26,
    color: '#FFFFFF',
    padding: 0,
    minHeight: 400,
  },
  bottomToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 12,
    backgroundColor: '#121212',
    borderTopWidth: 0.5,
    borderTopColor: '#2C2C2E',
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarButton: {
    marginRight: 24,
  },
  toolbarComposeButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  actionSheetHeader: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
    marginBottom: 8,
  },
  actionSheetTitle: {
    ...theme.typography.titleMedium,
    fontSize: 16,
    color: '#FFFFFF',
  },
  actionSheetSub: {
    ...theme.typography.caption,
    color: '#8E8E93',
    marginTop: 4,
  },
  actionSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  actionSheetDestructive: {
    borderBottomWidth: 0,
  },
  actionSheetRowText: {
    ...theme.typography.bodyLarge,
    fontSize: 17,
    color: '#FFFFFF',
  },
  actionSheetCancelButton: {
    marginTop: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionSheetCancelText: {
    ...theme.typography.titleMedium,
    fontSize: 17,
    color: theme.colors.primary,
  },
});
