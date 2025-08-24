import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setOnboardingComplete } from '../../store/slices/authSlice';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Track Your Recovery Journey',
    description: 'Celebrate every milestone on your path to recovery with our comprehensive tracking system.',
    icon: '🎯',
    color: COLORS.primary,
  },
  {
    id: 2,
    title: 'Connect with Friends',
    description: 'Build a supportive network of friends in recovery who understand your journey.',
    icon: '🤝',
    color: COLORS.secondary,
  },
  {
    id: 3,
    title: 'Stay Motivated',
    description: 'Receive daily encouragement and celebrate achievements with your recovery community.',
    icon: '💪',
    color: COLORS.accent,
  },
  {
    id: 4,
    title: 'Privacy First',
    description: 'Your recovery journey is personal. We prioritize your privacy and data security.',
    icon: '🔒',
    color: COLORS.success,
  },
];

const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    dispatch(setOnboardingComplete(true));
  };

  const renderSlide = (slide: OnboardingSlide) => (
    <View key={slide.id} style={styles.slide}>
      <View style={[styles.iconContainer, { backgroundColor: slide.color }]}>
        <Text style={styles.icon}>{slide.icon}</Text>
      </View>
      
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.description}>{slide.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slideIndex);
        }}
        style={styles.scrollView}
      >
        {onboardingSlides.map(renderSlide)}
      </ScrollView>

      <View style={styles.footer}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {onboardingSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    paddingHorizontal: SPACING.lg,
  },
  footer: {
    height: height * 0.3,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
    paddingBottom: SPACING.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  skipButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  skipButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default OnboardingScreen;
