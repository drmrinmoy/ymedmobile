export const PLAN_FEATURES = {
  BASIC: [
    'Access to basic medical guidelines',
    'Limited drug information',
    'Basic case reports',
    'Community access',
  ],
  GOLD: [
    'Full access to medical guidelines',
    'Complete drug database',
    'Unlimited case reports',
    'Priority community access',
    'AI-powered clinical support',
    'CME tracking',
  ],
  PLATINUM: [
    'Everything in Gold',
    'Team collaboration tools',
    'Custom guidelines library',
    'Advanced analytics',
    'Priority support',
    'Training sessions',
  ],
};

export const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential features for medical professionals',
    price: 0,
    features: PLAN_FEATURES.BASIC,
    isPopular: false,
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Advanced features for enhanced productivity',
    price: 1000,
    features: PLAN_FEATURES.GOLD,
    isPopular: true,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    description: 'Complete solution for medical teams',
    price: 2000,
    features: PLAN_FEATURES.PLATINUM,
    isPopular: false,
  },
]; 