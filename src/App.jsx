import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import NewMemo from './components/NewMemo';
import MemoList from './components/MemoList';
import Icon from './components/Icon';
import { intervals } from './reminders.mjs';

export default function App() {
  const count = useSelector((state) => state.memos.length);
  const [search, setSearch] = useState('');
  const composer = useRef(null);
  const guide = useRef(null);
  const focusComposer = () => {
    setSearch('');
    composer.current.focus();
    composer.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Notebook navigation">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setSearch(''); }} aria-label="Ebbin Memo home">
          <span className="brand-mark"><Icon name="leaf" /></span>
          <span>ebbin<span className="brand-dot">.</span></span>
        </a>
        <div className="sidebar-main">
          <p className="nav-caption">YOUR SPACE</p>
          <button className="nav-item active" onClick={() => setSearch('')}>
            <Icon name="notebook" /><span>All memos</span><span className="nav-count">{count}</span>
          </button>
          <button className="nav-item" aria-label="New memo" onClick={focusComposer}>
            <Icon name="plus" /><span>New memo</span>
          </button>
        </div>
        <div className="sidebar-bottom">
          <div className="growth-drawing" aria-hidden="true">
            <svg viewBox="0 0 160 116" fill="none">
              <path d="M18 100h124" stroke="currentColor" opacity=".22" />
              <path d="M78 100V57c0-13 8-24 21-31" stroke="currentColor" strokeWidth="2" />
              <path d="M79 70C55 74 43 60 43 41c21-1 38 9 36 29Z" fill="#8fae8c" />
              <path d="M80 55c-1-24 14-37 36-36 0 24-14 38-36 36Z" fill="#c3d0a6" />
              <path d="m79 70-23-17m24 2 24-23" stroke="#254d3b" strokeWidth="1.5" />
              <circle cx="40" cy="22" r="3" fill="#dca77e" />
              <path d="M126 70v10m-5-5h10" stroke="#dca77e" strokeWidth="1.5" />
              <path d="M64 101c0-8 7-14 15-14s15 6 15 14" stroke="currentColor" opacity=".35" />
            </svg>
          </div>
          <p className="sidebar-quote">Small notes.<br />Lasting knowledge.</p>
          <p className="sidebar-description">Give your thoughts a little<br className="desktop-break" /> room to grow.</p>
          <button className="guide-link" onClick={() => guide.current.showModal()}>How it works <Icon name="arrow" className="guide-arrow" /><Icon name="info" className="guide-info-icon" /></button>
          <div className="privacy-note"><Icon name="lock" /> Kept on this device</div>
        </div>
      </aside>

      <main className="workspace">
        <header className="workspace-topbar"><span>Your personal memory space</span><span className="local-badge"><span /> Saved locally</span></header>
        <div className="workspace-content">
          <header className="page-heading">
            <p className="eyebrow">A LITTLE, OFTEN</p>
            <h1>Good thoughts<br />deserve to <em>stay.</em></h1>
            <p>Capture what matters. Let repetition do the rest.</p>
          </header>
          <NewMemo inputRef={composer} onCreated={() => setSearch('')} />
          <div className="notebook-toolbar">
            <div className="notebook-title"><h2>Your notebook</h2><span>{count}</span></div>
            <div className="search-field">
              <Icon name="search" />
              <input type="search" aria-label="Search memos" placeholder="Find a thought…" value={search} onChange={(event) => setSearch(event.target.value)} />
              {search && <button className="icon-button" aria-label="Clear search" onClick={() => setSearch('')}><Icon name="close" /></button>}
            </div>
          </div>
          <MemoList search={search} onCreate={focusComposer} onClearSearch={() => setSearch('')} />
          <footer className="workspace-footer"><span className="footer-line" /><Icon name="leaf" /><span>A little repetition goes a long way.</span><span className="footer-line" /></footer>
        </div>
      </main>

      <dialog ref={guide} className="guide-dialog" aria-labelledby="guide-title" onClick={(event) => { if (event.target === guide.current) guide.current.close(); }}>
        <button className="icon-button dialog-close" aria-label="Close guide" onClick={() => guide.current.close()}><Icon name="close" /></button>
        <span className="guide-icon"><Icon name="leaf" /></span>
        <p className="eyebrow">THE RHYTHM OF REMEMBERING</p>
        <h2 id="guide-title">Come back to a thought.<br /><em>Keep a little more.</em></h2>
        <p>Ebbin gently brings your memos back at seven spaced intervals, so you can take a moment to recall them.</p>
        <ol className="interval-list">{intervals.map(({ label }, index) => <li key={label}><span>{index + 1}</span>{label}</li>)}</ol>
        <p className="guide-footnote">Keep Ebbin running in the tray for reminders. If you’re away, we’ll catch up when you return. The dots on each memo track reminders sent.</p>
        <button className="primary-button guide-done" onClick={() => guide.current.close()}>Got it <Icon name="check" /></button>
      </dialog>
    </div>
  );
}
