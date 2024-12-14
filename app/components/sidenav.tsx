'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faHome, faClipboardList, faTrophy, faCaretDown } from '@fortawesome/free-solid-svg-icons';

export default function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const menuItemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  const menuItems = [
    { icon: faTrophy, text: 'Summary', href: `/pages/summary` },
    { icon: faClipboardList, text: 'Events', subItems: [
        { text: 'Sports', href: '/pages/events/sports' },
        { text: 'Literay Musical', href: '/pages/events/litmus' },
      ] },
    { icon: faHome, text: 'Home', href: '/' },
  ];

  return (
    <>
      <motion.button
        className="fixed top-4 left-4 z-30 p-2 bg-blue-900 text-white rounded-md"
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </motion.button>

      <motion.nav
        className="fixed top-0 left-0 bottom-0 w-64 bg-blue-900 text-white z-20 shadow-lg"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, type: 'tween' }}
      >
        <div className="p-4 mt-16">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <motion.li key={item.text} variants={menuItemVariants}>
                {!item.subItems ? (
                  <Link href={item.href ?? '#'} passHref>
                    <motion.div
                      className={`flex items-center p-2 rounded-md ${
                        pathname === item.href ? 'bg-blue-700' : 'hover:bg-blue-800'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FontAwesomeIcon icon={item.icon} className="mr-4 text-lg" />
                      <span>{item.text}</span>
                    </motion.div>
                  </Link>
                ) : (
                  <div>
                    <motion.div
                      className="flex items-center p-2 rounded-md hover:bg-blue-800 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleDropdown}
                    >
                      <FontAwesomeIcon icon={item.icon} className="mr-4 text-lg" />
                      <span>{item.text}</span>
                      <FontAwesomeIcon icon={faCaretDown} className="ml-auto" />
                    </motion.div>
                    {isDropdownOpen && (
                      <ul className="ml-6 mt-2 space-y-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <motion.li key={subIndex}
                          initial={{ opacity: 0, height: 0}}
                          animate={{ opacity: 1, height: 'auto'}}
                          exit={{opacity: 0, height: 0}}
                          transition={{ duration: 0.3 }}
                          >
                            <Link href={subItem.href} passHref>
                              <motion.div
                                className={`p-2 rounded-md hover:bg-blue-700 ${
                                  pathname === subItem.href ? 'bg-blue-700' : ''
                                }`}
                              >
                                {subItem.text}
                              </motion.div>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.nav>

      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}