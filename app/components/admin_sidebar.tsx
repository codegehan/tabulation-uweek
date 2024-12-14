'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faTrophy, faCaretDown, faCaretUp, faPowerOff, faUser, faFile, faArrowLeft, faAdd, faPlusCircle, faBuilding } from '@fortawesome/free-solid-svg-icons';

export default function AdminSideBarNavigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    // Clear all items from localStorage
    localStorage.clear();
    // Redirect to login page (adjust the path as needed)
    router.push('/');
  };

  const menuItemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  const menuItems = [
    // { icon: faHome, text: 'Dashboard', href: '/admin' },
    { icon: faClipboardList, text: 'Events', href: `/admin/pages/events` },
    { icon: faClipboardList, text: 'Awards', subItems: [
      { text: 'Sports', href: '/admin/pages/awards/sports' },
      { text: 'Literay Musical', href: '/admin/pages/awards/litmus' },
    ] },
    { icon: faBuilding, text: 'Campus', href: `/admin/pages/campus` },
    { icon: faFile, text: 'Files', href: `/files` },
    { icon: faFile, text: 'Logs', href: `/admin/pages/logs` },
    { icon: faUser, text: 'Account', href: `/admin/pages/account` },
    { icon: faPowerOff, text: 'Logout', href: '#', action: handleLogout },
  ];

  return (
    <nav className="bg-blue-900 text-white w-64 min-h-screen p-4 fixed left-0 top-0 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <motion.li key={item.text} variants={menuItemVariants}>
            {!item.subItems ? (
              <Link 
                href={item.href} 
                passHref
                onClick={(e) => {
                  if (item.action) {
                    e.preventDefault();
                    item.action();
                  }
                }}
              >
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
                  <FontAwesomeIcon icon={isDropdownOpen ? faCaretUp : faCaretDown} className="ml-auto" />
                </motion.div>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.ul
                      className="ml-6 mt-2 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <motion.li key={subIndex}>
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
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}