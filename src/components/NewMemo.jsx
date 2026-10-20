import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewMemo } from '../redux/actions';

export default function NewMemo() {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const create = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    dispatch(addNewMemo({ id: crypto.randomUUID(), title: title.trim(), date: Date.now() }));
    setTitle('');
  };
  return (
    <form className="new-memo" onSubmit={create}>
      <label htmlFor="memo-title">What would you like to remember?</label>
      <div className="input-row">
        <input id="memo-title" placeholder="Add new memo" value={title} onChange={(event) => setTitle(event.target.value)} />
        <button type="submit" disabled={!title.trim()}>Create</button>
      </div>
    </form>
  );
}
