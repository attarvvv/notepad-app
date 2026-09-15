import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SquarePen, LogOut } from 'lucide-react-native';
import { AppStackParamList, Note } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { theme } from '../theme/colors';
import { SearchBar } from '../components/SearchBar';
import { NoteCard } from '../components/NoteCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';

type Props = NativeStackScreenProps<AppStackParamList, 'NotesList'>;

export const NotesListScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotes = async (isRefresh = false) => {
    if (!user) return;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        setNotes(data || []);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [user?.id])
  );

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.content?.toLowerCase().includes(q)
    );
  });

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Top Header */}
      <View className="flex-row justify-end px-4 pt-2">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleLogout}
            className="p-1.5"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <LogOut size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* iOS Large Title */}
      <View className="px-4 pt-1 pb-2">
        <Text className="text-[34px] font-bold text-white tracking-tight">Notes</Text>
      </View>

      {/* iOS Search Bar */}
      <View className="px-4 pb-3">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </View>

      {/* Notes List */}
      {loading && !refreshing ? (
        <LoadingSpinner message="" />
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: insets.bottom + 80,
            flexGrow: filteredNotes.length === 0 ? 1 : undefined,
            justifyContent: filteredNotes.length === 0 ? 'center' : undefined,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchNotes(true)}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => navigation.navigate('NoteEditor', { note: item })}
            />
          )}
          ListEmptyComponent={
            searchQuery.trim().length > 0 ? (
              <EmptyState
                type="search"
                title="No Results"
                description={`No notes matching "${searchQuery}"`}
                actionTitle="Clear Search"
                onAction={() => setSearchQuery('')}
              />
            ) : (
              <EmptyState
                type="empty"
                title="No Notes"
                description="Tap the compose icon below to create your first note."
                actionTitle="New Note"
                onAction={() => navigation.navigate('NoteEditor')}
              />
            )
          }
        />
      )}

      {/* Signature iOS Bottom Toolbar */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between px-4 pt-3 bg-[#121212]/95 border-t border-[#2C2C2E]"
        style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }}
      >
        <View className="w-7" />

        {/* Center Note Count */}
        <Text className="text-xs text-[#8E8E93]">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
        </Text>

        {/* Right Compose Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('NoteEditor')}
          className="p-1"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <SquarePen size={24} color={theme.colors.primary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
