const minute = 60 * 1000;
const day = 24 * 60 * minute;
const intervals = [
  { delay: 10 * minute, label: '10 minutes' },
  { delay: 60 * minute, label: '1 hour' },
  { delay: 5 * 60 * minute, label: '5 hours' },
  { delay: day, label: '1 day' },
  { delay: 5 * day, label: '5 days' },
  { delay: 25 * day, label: '25 days' },
  { delay: 120 * day, label: '4 months' },
];

// Legacy memos have no ID. Use their persisted position to distinguish equal titles/dates.
function memoId(memo, index) {
  return memo.id ?? `legacy:${memo.date}:${index}`;
}

function dueReminder(memo, now) {
  const start = Number(memo.date);
  if (!Number.isFinite(start)) return null;
  let due = null;
  intervals.forEach((interval, index) => {
    if (start + interval.delay <= now && index > (memo.notifiedThrough ?? -1)) {
      due = { ...interval, index };
    }
  });
  return due;
}

function checkReminders(memos, now, deliver, markDelivered) {
  memos.forEach((memo, index) => {
    const due = dueReminder(memo, now);
    if (!due) return;
    deliver(`${memo.title} (${due.label})`);
    markDelivered(memoId(memo, index), due.index);
  });
}

export { intervals, memoId, dueReminder, checkReminders };
