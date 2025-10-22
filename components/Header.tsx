
import React from 'react';

const StethoscopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3"/>
    <path d="M6.6 4.2c0 1-.6 2.3-1.4 3.1-1 1-1.7 2.3-1.7 3.5 0 2.6 2.1 4.7 4.7 4.7h.3c2.6 0 4.7-2.1 4.7-4.7 0-1.2-.7-2.5-1.7-3.5-1-1-1.4-2.2-1.4-3.2"/>
    <path d="M18.8 2.3a.3.3 0 1 0 .2-.3.3.3 0 0 0-.2.3"/>
    <path d="M17.4 4.2c0 1 .6 2.3 1.4 3.1 1 1 1.7 2.3 1.7 3.5 0 2.6-2.1 4.7-4.7 4.7h-.3c-2.6 0-4.7-2.1-4.7-4.7 0-1.2.7-2.5 1.7-3.5 1-1 1.4-2.2 1.4-3.2"/>
    <path d="M14.8 11.2c0 1.4-1.2 2.6-2.6 2.6s-2.6-1.2-2.6-2.6"/>
    <path d="M12.2 13.8v7.6a.6.6 0 0 1-.6.6h0a.6.6 0 0 1-.6-.6v-7.6"/>
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <StethoscopeIcon className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">AI Skin Disease Analyzer</h1>
      </div>
    </header>
  );
};
