import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { theme } from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search',
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <Search size={17} color="#8E8E93" style={styles.searchIcon} strokeWidth={2} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        returnKeyType="search"
        clearButtonMode="never"
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearButton}
        >
          <X size={14} color="#8E8E93" strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    ...theme.typography.bodyMedium,
    fontSize: 17,
    color: '#FFFFFF',
    height: '100%',
    padding: 0,
  },
  clearButton: {
    padding: 2,
  },
});
