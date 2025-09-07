// Recovery Types and Constants for Recovery Milestone Tracker

import { Program, RecoveryType } from './types';

// Recovery Type Information
export interface RecoveryTypeInfo {
  type: RecoveryType;
  label: string;
  description: string;
  programs: Program[];
  resources: RecoveryResource[];
}

export interface RecoveryResource {
  name: string;
  type: 'website' | 'phone' | 'app' | 'meeting';
  url?: string;
  phone?: string;
  description: string;
}

// Program Information
export interface ProgramInfo {
  program: Program;
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
    programs: ['AA', 'Unaffiliated', 'Other'],
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
    programs: ['NA', 'AA', 'CA', 'MA', 'HA', 'Unaffiliated', 'Other'],
    resources: [
      {
        name: 'Narcotics Anonymous',
        type: 'website',
        url: 'https://www.na.org',
        description: 'International fellowship of recovering addicts'
      },
      {
        name: 'Cocaine Anonymous',
        type: 'website',
        url: 'https://ca.org',
        description: 'Fellowship of men and women who share their experience, strength and hope'
      },
      {
        name: 'Marijuana Anonymous',
        type: 'website',
        url: 'https://www.marijuana-anonymous.org',
        description: 'Fellowship of men and women who share their experience, strength and hope'
      },
      {
        name: 'Heroin Anonymous',
        type: 'website',
        url: 'https://heroin-anonymous.org',
        description: 'Fellowship of men and women who share their experience, strength and hope'
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
    programs: ['GA', 'Unaffiliated', 'Other'],
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
  Sex_Addiction: {
    type: 'Sex_Addiction',
    label: 'Sex Addiction',
    description: 'Recovery from sex addiction and compulsive sexual behavior',
    programs: ['SA', 'Unaffiliated', 'Other'],
    resources: [
      {
        name: 'Sexaholics Anonymous',
        type: 'website',
        url: 'https://www.sa.org',
        description: 'Fellowship of men and women who share their experience, strength and hope'
      },
      {
        name: 'Sex Addicts Anonymous',
        type: 'website',
        url: 'https://saa-recovery.org',
        description: 'Fellowship of men and women who share their experience, strength and hope'
      },
      {
        name: 'SAMHSA National Helpline',
        type: 'phone',
        phone: '1-800-662-HELP',
        description: 'Treatment referral and information service'
      }
    ]
  },
  Food_Addiction: {
    type: 'Food_Addiction',
    label: 'Food Addiction',
    description: 'Recovery from food addiction and compulsive eating behaviors',
    programs: ['Unaffiliated', 'Other'],
    resources: [
      {
        name: 'Overeaters Anonymous',
        type: 'website',
        url: 'https://oa.org',
        description: 'Fellowship of men and women who share their experience, strength and hope'
      },
      {
        name: 'Food Addicts Anonymous',
        type: 'website',
        url: 'https://foodaddictsanonymous.org',
        description: 'Fellowship of men and women who share their experience, strength and hope'
      },
      {
        name: 'SAMHSA National Helpline',
        type: 'phone',
        phone: '1-800-662-HELP',
        description: 'Treatment referral and information service'
      }
    ]
  },
  Undisclosed: {
    type: 'Undisclosed',
    label: 'Undisclosed',
    description: 'Recovery journey details are kept private',
    programs: ['Unaffiliated', 'Other'],
    resources: [
      {
        name: 'SAMHSA National Helpline',
        type: 'phone',
        phone: '1-800-662-HELP',
        description: 'Treatment referral and information service'
      }
    ]
  },
  Other: {
    type: 'Other',
    label: 'Other Addictions',
    description: 'Recovery from other types of addiction and compulsive behaviors',
    programs: ['CA', 'MA', 'HA', 'SA', 'Unaffiliated', 'Other'],
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

// Program Definitions
export const PROGRAMS: Record<Program, ProgramInfo> = {
  AA: {
    program: 'AA',
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
    program: 'NA',
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
    program: 'GA',
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
    program: 'CA',
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
    program: 'MA',
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
    program: 'HA',
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
    program: 'SA',
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
  Unaffiliated: {
    program: 'Unaffiliated',
    fullName: 'Unaffiliated',
    description: 'Recovery without formal program affiliation',
    website: '',
    phone: '',
    meetingFinder: '',
    literature: [],
    steps: 0,
    traditions: 0,
    concepts: 0
  },
  Other: {
    program: 'Other',
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
