import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { removeMemo, markReminderDelivered } from '../redux/actions';
import { checkReminders, memoId } from '../reminders.mjs';


export default function MemoList() {
  const memos = useSelector((state) => state.memos);
  const dispatch = useDispatch();
  const store = useStore();
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const check = () => checkReminders(
      store.getState().memos,
      Date.now(),
      (body) => { setNotice(body); window.ebbinMemo?.notify(body); },
      (id, index) => dispatch(markReminderDelivered(id, index)),
    );
    check();
    // A short recurring check handles sleep/resume and intervals beyond the timer limit.
    const timer = setInterval(check, 15_000);
    window.addEventListener('focus', check);
    return () => { clearInterval(timer); window.removeEventListener('focus', check); };
  }, [dispatch, store, memos]);

  return (
    <section className="memo-list" aria-label="Saved memos">
      {notice && <div className="reminder" role="status">Time to repeat: {notice}</div>}
      {memos.length === 0 && <p className="empty">Add something you want to remember.</p>}
      {memos.map((memo, index) => ({ memo, id: memoId(memo, index) })).reverse().map(({ memo, id }) => (
        <article className="memo" key={id}>
          <div>
            <p className="memo-title">{memo.title}</p>
            <time dateTime={new Date(memo.date).toISOString()}>{new Date(memo.date).toLocaleString()}</time>
          </div>
          <button className="delete" aria-label={`Delete ${memo.title}`} onClick={() => dispatch(removeMemo(id))}>Delete</button>
        </article>
      ))}
    </section>
  );
}
