export default function Logo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="14" height="20" rx="2.5" className="fill-accent-soft stroke-accent" strokeWidth="1.4" />
      <path d="M7.5 8h6M7.5 11.5h6M7.5 15h3.5" stroke="currentColor" className="text-accent" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15 6l4.5 4.5" className="stroke-accent" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="20" cy="11" r="2.2" className="fill-paper stroke-accent" strokeWidth="1.4" />
    </svg>
  );
}
