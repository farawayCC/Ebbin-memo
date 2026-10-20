import { memoId } from '../../reminders.mjs';

export default function memos(state = [], action) {
  switch (action.type) {
    case 'ADD_NEW_MEMO': return [...state, action.payload];
    case 'REMOVE_MEMO': return state.filter((memo, index) => memoId(memo, index) !== action.payload.id);
    case 'MARK_REMINDER_DELIVERED':
      return state.map((memo, index) => memoId(memo, index) === action.payload.id
        ? { ...memo, notifiedThrough: Math.max(memo.notifiedThrough ?? -1, action.payload.index) }
        : memo);
    default: return state;
  }
};
