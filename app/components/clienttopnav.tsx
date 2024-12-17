'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faClipboardList, faTrophy, faCaretDown, faUser, faList, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import LoginModal from './loginmodal';
import OTPModal from './otpmodal';
import { ToastContainer } from 'react-toastify';
import Image from 'next/image';

export default function TopNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNavVisibility = () => setIsNavVisible(!isNavVisible);

  const loginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSubmit = async () => {
    setIsLoginModalOpen(false);
    setIsOTPModalOpen(true);
  };

  const handleOTPVerify = (data: { 
    user_code: string; 
    user_email: string; 
    user_campus: string; 
    user_fullname: string; 
  }) => {
    localStorage.setItem("userLogin", data.user_fullname)
    localStorage.setItem("userCode", data.user_code)
    localStorage.setItem("userCampus", data.user_campus)
    setIsOTPModalOpen(false);
    router.push('/files');
  };

  const menuItems = [
    { icon: faTrophy, text: 'Summary', href: `/` },
    { icon: faClipboardList, text: 'Events', subItems: [
        { text: 'Sports', href: '/pages/events/sports'},
        { text: 'Literary Musical', href: '/pages/events/litmus'},
      ] },
    { icon: faList, text: 'History', href: '/pages/files' },
    { icon: faUser, text: 'Login', onClick: () => {loginClick()} },
    {
      icon: isNavVisible ? faChevronUp : faChevronDown,
      text: isNavVisible ? 'Hide' : 'Show',
      onClick: toggleNavVisibility,
      className: 'ml-2'
    },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 bg-blue-900 text-white shadow-lg transition-all duration-300 ease-in-out  ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div id="main-navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                className="h-12 w-12 mr-2"
                src="/icon.png"
                alt="JRMSU Logo"
              />
              <span className="text-md font-bold">
                JRMSU University Week Summary Ranking
              </span>
            </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {menuItems.map((item, index) => (
                  <div key={item.text} className={`relative group ${item.className || ''}`}>
                    {!item.subItems ? (
                      item.href ? (
                        <Link href={item.href} passHref>
                          <motion.div
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                              pathname === item.href ? 'bg-blue-700' : 'hover:bg-blue-800'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FontAwesomeIcon icon={item.icon} className="mr-2" />
                            <span>{item.text}</span>
                          </motion.div>
                        </Link>
                      ) : (
                        <motion.button
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={item.onClick}
                        >
                          <FontAwesomeIcon icon={item.icon} className="mr-2" />
                          <span>{item.text}</span>
                        </motion.button>
                      )
                    ) : (
                      <div>
                        <motion.div
                          className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleDropdown}
                        >
                          <FontAwesomeIcon icon={item.icon} className="mr-2" />
                          <span>{item.text}</span>
                          <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
                        </motion.div>
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                            >
                              <div className="py-1">
                                {item.subItems.map((subItem, subIndex) => (
                                  <Link key={subIndex} href={subItem.href} passHref>
                                    <motion.div
                                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                        pathname === subItem.href ? 'bg-gray-100' : ''
                                      }`}
                                      whileHover={{ backgroundColor: '#f3f4f6' }}
                                      onClick={() => setIsDropdownOpen(false)}
                                    >
                                      {subItem.text}
                                    </motion.div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:hidden">
              <motion.button
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none"
                onClick={toggleMobileMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {menuItems.map((item) => (
                  <div key={item.text}>
                    {!item.subItems ? (
                      item.href ? (
                        <Link href={item.href} passHref>
                          <motion.div
                            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                              pathname === item.href ? 'bg-blue-700' : 'hover:bg-blue-800'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FontAwesomeIcon icon={item.icon} className="mr-2" />
                            <span>{item.text}</span>
                          </motion.div>
                        </Link>
                      ) : (
                        <motion.button
                          className={`flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 w-full text-left`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={item.onClick}
                        >
                          <FontAwesomeIcon icon={item.icon} className="mr-2" />
                          <span>{item.text}</span>
                        </motion.button>
                      )
                    ) : (
                      <div>
                        <motion.div
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800 cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleDropdown}
                        >
                          <FontAwesomeIcon icon={item.icon} className="mr-2" />
                          <span>{item.text}</span>
                          <FontAwesomeIcon icon={faCaretDown} className="ml-auto" />
                        </motion.div>
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="ml-4 mt-2 space-y-2"
                            >
                              {item.subItems.map((subItem, subIndex) => (
                                <Link key={subIndex} href={subItem.href} passHref>
                                  <motion.div
                                    className={`px-3 py-2 rounded-md text-base font-medium ${
                                      pathname === subItem.href ? 'bg-blue-700' : 'hover:bg-blue-800'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {setIsDropdownOpen(false); setIsMobileMenuOpen(false)}}
                                  >
                                    {subItem.text}
                                  </motion.div>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className={`${isNavVisible ? 'mb-20' : 'mb-4'}`}></div>

      {!isNavVisible && (
        <motion.button
          className="fixed top-0 transform -translate-x-1/2 bg-blue-700 text-white px-4 py-2 rounded-b-md shadow-md z-50"
          onClick={toggleNavVisibility}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
        <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
        </motion.button>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSubmit={handleLoginSubmit}  
      />
      <OTPModal 
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerify={handleOTPVerify}
      />
      <ToastContainer />
    </>
  );
}