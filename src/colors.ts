export interface ContainerColor {
  bg: string;     // header background tint
  accent: string; // border, checked states, badges
  text: string;   // header name color
}

const DEFAULT: ContainerColor = { bg: '#f8fafc', accent: '#64748b', text: '#334155' };

const MAP: Record<string, ContainerColor> = {
  calls:    { bg: '#eff6ff', accent: '#3b82f6', text: '#1e40af' }, // sky blue
  otelier:  { bg: '#faf5ff', accent: '#9333ea', text: '#6b21a8' }, // grape purple
  chores:   { bg: '#fff7ed', accent: '#f97316', text: '#c2410c' }, // orange
  personal: { bg: '#ede9fe', accent: '#8b5cf6', text: '#5b21b6' }, // lilac/violet
  health:   { bg: '#fdf2f8', accent: '#ec4899', text: '#9d174d' }, // pink
  unt:      { bg: '#f0fdf4', accent: '#22c55e', text: '#15803d' }, // green
  finances: { bg: '#ecfdf5', accent: '#059669', text: '#065f46' }, // dark emerald
  travel:   { bg: '#f8fafc', accent: '#64748b', text: '#334155' }, // slate gray
  'to-buy': { bg: '#fef3c7', accent: '#d97706', text: '#92400e' }, // warm amber
  writing:  { bg: '#eef2ff', accent: '#6366f1', text: '#3730a3' }, // indigo
  kids:          { bg: '#fefce8', accent: '#eab308', text: '#713f12' }, // sunny yellow
  'deep-cleaning': { bg: '#f0fdfa', accent: '#14b8a6', text: '#0f766e' }, // teal
};

export function getColor(id: string): ContainerColor {
  return MAP[id] ?? DEFAULT;
}
