
import React from 'react';

export const PASTEL_COLORS = [
  '#FFADAD', // Red
  '#FFD6A5', // Orange
  '#FDFFB6', // Yellow
  '#CAFFBF', // Green
  '#9BF6FF', // Blue
  '#A0C4FF', // Periwinkle
  '#BDB2FF', // Purple
  '#FFC6FF', // Pink
];

export const CATEGORIES = [
  'Reguler',
  'ENG',
  'Built In',
  'Insert-an',
  'Other'
];

export const CATEGORY_STYLES: Record<string, string> = {
  'Reguler': 'from-blue-50 to-indigo-50 border-blue-100 text-blue-600',
  'ENG': 'from-purple-50 to-fuchsia-50 border-purple-100 text-purple-600',
  'Built In': 'from-amber-50 to-orange-50 border-amber-100 text-amber-600',
  'Insert-an': 'from-emerald-50 to-teal-50 border-emerald-100 text-emerald-600',
  'Other': 'from-rose-50 to-pink-50 border-rose-100 text-rose-600',
};

export const CATEGORY_CHART_COLORS: Record<string, string> = {
  'Reguler': '#818CF8', // Indigo
  'ENG': '#A78BFA',    // Purple
  'Built In': '#FBBF24', // Amber
  'Insert-an': '#34D399', // Emerald
  'Other': '#FB7185',    // Rose
};

export const STATUS_COLORS = {
  'POTDUR & EDIT': {
    active: 'bg-green-100 text-green-700 border-green-200 ring-green-200',
    inactive: 'border-green-100 text-green-200 hover:border-green-300'
  },
  'PREVIEW': {
    active: 'bg-amber-100 text-amber-700 border-amber-200 ring-amber-200',
    inactive: 'border-amber-100 text-amber-200 hover:border-amber-300'
  },
  'SUDAH TAYANG': {
    active: 'bg-rose-100 text-rose-700 border-rose-200 ring-rose-200',
    inactive: 'border-rose-100 text-rose-200 hover:border-rose-300'
  }
};

export const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.191 9.112a1 1 0 010 1.776l-3.045 1.912-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.045-1.912a1 1 0 010-1.776l3.045-1.912 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
    </svg>
  ),
  Pencil: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
};
