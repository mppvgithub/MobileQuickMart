import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { colors } from '../content/colors';

const CartScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Cart" />
      <SafeAreaView style={styles.content} edges={['bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Cart</Text>
          <Text style={styles.subtitle}>Your shopping cart</Text>
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

export default CartScreen;

