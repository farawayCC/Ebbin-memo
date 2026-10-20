import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intervals, dueReminder, checkReminders, memoId } from '../src/reminders.mjs';
import reducer from '../src/redux/reducers/memos.mjs';
const memo = { id: 'one', title: 'Learn something', date: 1000 };

test('each of the seven intervals becomes due at its boundary', () => {
  intervals.forEach(({ delay }, index) => {
    assert.equal(dueReminder({ ...memo, notifiedThrough: index - 1 }, memo.date + delay - 1), null);
    assert.equal(dueReminder({ ...memo, notifiedThrough: index - 1 }, memo.date + delay).index, index);
  });
});
test('the four-month reminder works beyond the setTimeout limit', () => {
  assert.ok(intervals[6].delay > 2147483647);
  assert.equal(dueReminder({ ...memo, notifiedThrough: 5 }, memo.date + intervals[6].delay).index, 6);
});
test('restart catches up with one reminder and records delivery', () => {
  let state = [memo];
  const delivered = [];
  const check = () => checkReminders(state, memo.date + intervals[4].delay, (body) => delivered.push(body),
    (id, index) => { state = reducer(state, { type: 'MARK_REMINDER_DELIVERED', payload: { id, index } }); });
  check();
  state = JSON.parse(JSON.stringify(state));
  check();
  assert.deepEqual(delivered, ['Learn something (5 days)']);
  assert.equal(state[0].notifiedThrough, 4);
});
test('legacy memos remain readable and get catch-up reminders', () => {
  const old = { title: 'Existing memo', date: 1000 };
  assert.equal(dueReminder(old, 601000).index, 0);
  assert.match(memoId(old, 0), /^legacy:/);
});
test('deletion removes only the selected duplicate and leaves state untouched', () => {
  const original = [memo, { ...memo, id: 'two' }];
  assert.deepEqual(reducer(original, { type: 'REMOVE_MEMO', payload: { id: 'one' } }), [original[1]]);
  assert.equal(original.length, 2);
});
test('legacy duplicates can be deleted individually', () => {
  const original = [{ title: 'same', date: 1000 }, { title: 'same', date: 1000 }];
  assert.equal(reducer(original, { type: 'REMOVE_MEMO', payload: { id: memoId(original[0], 0) } }).length, 1);
});
test('deleted memos do not produce reminders', () => {
  const state = reducer([memo], { type: 'REMOVE_MEMO', payload: { id: 'one' } });
  checkReminders(state, Number.MAX_SAFE_INTEGER, () => assert.fail('Unexpected reminder'), () => assert.fail());
});
