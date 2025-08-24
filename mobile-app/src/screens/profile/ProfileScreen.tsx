import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text style={styles.subtitle}>Manage your profile and settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
});

export default ProfileScreen;
