export const STORY_CATEGORIES = [
  'Європа',
  'Азія',
  'Америка',
  'Африка',
  'Пустелі',
  'Україна',
]; // ✅ використовується в storySchema enum

export const STORIES_SORT_FIELDS = ['rate', 'date']; // ✅ використаєш у GET stories для query-параметра ?sortBy=rate

export const AUTHORS_SORT_FIELDS = ['name'];
export const SORT_ORDER_LIST = ['asc', 'desc']; // ✅ для сортування ?order=desc