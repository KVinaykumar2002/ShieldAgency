import React from 'react';

interface MailButtonProps {
  email?: string;
  subject?: string;
  body?: string;
}

const MailButton: React.FC<MailButtonProps> = ({ 
  email = 'shieldagency01@gmail.com',
  subject = 'Inquiry about Shield Agency Services',
  body = 'Hello, I would like to know more about Shield Agency services.'
}) => {
  const handleMailClick = () => {
    // Encode email parameters for URL
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    // Open default email client with pre-filled email
    const mailtoUrl = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoUrl;
  };

  return (
    <button
      onClick={handleMailClick}
      className="group relative w-14 h-14 sm:w-16 sm:h-16 bg-[#EA4335] rounded-full shadow-2xl hover:shadow-[#EA4335]/50 transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer mt-2 sm:mt-3"
      aria-label="Contact us via Email"
      title="Send us an email"
    >
        {/* Pulse animation effect - outer ring */}
        <span className="absolute inset-0 rounded-full bg-[#EA4335] animate-ping opacity-20"></span>
        
        {/* Mail Icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white relative z-10 sm:w-8 sm:h-8"
        >
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <polyline
            points="22,6 12,13 2,6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>
  );
};

export default MailButton;

