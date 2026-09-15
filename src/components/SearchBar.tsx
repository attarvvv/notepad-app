import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';

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
    <View className="flex-row items-center bg-[#1C1C1E] rounded-[10px] px-2.5 h-[38px]">
      <Search size={17} color="#8E8E93" className="mr-1.5" strokeWidth={2} />
      <TextInput
        className="flex-1 text-[17px] text-white h-full p-0"
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
          className="p-0.5"
        >
          <X size={14} color="#8E8E93" strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
};
