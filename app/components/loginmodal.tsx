'use client';

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function LoginModal({ isOpen, onClose, onSubmit }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const requestBody = {
      data: {
        user_email: email,
        user_password: password
      },
      spname: 'Login_User'
    };
    const response = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(requestBody)
    });
    const jsonData = await response.json();
    if(jsonData.status) {
      if(jsonData.data.result.status.toUpperCase() === "FAILED") {
          console.log(jsonData.data.result.message)
          toast.error(jsonData.data.result.message, { autoClose: 1500 });
          setIsLoading(false);
      } else {
        const otpCode = jsonData.data.result.otp;
        const otpRequestBody = { email: email, message: otpCode }
        try {
          const secret = "CCS-Creatives";
          const response = await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(otpRequestBody),
          });
          const responseData = await response.json();
          if (response.ok) {
            // Successfully sent email
            const encryptPass = CryptoJS.AES.encrypt(password, secret).toString();
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPassword', encryptPass);
            onSubmit();
            setEmail("");
            setPassword("");
            onClose();
          } else {
            // Handle error if the email was not sent
            console.error('Error sending OTP email:', responseData.error);
          }
        } catch (error) {
          console.error('Error:', error);
        } finally { 
          setIsLoading(false);
        }
      };
    };
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-lg p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Admin Login</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
              </motion.button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <div className="relative">
                    <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={togglePasswordVisibility}
                    >
                        <FontAwesomeIcon icon={showPassword ?  faEye : faEyeSlash} />
                    </button>
                </div>
              </div>
              <motion.button
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                disabled={isLoading}
                type="submit"
                className={`
                  bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}
                  flex items-center justify-center
                `}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}