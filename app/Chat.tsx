import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme as useDeviceColorScheme, View } from 'react-native';
import { BottomBar } from '../components/BottomBar';
import { Colors } from '../constants/Colors';
import { LanguageContext } from './_layout';

const NOTE_KEY = 'NOTEPAD_NOTES';

export default function Chat() {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [fullScreen, setFullScreen] = useState(false);
  const [fullScreenNote, setFullScreenNote] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [fontSize, setFontSize] = useState(18);
  const [showUndo, setShowUndo] = useState(false);
  const [deletedNote, setDeletedNote] = useState<string | null>(null);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const undoTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deviceColorScheme = useDeviceColorScheme();
  const [themeChoice, setThemeChoice] = useState<'light' | 'dark' | 'system'>('system');
  const colorScheme = themeChoice === 'system' ? (deviceColorScheme ?? 'light') : themeChoice;
  const themeColors = Colors[colorScheme];
  const { language, setLanguage, t } = useContext(LanguageContext);

  useEffect(() => {
    (async () => {
      const notes = await AsyncStorage.getItem(NOTE_KEY);
      setSavedNotes(notes ? JSON.parse(notes) : []);
      const storedFontSize = await AsyncStorage.getItem('NOTEPAD_FONT_SIZE');
      if (storedFontSize) setFontSize(Number(storedFontSize));
      const storedTheme = await AsyncStorage.getItem('NOTEPAD_THEME');
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') setThemeChoice(storedTheme);
    })();
    return () => {
      if (undoTimeout.current) clearTimeout(undoTimeout.current);
    };
  }, []);

  const increaseFontSize = async () => {
    const newSize = Math.min(fontSize + 2, 48);
    setFontSize(newSize);
    await AsyncStorage.setItem('NOTEPAD_FONT_SIZE', String(newSize));
  };
  const decreaseFontSize = async () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    await AsyncStorage.setItem('NOTEPAD_FONT_SIZE', String(newSize));
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    const updated = [note, ...savedNotes];
    setSavedNotes(updated);
    setNote('');
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(updated));
  };

  const deleteNote = async (index: number) => {
    setDeletedNote(savedNotes[index]);
    setDeletedIndex(index);
    setShowUndo(true);
    const updated = savedNotes.filter((_, i) => i !== index);
    setSavedNotes(updated);
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(updated));
    if (undoTimeout.current) clearTimeout(undoTimeout.current);
    undoTimeout.current = setTimeout(() => {
      setShowUndo(false);
      setDeletedNote(null);
      setDeletedIndex(null);
    }, 5000);
  };

  const handleUndo = async () => {
    if (deletedNote !== null && deletedIndex !== null) {
      const updated = [...savedNotes];
      updated.splice(deletedIndex, 0, deletedNote);
      setSavedNotes(updated);
      await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(updated));
    }
    setShowUndo(false);
    setDeletedNote(null);
    setDeletedIndex(null);
    if (undoTimeout.current) clearTimeout(undoTimeout.current);
  };

  const startEditNote = (index: number) => {
    setEditIndex(index);
    setEditText(savedNotes[index]);
  };

  const saveEditNote = async () => {
    if (editIndex === null) return;
    const updated = savedNotes.map((n, i) => (i === editIndex ? editText : n));
    setSavedNotes(updated);
    await AsyncStorage.setItem(NOTE_KEY, JSON.stringify(updated));
    setEditIndex(null);
    setEditText('');
  };

  const cancelEditNote = () => {
    setEditIndex(null);
    setEditText('');
  };

  const setTheme = async (choice: 'light' | 'dark' | 'system') => {
    setThemeChoice(choice);
    await AsyncStorage.setItem('NOTEPAD_THEME', choice);
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {fullScreen && fullScreenNote ? (
        <View style={styles.fullScreenContainer}>
          <Text style={[styles.fullScreenText, { color: themeColors.tint, fontSize: fontSize + 16 }]}>{fullScreenNote}</Text>
          <TouchableOpacity style={styles.fullScreenSoundBtn} onPress={() => { if (fullScreenNote) Speech.speak(fullScreenNote); }}>
            <Text style={styles.fullScreenSoundBtnText}>{t('sound')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fullScreenBackBtn} onPress={() => { setFullScreen(false); setFullScreenNote(null); }}>
            <Text style={styles.fullScreenBackBtnText}>{t('back')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: themeColors.tint }]}>{t('notepad')}</Text>
            <View style={{ position: 'absolute', right: 20, top: 0, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setLanguage('en')} style={{ marginRight: 8, padding: 6, backgroundColor: language === 'en' ? '#fff' : '#eee', borderRadius: 8 }}>
                <Text style={{ color: language === 'en' ? '#1e90ff' : '#333', fontWeight: 'bold' }}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLanguage('ms')} style={{ padding: 6, backgroundColor: language === 'ms' ? '#fff' : '#eee', borderRadius: 8 }}>
                <Text style={{ color: language === 'ms' ? '#1e90ff' : '#333', fontWeight: 'bold' }}>BM</Text>
              </TouchableOpacity>
            </View>
          </View>
          {savedNotes[0] && (
            <View style={styles.largeNoteContainer}>
              <Text style={[styles.largeNoteText, { color: themeColors.text, fontSize }]}>{savedNotes[0]}</Text>
              <TouchableOpacity style={styles.showFullBtn} onPress={() => { setFullScreen(true); setFullScreenNote(savedNotes[0]); }}>
                <Text style={styles.showFullBtnText}>{t('showFullScreen')}</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.notepad}>
            <TextInput
              style={[styles.textInput, { color: themeColors.text, backgroundColor: themeColors.background, borderColor: colorScheme === 'dark' ? '#333' : '#eee', fontSize: 32 }]}
              multiline
              placeholder={t('writeNote')}
              placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
              <Text style={styles.saveBtnText}>{t('saveNote')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
            <TouchableOpacity style={[styles.themeBtn, themeChoice === 'light' && styles.themeBtnActive]} onPress={() => setTheme('light')}>
              <Text style={[styles.themeBtnText, themeChoice === 'light' && styles.themeBtnTextActive]}>{t('light')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeBtn, themeChoice === 'dark' && styles.themeBtnActive]} onPress={() => setTheme('dark')}>
              <Text style={[styles.themeBtnText, themeChoice === 'dark' && styles.themeBtnTextActive]}>{t('dark')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeBtn, themeChoice === 'system' && styles.themeBtnActive]} onPress={() => setTheme('system')}>
              <Text style={[styles.themeBtnText, themeChoice === 'system' && styles.themeBtnTextActive]}>{t('system')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
            <TouchableOpacity style={styles.fontBtn} onPress={decreaseFontSize}><Text style={styles.fontBtnText}>A-</Text></TouchableOpacity>
            <Text style={{ marginHorizontal: 8, color: themeColors.text, fontSize: 16 }}>{t('fontSize')}</Text>
            <TouchableOpacity style={styles.fontBtn} onPress={increaseFontSize}><Text style={styles.fontBtnText}>A+</Text></TouchableOpacity>
          </View>
          <ScrollView style={styles.savedArea}>
            {savedNotes.map((n, i) => (
              <View key={i} style={styles.savedNote}>
                <Text style={{ flex: 1, color: themeColors.text, fontSize }}>{n}</Text>
                <TouchableOpacity style={styles.showBtn} onPress={() => { setFullScreen(true); setFullScreenNote(n); }}>
                  <Text style={styles.showBtnText}>{t('showFullScreen')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editBtn} onPress={() => startEditNote(i)}>
                  <Text style={styles.editBtnText}>{t('edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteNote(i)}>
                  <Text style={styles.deleteBtnText}>{t('delete')}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <Modal visible={editIndex !== null} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t('edit')}</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  value={editText}
                  onChangeText={setEditText}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveEditNote}>
                    <Text style={styles.saveBtnText}>{t('saveNote')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={cancelEditNote}>
                    <Text style={styles.deleteBtnText}>{t('cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {showUndo && (
            <View style={[styles.undoBanner, { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' }]}> 
              <Text style={{ color: themeColors.text, flex: 1 }}>{t('noteDeleted')}</Text>
              <TouchableOpacity onPress={handleUndo} style={styles.undoBtn}>
                <Text style={styles.undoBtnText}>{t('undo')}</Text>
              </TouchableOpacity>
            </View>
          )}
          <BottomBar active="chat" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e90ff',
    fontStyle: 'italic',
  },
  notepad: {
    backgroundColor: '#fffde7',
    borderRadius: 16,
    margin: 16,
    padding: 12,
    minHeight: 180,
    elevation: 2,
  },
  textInput: {
    minHeight: 100,
    fontSize: 18,
    color: '#222',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  saveBtn: {
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  savedArea: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 70,
  },
  savedNote: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  largeNoteContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  largeNoteText: {
    fontSize: 32,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  showFullBtn: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginTop: 10,
  },
  showFullBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fullScreenText: {
    fontSize: 48,
    color: '#1e90ff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fullScreenBackBtn: {
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 32,
  },
  fullScreenBackBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  showBtn: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  showBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fullScreenSoundBtn: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  fullScreenSoundBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
  },
  editBtn: {
    backgroundColor: '#ffb300',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e90ff',
    textAlign: 'center',
  },
  fontBtn: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginHorizontal: 2,
  },
  fontBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  undoBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 4,
  },
  undoBtn: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 18,
    marginLeft: 10,
  },
  undoBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeBtn: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  themeBtnActive: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  themeBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeBtnTextActive: {
    color: '#fff',
  },
}); 