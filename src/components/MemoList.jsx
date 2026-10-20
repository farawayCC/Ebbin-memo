import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { removeMemo, markReminderDelivered } from '../redux/actions';
import { checkReminders, memoId, intervals } from '../reminders.mjs';
import Icon from './Icon';

function nextReminder(memo, now) {
  const next = (memo.notifiedThrough ?? -1) + 1;
  if (next >= intervals.length) return { label: 'Schedule complete', complete: true };
  const date = new Date(Number(memo.date) + intervals[next].delay);
  const minutes = Math.ceil((date.valueOf() - now) / 60_000);
  let label;
  if (minutes <= 0) label = 'Due now';
  else if (minutes < 60) label = `In ${minutes} min`;
  else if (minutes < 24 * 60) label = `In ${Math.ceil(minutes / 60)} hr`;
  else label = `In ${Math.ceil(minutes / (24 * 60))} days`;
  return { label, date };
}

export default function MemoList({ search = '', onCreate, onClearSearch }) {
  const memos = useSelector((state) => state.memos);
  const dispatch = useDispatch();
  const store = useStore();
  const [notice, setNotice] = useState('');
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const check = () => {
      const time = Date.now();
      setNow(time);
      checkReminders(
        store.getState().memos, time,
        (body) => { setNotice(body); window.ebbinMemo?.notify(body); },
        (id, index) => dispatch(markReminderDelivered(id, index)),
      );
    };
    check();
    const timer = setInterval(check, 15_000);
    window.addEventListener('focus', check);
    return () => { clearInterval(timer); window.removeEventListener('focus', check); };
  }, [dispatch, store, memos]);

  const matching = memos.map((memo, index) => ({ memo, id: memoId(memo, index) }))
    .filter(({ memo }) => memo.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())).reverse();

  return (
    <section className="memo-list" aria-label="Saved memos">
      {notice && <div className="reminder" role="status"><span className="reminder-icon"><Icon name="clock" /></span><div><strong>A moment to remember</strong><p>{notice}</p></div><button className="icon-button" aria-label="Dismiss reminder" onClick={() => setNotice('')}><Icon name="close" /></button></div>}
      {memos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-illustration"><Icon name="notebook" /><span className="empty-leaf"><Icon name="leaf" /></span></span>
          <h3>A fresh page, a fresh thought.</h3>
          <p>Save something you’d love to remember.<br />We’ll bring it back at just the right time.</p>
          <button className="text-button" onClick={onCreate}>Write your first memo <Icon name="arrow" /></button>
        </div>
      ) : matching.length === 0 ? (
        <div className="empty-state search-empty"><span className="empty-search-icon"><Icon name="search" /></span><h3>No thoughts found.</h3><p>Try a different word, or give your search a fresh start.</p><button className="text-button" onClick={onClearSearch}>Show all memos <Icon name="arrow" /></button></div>
      ) : (
        <>
          {search.trim() && <p className="search-results" role="status">{matching.length} {matching.length === 1 ? 'memo' : 'memos'} found</p>}
          {matching.map(({ memo, id }) => {
            const delivered = Math.max(0, Math.min(7, (memo.notifiedThrough ?? -1) + 1));
            const next = nextReminder(memo, now);
            const created = new Date(memo.date);
            return (
              <article className="memo" key={id}>
                <div className="memo-topline"><span className="memo-date"><span className="memo-date-dot" /><time dateTime={created.toISOString()}>{created.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time><span className="memo-time">{created.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span></span><button className="icon-button delete" aria-label={`Delete ${memo.title}`} title="Delete memo" onClick={() => dispatch(removeMemo(id))}><Icon name="trash" /></button></div>
                <p className="memo-title">{memo.title}</p>
                <div className="memo-bottomline">
                  <span className={`next-reminder ${next.complete ? 'complete' : ''}`} title={next.date ? `Next reminder: ${next.date.toLocaleString()}` : 'All seven reminders have been sent'}><Icon name={next.complete ? 'check' : 'clock'} />{next.label}</span>
                  <div className="memo-progress" role="img" aria-label={`${delivered} of 7 reminders sent`}><span className="progress-dots" aria-hidden="true">{intervals.map((_, index) => <span key={index} className={index < delivered ? 'sent' : index === delivered ? 'next' : ''} />)}</span><span>{delivered}<span className="progress-total"> / 7</span></span></div>
                </div>
              </article>
            );
          })}
        </>
      )}
    </section>
  );
}
