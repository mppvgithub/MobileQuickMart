import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { colors } from '../content/colors';

const CategoriesScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Categories" />
      <SafeAreaView style={styles.content} edges={['bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>Browse by category</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default CategoriesScreen;

