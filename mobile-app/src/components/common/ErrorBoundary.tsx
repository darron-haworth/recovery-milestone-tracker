import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRestart = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    
    Alert.alert(
      'Report Error',
      'Would you like to report this error to our support team?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          onPress: () => {
            // In a real app, you would open a support form or email
            const subject = encodeURIComponent('Recovery Milestone Tracker - Error Report');
            const body = encodeURIComponent(
              `Error: ${error?.message}\n\nStack: ${error?.stack}\n\nComponent Stack: ${errorInfo?.componentStack}`
            );
            
            Linking.openURL(`mailto:support@recoverymilestonetracker.com?subject=${subject}&body=${body}`);
          },
        },
      ]
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry, but something unexpected happened. This helps us improve the app.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                <Text style={styles.debugText}>{this.state.error.message}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.debugText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={this.handleRestart}
              >
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={this.handleReportError}
              >
                <Text style={styles.secondaryButtonText}>Report Error</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.helpText}>
              If this problem persists, please contact our support team.
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    marginBottom: SPACING.xl,
  },
  debugContainer: {
    backgroundColor: COLORS.grayLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    width: '100%',
  },
  debugTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  debugText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 120,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  secondaryButton: {
    backgroundColor: COLORS.grayLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  helpText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ErrorBoundary;
