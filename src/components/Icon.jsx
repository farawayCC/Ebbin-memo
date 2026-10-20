import React from 'react';

const paths = {
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  notebook: <><rect x="5" y="3" width="15" height="18" rx="3" /><path d="M9 3v18M3 7h4M3 12h4M3 17h4M12 8h5M12 12h5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  trash: <><path d="M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14M10 10v6M14 10v6" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  check: <path d="m5 12 4 4L19 6" />,
  leaf: <><path d="M5 20c0-9 5-14 14-15 1 9-3 15-10 13M5 20 15 10" /><path d="M5 14c-4-1-4-5-3-8 4 1 7 3 7 6" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7v.5" /></>,
};

export default function Icon({ name, className = '', ...props }) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
