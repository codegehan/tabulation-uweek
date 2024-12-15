import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-blue-900 text-white py-2">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs">
        Developed by: Creatives Committee, 
        <a className="underline underline-offset-1 hover:text-blue-500" href="https://www.facebook.com/Z3R0W0RM5" target='_blank'>
        CoderStation
        </a>
        <a className="underline underline-offset-1 hover:text-blue-500" href="https://www.facebook.com/codeGehan" target='_blank'>
        , codeGehan
        </a>
        <a className="underline underline-offset-1 hover:text-blue-500" href="https://www.facebook.com/IMAYYUY" target='_blank'>
        , duduyMayo
        </a>
        <a className="underline underline-offset-1 hover:text-blue-500" href="https://www.facebook.com/marklan.hampac.2024" target='_blank'>
        , markLAN
        </a>
        . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;