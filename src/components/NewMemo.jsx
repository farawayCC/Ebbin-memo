import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewMemo } from '../redux/actions';
import Icon from './Icon';

export default function NewMemo({ inputRef, onCreated }) {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const create = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    dispatch(addNewMemo({ id: crypto.randomUUID(), title: title.trim(), date: Date.now() }));
    setTitle('');
    onCreated?.();
    inputRef.current.focus();
  };
  return (
    <form className="composer" onSubmit={create}>
      <div className="composer-heading"><span className="composer-spark"><Icon name="plus" /></span><label htmlFor="memo-title">What would you like to remember?</label></div>
      <textarea ref={inputRef} id="memo-title" placeholder="A thought, a quote, something you learned…" rows={2} value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && !event.nativeEvent.isComposing) create(event);
      }} />
      <div className="composer-footer">
        <span className="composer-hint"><Icon name="clock" /> First reminder in 10 minutes</span>
        <button className="primary-button" type="submit" disabled={!title.trim()} title="Save memo (Ctrl or ⌘ + Enter)">Save memo <Icon name="plus" /></button>
      </div>
    </form>
  );
}
