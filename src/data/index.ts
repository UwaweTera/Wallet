export const categories = [
    { id: 1, label: 'Food & Dining' },
    { id: 2, label: 'Transportation' },
    { id: 3, label: 'Shopping' },
    { id: 4, label: 'Health & Fitness' },
    { id: 5, label: 'Entertainment' },
    { id: 6, label: 'Travel' },
    { id: 7, label: 'Utilities' },
    { id: 8, label: 'Other' }
] as const;

export type Category = typeof categories[number];
