import type { Container } from './types';

export const INITIAL_CONTAINERS: Container[] = [
  {
    id: 'calls',
    name: 'Places to Call / Email',
    size: 'big',
    items: [
      {
        id: 'call-1',
        text: 'Cadence Academy',
        subSteps: [],
        completed: false,
      },
      {
        id: 'call-2',
        text: 'Anthem – Brown Health Bill',
        details: 'Due date: 6/25/2026 · Amount due: $180.70 · Date of service: 5/27/2026 · Patient: Leo Figueriedo',
        subSteps: [],
        completed: false,
      },
      {
        id: 'call-3',
        text: 'Rheumatology',
        subSteps: [],
        completed: false,
      },
      {
        id: 'call-4',
        text: 'Sleep Study',
        subSteps: [],
        completed: false,
      },
      {
        id: 'call-5',
        text: 'Dr. Lasher – Hematology',
        subSteps: [],
        completed: false,
      },
    ],
  },
  {
    id: 'otelier',
    name: 'Otelier',
    size: 'big',
    items: [
      {
        id: 'sys-manager',
        text: 'System Manager redesign',
        subSteps: [
          { id: 'sm-1', text: 'AI prototype', completed: false },
          { id: 'sm-2', text: 'Usability test mockups', completed: false },
          { id: 'sm-3', text: 'Refine mocks based on feedback', completed: false },
          { id: 'sm-4', text: 'Readout presentation', completed: false },
        ],
        completed: false,
      },
      {
        id: 'onboarding',
        text: 'Onboarding',
        subSteps: [
          { id: 'ob-1', text: 'Map MCR', completed: false },
          { id: 'ob-2', text: 'Map Section L', completed: false },
          { id: 'ob-3', text: 'Map Piatt', completed: false },
          { id: 'ob-4', text: 'Map Fess Parker', completed: false },
          { id: 'ob-5', text: 'Map VAI', completed: false },
          { id: 'ob-6', text: 'Documentation', completed: false },
          { id: 'ob-7', text: 'Cross training', completed: false },
        ],
        completed: false,
      },
    ],
  },
  {
    id: 'chores',
    name: 'Chores',
    size: 'big',
    items: [],
  },
  {
    id: 'house',
    name: 'House',
    size: 'big',
    items: [],
  },
  {
    id: 'unt',
    name: 'UNT',
    size: 'medium',
    items: [],
  },
  {
    id: 'health',
    name: 'Health',
    size: 'medium',
    items: [],
  },
  {
    id: 'finances',
    name: 'Finances',
    size: 'medium',
    items: [
      {
        id: 'fin-1',
        text: 'Update auto payments from Autumn to go to Ev – Omaha, Allstate, First American, etc.',
        subSteps: [
          { id: 'fin-1-1', text: 'Review automatic payments / delete unwanted', completed: false },
        ],
        completed: false,
      },
      {
        id: 'fin-2',
        text: "Add Autumn to Evan's Chase acct",
        subSteps: [],
        completed: false,
      },
      {
        id: 'fin-3',
        text: "Close Autumn's Chase acct",
        subSteps: [],
        completed: false,
      },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    size: 'medium',
    items: [
      {
        id: 'tr-1',
        text: 'Buy NY train tickets',
        subSteps: [],
        completed: false,
      },
      {
        id: 'tr-2',
        text: 'Book NY lodging',
        subSteps: [],
        completed: false,
      },
      {
        id: 'tr-3',
        text: 'Pre-purchase NY attractions (Groupons, City Pass, etc.)',
        subSteps: [],
        completed: false,
      },
    ],
  },
];
