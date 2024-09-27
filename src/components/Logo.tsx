import React from 'react';

interface LogoProps {
  src: string;
  alt: string;
  href: string;
  label: string;
  spin?: boolean;
}

const Logo: React.FC<LogoProps> = ({ src, alt, href, label, spin }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <div className="flex flex-col items-center">
        <img
          src={src}
          className={`h-24 w-24 ${spin ? 'animate-spin-slow' : 'transition-transform duration-300 hover:scale-110'}`}
          alt={alt}
        />
        <span className="mt-2 text-center">{label}</span>
      </div>
    </a>
  );
};

export default Logo;
