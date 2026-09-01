import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import { NotesListScreen } from '../screens/NotesListScreen';
import { NoteEditorScreen } from '../screens/NoteEditorScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Stack.Screen name="NotesList" component={NotesListScreen} />
      <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
    </Stack.Navigator>
  );
};
