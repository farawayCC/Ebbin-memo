export const addNewMemo = (memo) => ({ type: 'ADD_NEW_MEMO', payload: memo });
export const removeMemo = (id) => ({ type: 'REMOVE_MEMO', payload: { id } });
export const markReminderDelivered = (id, index) => ({
  type: 'MARK_REMINDER_DELIVERED', payload: { id, index },
});
