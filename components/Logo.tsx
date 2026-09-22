export default function Logo() {
  return (
    <span className="inline-flex items-center justify-center">
      <svg
        width="24"
        height="20"
        viewBox="0 0 35 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="transition-transform duration-200 hover:scale-105"
      >
        <defs>
          <linearGradient id="metaGrad" x1="2" y1="6" x2="33" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0064E0" />
            <stop offset="45%" stopColor="#6D5EF0" />
            <stop offset="80%" stopColor="#9C8CFF" />
            <stop offset="100%" stopColor="#00B4D8" />
          </linearGradient>
        </defs>
        <path
          d="M8.8 6C5 6 2 9.2 2 13.5C2 17.8 5.2 21 9 21C12.8 21 15.6 17.4 17.5 14.8C19.4 17.4 22.2 21 26 21C29.8 21 33 17.8 33 13.5C33 9.2 30 6 26.2 6C22.4 6 19.5 9.4 17.5 12.2C15.5 9.4 12.6 6 8.8 6ZM8.9 9.6C11.1 9.6 13.4 11.8 15 14.1C13.3 16.6 11.2 17.4 9 17.4C7 17.4 5.5 15.7 5.5 13.5C5.5 11.3 6.9 9.6 8.9 9.6ZM26.1 9.6C28.1 9.6 29.5 11.3 29.5 13.5C29.5 15.7 28 17.4 26 17.4C23.8 17.4 21.7 16.6 20 14.1C21.6 11.8 23.9 9.6 26.1 9.6Z"
          fill="url(#metaGrad)"
        />
      </svg>
    </span>
  );
}

