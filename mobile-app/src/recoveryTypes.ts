// Recovery Types and Constants for Recovery Milestone Tracker

import { RecoveryType, Fellowship } from './types';

// Recovery Type Information
export interface RecoveryTypeInfo {
  type: RecoveryType;
  label: string;
  description: string;
  fellowships: Fellowship[];
  resources: RecoveryResource[];
}

export interface RecoveryResource {
  name: string;
  type: 'website' | 'phone' | 'app' | 'meeting';
  url?: string;
  phone?: string;
  description: string;
}

// Fellowship Information
export interface FellowshipInfo {
  fellowship: Fellowship;
  fullName: string;
  description: string;
  website: string;
  phone: string;
  meetingFinder: string;
  literature: string[];
  steps: number;
  traditions: number;
  concepts: number;
}

// Recovery Type Definitions
export const RECOVERY_TYPES: Record<RecoveryType, RecoveryTypeInfo> = {
  Alcoholism: {
    type: 'Alcoholism',
    label: 'Alcohol Addiction',
    description: 'Recovery from alcohol addiction and alcoholism',
    fellowships: ['AA', 'Other'],
    resources: [
      {
        name: 'Alcoholics Anonymous',
        type: 'website',
        url: 'https://www.aa.org',
        description: 'Worldwide fellowship of men and women who have had a drinking problem'
      },
      {
        name: 'SAMHSA National Helpline',
        type: 'phone',
        phone: '1-800-662-HELP',
        description: 'Treatment referral and information service'
      }
    ]
  },
  Drug_Addiction: {
    type: 'Drug_Addiction',
    label: 'Drug Addiction',
    description: 'Recovery from drug addiction and substance use disorders',
    fellowships: ['NA', 'AA', 'Other'],
    resources: [
      {
        name: 'Narcotics Anonymous',
        type: 'website',
        url: 'https://www.na.org',
        description: 'International fellowship of recovering addicts'
      },
      {
        name: 'SAMHSA National Helpline',
        type: 'phone',
        phone: '1-800-662-HELP',
        description: 'Treatment referral and information service'
      }
    ]
  },
  Gambling: {
    type: 'Gambling',
    label: 'Gambling Addiction',
    description: 'Recovery from gambling addiction and compulsive gambling',
    fellowships: ['GA', 'Other'],
    resources: [
      {
        name: 'Gamblers Anonymous',
        type: 'website',
        url: 'https://www.gamblersanonymous.org',
        description: 'Fellowship of men and women who share their experience, strength and hope'
      },
      {
        name: 'National Problem Gambling Helpline',
        type: 'phone',
        phone: '1-800-522-4700',
        description: '24/7 confidential helpline for problem gambling'
      }
    ]
  },
  Other: {
    type: 'Other',
    label: 'Other Addictions',
    description: 'Recovery from other types of addiction and compulsive behaviors',
    fellowships: ['CA', 'MA', 'HA', 'SA', 'Other'],
    resources: [
      {
        name: 'SAMHSA National Helpline',
        type: 'phone',
        phone: '1-800-662-HELP',
        description: 'Treatment referral and information service'
      }
    ]
  }
};

// Fellowship Definitions
export const FELLOWSHIPS: Record<Fellowship, FellowshipInfo> = {
  AA: {
    fellowship: 'AA',
    fullName: 'Alcoholics Anonymous',
    description: 'A worldwide fellowship of men and women who have had a drinking problem',
    website: 'https://www.aa.org',
    phone: '1-212-870-3400',
    meetingFinder: 'https://www.aa.org/find-aa',
    literature: [
      'Big Book',
      'Twelve Steps and Twelve Traditions',
      'Daily Reflections',
      'Living Sober'
    ],
    steps: 12,
    traditions: 12,
    concepts: 12
  },
  NA: {
    fellowship: 'NA',
    fullName: 'Narcotics Anonymous',
    description: 'An international fellowship of recovering addicts',
    website: 'https://www.na.org',
    phone: '1-818-773-9999',
    meetingFinder: 'https://www.na.org/meetingsearch/',
    literature: [
      'Basic Text',
      'It Works: How and Why',
      'Just for Today',
      'Living Clean'
    ],
    steps: 12,
    traditions: 12,
    concepts: 12
  },
  GA: {
    fellowship: 'GA',
    fullName: 'Gamblers Anonymous',
    description: 'A fellowship of men and women who share their experience, strength and hope',
    website: 'https://www.gamblersanonymous.org',
    phone: '1-213-386-8789',
    meetingFinder: 'https://www.gamblersanonymous.org/ga/meetings',
    literature: [
      'Combo Book',
      'Twenty Questions',
      'Sharing Through Our Stories',
      'A New Beginning'
    ],
    steps: 12,
    traditions: 12,
    concepts: 12
  },
  CA: {
    fellowship: 'CA',
    fullName: 'Cocaine Anonymous',
    description: 'A fellowship of men and women who share their experience, strength and hope',
    website: 'https://ca.org',
    phone: '1-310-559-5833',
    meetingFinder: 'https://ca.org/meetings/',
    literature: [
      'Hope, Faith & Courage',
      'Twelve Steps and Twelve Traditions',
      'Daily Meditations',
      'A Program of Recovery'
    ],
    steps: 12,
    traditions: 12,
    concepts: 12
  },
  MA: {
    fellowship: 'MA',
    fullName: 'Marijuana Anonymous',
    description: 'A fellowship of men and women who share their experience, strength and hope',
    website: 'https://www.marijuana-anonymous.org',
    phone: '1-800-766-6779',
    meetingFinder: 'https://www.marijuana-anonymous.org/meetings/',
    literature: [
      'Life with Hope',
      'Twelve Steps and Twelve Traditions',
      'Daily Meditations',
      'A Basic Text'
    ],
    steps: 12,
    traditions: 12,
    concepts: 12
  },
  HA: {
    fellowship: 'HA',
    fullName: 'Heroin Anonymous',
    description: 'A fellowship of men and women who share their experience, strength and hope',
    website: 'https://heroin-anonymous.org',
    phone: '1-855-437-4626',
    meetingFinder: 'https://heroin-anonymous.org/meetings/',
    literature: [
      'Our Recovery',
      'Twelve Steps and Twelve Traditions',
      'Daily Meditations',
      'A Basic Text'
    ],
    steps: 12,
    traditions: 12,
    concepts: 12
  },
  SA: {
    fellowship: 'SA',
    fullName: 'Sexaholics Anonymous',
    description: 'A fellowship of men and women who share their experience, strength and hope',
    website: 'https://www.sa.org',
    phone: '1-866-424-8777',
    meetingFinder: 'https://www.sa.org/meetings/',
    literature: [
      'Sexaholics Anonymous',
      'Twelve Steps and Twelve Traditions',
      'Daily Meditations',
      'A Basic Text'
    ],
    steps: 12,
    traditions: 12,
    concepts: 12
  },
  Other: {
    fellowship: 'Other',
    fullName: 'Other Fellowship',
    description: 'Other recovery fellowship or support group',
    website: '',
    phone: '',
    meetingFinder: '',
    literature: [],
    steps: 12,
    traditions: 12,
    concepts: 12
  }
};

// Recovery Statistics and Information
export interface RecoveryStats {
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalYears: number;
  nextMilestone?: {
    days: number;
    label: string;
    daysRemaining: number;
  };
  achievements: {
    milestones: number;
    longestStreak: number;
    currentStreak: number;
  };
}

// Recovery Tools and Resources
export interface RecoveryTool {
  name: string;
  type: 'meditation' | 'journaling' | 'exercise' | 'therapy' | 'sponsorship' | 'service';
  description: string;
  benefits: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed';
}

export const RECOVERY_TOOLS: RecoveryTool[] = [
  {
    name: 'Daily Meditation',
    type: 'meditation',
    description: 'Practice mindfulness and spiritual connection',
    benefits: ['Reduces stress', 'Improves focus', 'Enhances spiritual connection'],
    frequency: 'daily'
  },
  {
    name: 'Gratitude Journaling',
    type: 'journaling',
    description: 'Write down things you are grateful for each day',
    benefits: ['Improves mood', 'Increases positivity', 'Builds resilience'],
    frequency: 'daily'
  },
  {
    name: 'Physical Exercise',
    type: 'exercise',
    description: 'Regular physical activity to support mental health',
    benefits: ['Reduces anxiety', 'Improves sleep', 'Boosts mood'],
    frequency: 'daily'
  },
  {
    name: 'Therapy Sessions',
    type: 'therapy',
    description: 'Professional counseling and support',
    benefits: ['Addresses underlying issues', 'Provides coping strategies', 'Supports healing'],
    frequency: 'weekly'
  },
  {
    name: 'Sponsorship',
    type: 'sponsorship',
    description: 'Work with a sponsor through the 12 steps',
    benefits: ['Provides guidance', 'Offers accountability', 'Shares experience'],
    frequency: 'weekly'
  },
  {
    name: 'Service Work',
    type: 'service',
    description: 'Help others in recovery',
    benefits: ['Strengthens recovery', 'Builds community', 'Provides purpose'],
    frequency: 'weekly'
  }
];

// Crisis Resources
export const CRISIS_RESOURCES = [
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 crisis support',
    type: 'crisis'
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: '24/7 crisis support via text',
    type: 'crisis'
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-HELP',
    description: 'Treatment referral and information',
    type: 'treatment'
  }
];
