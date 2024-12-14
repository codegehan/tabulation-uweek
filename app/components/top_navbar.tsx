'use client';

import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import LoginModal from "./loginmodal";
import OTPModal from "./otpmodal";
import { useRouter } from "next/navigation";

export default function TopNavigation() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const router = useRouter();

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
    
    localStorage.setItem("userFullname", data.user_fullname)
    localStorage.setItem("userCode", data.user_code)
    localStorage.setItem("userCampus", data.user_campus)
    setIsOTPModalOpen(false);
    router.push('/files');
  };

  return (
    <>
      <nav className="bg-blue-900 text-white shadow-lg px-4">
        <div className="container flex justify-between items-center py-1">
          <div className="text-xl font-semibold">
            JRMSU University Week Tabulation
          </div>
          <div>
            <motion.div
              className="cursor-pointer ml-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={loginClick}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FontAwesomeIcon icon={faRightToBracket} className="text-yellow-500" />
            </motion.div>
          </div>
        </div>
      </nav>
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