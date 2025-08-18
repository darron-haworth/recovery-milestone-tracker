import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../shared/constants';

interface LoadingScreenProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  showSpinner?: boolean;
}

const { width, height } = Dimensions.get('window');

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  size = 'large',
  color = COLORS.primary,
  showSpinner = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showSpinner && (
          <ActivityIndicator
            size={size}
            color={color}
            style={styles.spinner}
          />
        )}
        
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: SPACING.lg,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
    opacity: 0.3,
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 0.4,
  },
});

export default LoadingScreen;
