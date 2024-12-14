'use client';

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: {
    user_code: string;
    user_email: string;
    user_campus: string;
    user_fullname: string;
  }) => void;
}

export default function OTPModal({ isOpen, onClose, onVerify }: OTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const [isLoading, setIsLoading] = useState(false);
  const [isResend, setIsResend] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleClose = () => {
    // Reset OTP inputs when closing
    setOtp(['', '', '', '', '', '']);
    onClose();
  };

  const sendOtp = async () => {
    setIsResend(true);
    const email = localStorage.getItem('userEmail');
    const password = localStorage.getItem('userPassword');
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
      } else {
        const otpCode = jsonData.data.result.otp;
        const otpRequestBody = { email: email, message: otpCode }
        try {
          const response = await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(otpRequestBody),
          });
          const responseData = await response.json();
          if (response.ok) {
            toast.success('Successfully resend OTP code!', { autoClose: 1500 });
          } else {
            // Handle error if the email was not sent
            console.error('Error sending OTP email:', responseData.error);
          }
        } catch (error) {
          console.error('Error:', error);
        } finally { 
          setIsResend(false);
        }
      };
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const otpString = otp.join('');
    if (otpString.length === 6) {
        e.preventDefault();
        try {
          const requestBody = {
            data: {
              user_email: localStorage.getItem('userEmail'),
              user_password: localStorage.getItem('userPassword'),
              otp: otpString
            },
            spname: 'Verify_Otp'
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
                setOtp(['', '', '', '', '', '']);
              } else {
                const userDetails = JSON.parse(jsonData.data.result.user_details);
                onVerify(userDetails);
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userPassword');
                onClose();
            };
          };
        } catch (error) {
          console.log(error); //
          toast.error("Error occured during request.", { autoClose: 1500 });
        } finally {
          setIsLoading(false);
        }
    }
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
              
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-bold text-blue-900">OTP Verification</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
              </motion.button>
            </div>
            <p className="text-sm text-gray-600 mb-4">We have sent a code to you email. Please check before it expires.</p>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  />
                ))}
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
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </motion.button>
              <motion.button
                whileHover={!isResend ? { scale: 1.05 } : {}}
                whileTap={!isResend ? { scale: 0.95 } : {}}
                disabled={isResend}
                type="button"
                onClick={sendOtp}
                className={`
                   text-blue-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full underline underline-offset-8 cursor-pointer text-sm
                  ${isResend ? 'opacity-50 cursor-not-allowed' : ''}
                  flex items-center justify-center mt-2 
                `}
              >
                {isResend ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  'Resend OTP'
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}