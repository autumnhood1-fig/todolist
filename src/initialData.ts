import type { Container } from './types';

export const INITIAL_CONTAINERS: Container[] = [
  {
    id: 'otelier',
    name: 'Otelier',
    size: 'big',
    items: [
      {
        id: 'ot-fsad',
        text: 'FSAD',
        subSteps: [
          { id: 'ot-fsad-3', text: 'UX audit agent', completed: false },
          { id: 'ot-fsad-5', text: 'Install g grid', completed: false },
          { id: 'ot-fsad-6', text: 'Install minimal UI', completed: false },
          { id: 'ot-fsad-7', text: 'Apply style guides to guidelines documentation', completed: false },
        ],
        completed: false,
      },
      {
        id: 'ot-agents',
        text: 'Agents',
        subSteps: [
          { id: 'ot-agents-1', text: 'UX audit', completed: false },
          { id: 'ot-agents-2', text: 'UX needs assessment', completed: false },
          { id: 'ot-agents-3', text: 'Socialize process / debt', completed: false },
        ],
        completed: false,
      },
      {
        id: 'sys-manager',
        text: 'System Manager redesign',
        subSteps: [
          { id: 'sm-1', text: 'AI prototype', completed: false },
          { id: 'sm-5', text: 'Tree test plan', completed: false },
          { id: 'sm-3', text: 'Refine mocks', completed: false },
          { id: 'sm-4', text: 'Readout presentation', completed: false },
        ],
        completed: false,
      },
      {
        id: 'onboarding',
        text: 'Onboarding',
        subSteps: [
          { id: 'ob-1', text: 'Map MCR', completed: false },
          { id: 'ob-4', text: 'Map Fess Parker', completed: false },
          { id: 'ob-5', text: 'Map VAI (include Nick)', completed: false },
          { id: 'ob-6', text: 'Documentation', completed: false },
        ],
        completed: false,
      },
    ],
    sections: [
      {
        id: 'redesigns',
        label: 'Redesigns (for later)',
        items: [
          { id: 'rd-2', text: 'Rec' },
          { id: 'rd-1', text: 'DigiAudit' },
          { id: 'rd-3', text: 'IntelliSight audit' },
        ],
      },
    ],
  },
  {
    id: 'personal',
    name: 'Personal',
    size: 'big',
    items: [
      { id: 'per-26', text: 'Goodwill run', subSteps: [], completed: false },
      { id: 'per-hosp', text: 'Hospital bill pay', subSteps: [], completed: false },
      { id: 'per-chore-print', text: 'Daily chore print', subSteps: [], completed: false },
      { id: 'per-beach', text: 'Move beach towels', subSteps: [], completed: false },
      {
        id: 'per-1',
        text: 'Update death docs',
        subSteps: [
          { id: 'per-1-1', text: 'Claude', completed: false },
          { id: 'per-1-2', text: 'Healthcare', completed: false },
          { id: 'per-1-3', text: 'New daycares', completed: false },
          { id: 'per-1-4', text: 'New expenses', completed: false },
          { id: 'per-1-5', text: 'New bank accounts', completed: false },
          { id: 'per-1-6', text: 'Stessa', completed: false },
          { id: 'per-1-7', text: 'CC balances', completed: false },
        ],
        completed: false,
      },
      { id: 'per-3', text: 'Clean up online storage', subSteps: [], completed: false },
      { id: 'per-4', text: 'Start Xmas gifts – kids art Mixbook', subSteps: [], completed: false },
      {
        id: 'per-phone',
        text: 'Phone clean up',
        subSteps: [
          { id: 'per-phone-1', text: 'Recent bucket list saves', completed: false },
          { id: 'per-phone-2', text: 'Book lists', completed: false },
          { id: 'per-phone-3', text: 'Photo library', completed: false },
          { id: 'per-phone-4', text: 'Screenshots & IG saves / follows', completed: false },
          { id: 'per-phone-5', text: 'Photos to saved album', completed: false },
        ],
        completed: false,
      },
      {
        id: 'per-7',
        text: 'Skincare routine',
        subSteps: [
          { id: 'per-7-1', text: 'Determine routine', completed: false },
          { id: 'per-7-2', text: 'Products', completed: false },
          { id: 'per-7-3', text: 'Print routine', completed: false },
        ],
        completed: false,
      },
      {
        id: 'per-8',
        text: 'Minimals phone',
        subSteps: [
          { id: 'per-8-1', text: 'Charge phone', completed: false },
          { id: 'per-8-2', text: 'Tutorial', completed: false },
        ],
        completed: false,
      },
      { id: 'per-17', text: 'Baba veterinarian', subSteps: [], completed: false },
      { id: 'per-18', text: 'Mechanic', subSteps: [], completed: false },
      { id: 'per-10', text: 'Robo vac schedule', subSteps: [], completed: false },
      { id: 'per-11', text: 'Video doorbell', subSteps: [], completed: false },
      { id: 'per-12', text: 'Car registration appt', subSteps: [], completed: false },
      { id: 'per-allstate', text: 'Call Allstate (2)', subSteps: [], completed: false },
      { id: 'per-13', text: 'Organize playroom', subSteps: [], completed: false },
      { id: 'per-16', text: 'Cord management', subSteps: [], completed: false },
      { id: 'per-firestick', text: 'Firestick', subSteps: [], completed: false },
      { id: 'per-20', text: 'Move guitar', subSteps: [], completed: false },
      { id: 'per-21', text: 'Keyboard plug', subSteps: [], completed: false },
      { id: 'per-ea', text: 'E&A curtain', subSteps: [], completed: false },
      { id: 'per-guest', text: 'Guest room – organize closet / drawers', subSteps: [], completed: false },
      {
        id: 'per-bike',
        text: 'Bike readiness',
        subSteps: [
          { id: 'per-bike-1', text: 'Auggie seat install', completed: false },
          { id: 'per-bike-2', text: 'Leo bars install', completed: false },
          { id: 'per-bike-3', text: 'Auggie helmet', completed: false },
          { id: 'per-bike-4', text: 'Phone mount install', completed: false },
          { id: 'per-bike-5', text: 'Add photos to shared album', completed: false },
        ],
        completed: false,
      },
    ],
  },
  {
    id: 'health',
    name: 'Health',
    size: 'medium',
    items: [
      { id: 'hlth-sleep', text: 'Sleep study', subSteps: [], completed: false },
      {
        id: 'hlth-1',
        text: 'Recipe library – build easy recipe library from IG',
        subSteps: [
          { id: 'hlth-1-1', text: 'Figure out how Claude can support', completed: false },
          { id: 'hlth-1-2', text: 'Find one or two recipes from Instagram and add', completed: false },
        ],
        completed: false,
      },
      {
        id: 'hlth-2',
        text: 'Glucose monitoring',
        subSteps: [
          { id: 'hlth-2-1', text: 'Review gmail', completed: false },
          { id: 'hlth-2-2', text: 'Equipment', completed: false },
          { id: 'hlth-2-3', text: 'Print out', completed: false },
        ],
        completed: false,
      },
      { id: 'hlth-3', text: 'Print simple IG workout & mobility routine', subSteps: [], completed: false },
      {
        id: 'hlth-4',
        text: 'Autoimmune / chronic conditions from IG',
        subSteps: [
          { id: 'hlth-4-1', text: 'Import into Claude', completed: false },
          { id: 'hlth-4-2', text: 'Look into comorbidities', completed: false },
        ],
        completed: false,
      },
    ],
  },
  {
    id: 'kids',
    name: 'Kids',
    size: 'medium',
    items: [
      { id: 'kids-1', text: "Write Leo's teacher", subSteps: [], completed: false },
      { id: 'kids-2', text: "Leo's next appt on calendar", subSteps: [], completed: false },
      { id: 'kids-3', text: "Boys' dentist appts on calendar", subSteps: [], completed: false },
      { id: 'kids-4', text: 'Gymnastics research', subSteps: [], completed: false },
      { id: 'kids-5', text: 'Auggie meeting street', subSteps: [], completed: false },
      { id: 'kids-trump', text: 'Trump account registration', subSteps: [], completed: false },
    ],
  },
  {
    id: 'unt',
    name: 'UNT',
    size: 'medium',
    items: [
      { id: 'unt-1', text: "Read Teagan's articles", subSteps: [], completed: false },
      { id: 'unt-2', text: 'Add checklist items here', subSteps: [], completed: false },
      { id: 'unt-3', text: 'Memo grading web app', subSteps: [], completed: false },
      { id: 'unt-8', text: 'Add Director video', subSteps: [], completed: false },
      { id: 'unt-4', text: 'Memo video assignments', subSteps: [], completed: false },
      { id: 'unt-7', text: 'Lucero email', subSteps: [], completed: false },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    size: 'medium',
    items: [
      {
        id: 'tr-nyc',
        text: 'NYC',
        subSteps: [
          { id: 'tr-nyc-1', text: 'Train tickets', completed: false },
          { id: 'tr-nyc-2', text: 'Lodging', completed: false },
          { id: 'tr-nyc-3', text: 'Attractions', completed: false },
        ],
        completed: false,
      },
      { id: 'tr-tx', text: 'TX Oct tickets', subSteps: [], completed: false },
      { id: 'tr-mom', text: 'Mom Oct tickets', subSteps: [], completed: false },
      {
        id: 'tr-girls',
        text: 'Autumn girls trip tickets & childcare',
        subSteps: [
          { id: 'tr-girls-1', text: 'Dates on calendar', completed: false },
          { id: 'tr-girls-2', text: 'Child arrangements', completed: false },
          { id: 'tr-girls-3', text: 'Flights', completed: false },
        ],
        completed: false,
      },
      { id: 'tr-aa', text: 'AA / Delta – update address and info', subSteps: [], completed: false },
    ],
  },
  {
    id: 'to-buy',
    name: 'To Buy',
    size: 'medium',
    items: [
      { id: 'buy-9', text: 'Grapes', subSteps: [], completed: false },
    ],
  },
  {
    id: 'finances',
    name: 'Finances',
    size: 'medium',
    items: [
      {
        id: 'fin-1',
        text: 'Update auto payments',
        subSteps: [
          { id: 'fin-1-1', text: 'Review automatic payments / delete unwanted', completed: false },
        ],
        completed: false,
      },
      { id: 'fin-2', text: "Add Autumn to Evan's Chase acct", subSteps: [], completed: false },
      { id: 'fin-5', text: 'Activate Santander card', subSteps: [], completed: false },
    ],
  },
  {
    id: 'writing',
    name: 'Writing',
    size: 'medium',
    items: [
      { id: 'writ-1', text: 'Write first draft of Armadillo', subSteps: [], completed: false },
    ],
  },
];
