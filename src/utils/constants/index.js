export const FULL_STAGE_TEMPLATE = [
  { name: 'Backlog', category: 'open', order: 5 },
  { name: 'To Do', category: 'open', order: 10, isDefault: true },
  { name: 'Selected', category: 'open', order: 20 },
  { name: 'In Progress', category: 'in-progress', order: 30 },
  { name: 'In Review', category: 'in-progress', order: 40 },
  { name: 'QA Testing', category: 'in-progress', order: 50 },
  { name: 'UAT', category: 'in-progress', order: 60 },
  { name: 'Reopened', category: 'open', order: 65 },
  { name: 'Blocked', category: 'in-progress', order: 70 },
  { name: 'Done', category: 'closed', order: 80 }
];

export const MIN_STAGE_TEMPLATE = [
  { name: 'To Do', category: 'open', order: 10, isDefault: true },
  { name: 'In Progress', category: 'in-progress', order: 20 },
  { name: 'Done', category: 'closed', order: 30 }
];
