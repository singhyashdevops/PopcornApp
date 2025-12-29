import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Error() {

    const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.retryBtn}
        onPressIn={() => navigation.navigate('Home' as never)}
        activeOpacity={0.8}
      >
        <Text style={styles.retryText}>TRY AGAIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 53,
    marginBottom: 14,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },
  message: {
    color: '#a3a3a3',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 22,
    fontWeight: '500',
    lineHeight: 21,
  },
  retryBtn: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 35,
    marginTop: 0,
    shadowColor: '#E50914',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  retryText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
});
