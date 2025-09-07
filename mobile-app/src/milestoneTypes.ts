// Milestone Types and Constants for Recovery Milestone Tracker

import { Milestone, MilestoneCategory } from './types';

// Predefined Milestone Categories
export const MILESTONE_CATEGORIES: Record<MilestoneCategory, string> = {
  early: 'Early Recovery',
  foundation: 'Foundation',
  extended: 'Extended Recovery',
  annual: 'Annual Milestones'
};

// Standard Milestones by Category
export const STANDARD_MILESTONES: Record<MilestoneCategory, Milestone[]> = {
  early: [
    { days: 1, timeUnit: 'days', label: '24 Hours', category: 'early', description: 'One day at a time' },
    { days: 30, timeUnit: 'days', label: '30 Days', category: 'early', description: '30 day milestone' },
    { days: 60, timeUnit: 'days', label: '60 Days', category: 'early', description: '60 days strong' },
    { days: 90, timeUnit: 'days', label: '90 Days', category: 'early', description: '90 day achievement' }
  ],
  foundation: [
    { days: 180, timeUnit: 'months', months: 6, label: '6 Months', category: 'foundation', description: 'Half year foundation' },
    { days: 365, timeUnit: 'years', years: 1, label: '1 Year', category: 'foundation', description: 'First year complete' },
    { days: 547, timeUnit: 'months', months: 18, label: '18 Months', category: 'foundation', description: 'Eighteen months' },
    { days: 730, timeUnit: 'years', years: 2, label: '2 Years', category: 'foundation', description: 'Two years strong' }
  ],
  extended: [
    { days: 1095, timeUnit: 'years', years: 3, label: '3 Years', category: 'extended', description: 'Three years of recovery' },
    { days: 1460, timeUnit: 'years', years: 4, label: '4 Years', category: 'extended', description: 'Four years milestone' },
    { days: 1825, timeUnit: 'years', years: 5, label: '5 Years', category: 'extended', description: 'Five years achievement' },
    { days: 2555, timeUnit: 'years', years: 7, label: '7 Years', category: 'extended', description: 'Seven years strong' }
  ],
  annual: [
    { days: 365, timeUnit: 'years', years: 1, label: '1 Year', category: 'annual', description: 'First year complete' },
    { days: 730, timeUnit: 'years', years: 2, label: '2 Years', category: 'annual', description: 'Two years strong' },
    { days: 1095, timeUnit: 'years', years: 3, label: '3 Years', category: 'annual', description: 'Three years of recovery' },
    { days: 1460, timeUnit: 'years', years: 4, label: '4 Years', category: 'annual', description: 'Four years milestone' },
    { days: 1825, timeUnit: 'years', years: 5, label: '5 Years', category: 'annual', description: 'Five years achievement' },
    { days: 2190, timeUnit: 'years', years: 6, label: '6 Years', category: 'annual', description: 'Six years strong' },
    { days: 2555, timeUnit: 'years', years: 7, label: '7 Years', category: 'annual', description: 'Seven years milestone' },
    { days: 2920, timeUnit: 'years', years: 8, label: '8 Years', category: 'annual', description: 'Eight years achievement' },
    { days: 3285, timeUnit: 'years', years: 9, label: '9 Years', category: 'annual', description: 'Nine years strong' },
    { days: 3650, timeUnit: 'years', years: 10, label: '10 Years', category: 'annual', description: 'Decade of recovery' }
  ]
};

// Milestone Calculation Functions
export const calculateDaysSince = (sobrietyDate: string): number => {
  const sobriety = new Date(sobrietyDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - sobriety.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateNextMilestone = (currentDays: number): Milestone | null => {
  const allMilestones = Object.values(STANDARD_MILESTONES).flat();
  const upcomingMilestones = allMilestones.filter(m => m.days > currentDays);
  
  if (upcomingMilestones.length === 0) return null;
  
  return upcomingMilestones.reduce((closest, milestone) => 
    milestone.days < closest.days ? milestone : closest
  );
};

export const calculateAchievedMilestones = (currentDays: number): Milestone[] => {
  const allMilestones = Object.values(STANDARD_MILESTONES).flat();
  return allMilestones.filter(m => m.days <= currentDays);
};

export const calculateProgressToNextMilestone = (currentDays: number): number => {
  const nextMilestone = calculateNextMilestone(currentDays);
  if (!nextMilestone) return 100;
  
  const previousMilestone = Object.values(STANDARD_MILESTONES)
    .flat()
    .filter(m => m.days < nextMilestone.days)
    .reduce((latest, milestone) => 
      milestone.days > latest.days ? milestone : latest, 
      { days: 0 } as Milestone
    );
  
  const totalRange = nextMilestone.days - previousMilestone.days;
  const progress = currentDays - previousMilestone.days;
  
  return Math.min(100, Math.max(0, (progress / totalRange) * 100));
};

// Milestone Achievement Messages
export const getMilestoneMessage = (milestone: Milestone): string => {
  const messages: Record<MilestoneCategory, string[]> = {
    early: [
      "Every day is a victory!",
      "You're building a strong foundation.",
      "One day at a time, you're doing it!",
      "Your strength is inspiring.",
      "Keep going, you've got this!"
    ],
    foundation: [
      "You're creating a new life!",
      "Your foundation is solid.",
      "You're proving that recovery is possible.",
      "Your journey inspires others.",
      "You're building something beautiful."
    ],
    extended: [
      "You're a beacon of hope.",
      "Your experience, strength, and hope help others.",
      "You're living proof that recovery works.",
      "Your resilience is remarkable.",
      "You're making a difference in the world."
    ],
    annual: [
      "Another year of freedom!",
      "You're writing a new story.",
      "Your courage continues to inspire.",
      "You're living the life you deserve.",
      "Your recovery is a gift to others."
    ]
  };
  
  const categoryMessages = messages[milestone.category];
  const randomIndex = Math.floor(Math.random() * categoryMessages.length);
  return categoryMessages[randomIndex];
};

// Get milestone display text based on time unit
export const getMilestoneDisplayText = (milestone: Milestone): string => {
  switch (milestone.timeUnit) {
    case 'days':
      return `${milestone.days} Days`;
    case 'months':
      return `${milestone.months} Months`;
    case 'years':
      return `${milestone.years} Years`;
    default:
      return milestone.label;
  }
};

// Milestone Icons
export const getMilestoneIcon = (milestone: Milestone): string => {
  const icons: Record<MilestoneCategory, string[]> = {
    early: ['🌱', '⭐', '💪', '🎯', '🚀'],
    foundation: ['🏗️', '🌳', '🏔️', '🛡️', '⚡'],
    extended: ['🌟', '🏆', '💎', '👑', '🎖️'],
    annual: ['🎉', '🏅', '💫', '✨', '🎊']
  };
  
  const categoryIcons = icons[milestone.category];
  const index = (milestone.days % categoryIcons.length);
  return categoryIcons[index];
};

// Custom Milestone Creation
export interface CustomMilestone extends Milestone {
  isCustom: true;
  userId: string;
  color?: string;
}

export const createCustomMilestone = (
  days: number,
  label: string,
  userId: string,
  description?: string,
  color?: string
): CustomMilestone => ({
  days,
  timeUnit: 'days', // Default to days for custom milestones
  label,
  category: 'early', // Default category for custom milestones
  description,
  isCustom: true,
  userId,
  color
});
