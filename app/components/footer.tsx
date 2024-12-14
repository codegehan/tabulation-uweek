import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-blue-900 text-white py-2">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm">
        © {currentYear} Creatives Committee, CoderStation, codeGehan, duduyMayo, markLAN . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;