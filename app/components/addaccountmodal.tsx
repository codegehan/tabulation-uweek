import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

interface Account {
    user_code?: string;
    user_fullname?: string;
    user_password?: string;
    user_email?: string;
    user_campus?: string;
    filename?: string;
    date_added: string;
    added_by: string;
}

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CampusListProps {
    campus_code: string
    campus_name: string
}

export default function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
    const [userFullname, setUserFullname] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userCampus, setUserCampus] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const [campusLists, setCampusLists] = useState<CampusListProps[]>([]);

    useEffect(() => {
        const fetchCampusLists = async () => {
            const requestBody = {
                data: {
                    filename: String(localStorage.getItem('filename'))
                },
                spname: 'Select_Campus_All'
            };
            const response = await fetch('/api', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(requestBody)
            });
    
            const jsonData = await response.json();
            if(jsonData.status) {
                if(jsonData.data.result.status.toUpperCase() === "FAILED") {
                    toast.error(jsonData.data.result.message, {
                        position: "top-right",
                        autoClose: 1500,
                    });
                } else {
                    try {
                        const parsedEvents = jsonData.data.result.campus_list.map((eventStr: string) => {
                            try {
                                return JSON.parse(eventStr);
                            } catch (parseError) {
                                console.error('Error parsing individual event:', parseError);
                                return null;
                            }
                        }).filter((event: null) => event !== null);
    
                        if (Array.isArray(parsedEvents)) {
                            setCampusLists(parsedEvents);
                        } else {
                            console.error('Event list is not an array:', parsedEvents);
                            setCampusLists([]); 
                        }
                    } catch (error) {
                        console.error('Error parsing events:', error);
                        setCampusLists([]);
                    }
                }
            }
        }
        fetchCampusLists();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newAccount: Account = {
            user_code: 'AC' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            user_fullname: userFullname.toUpperCase(),
            user_campus: userCampus.toUpperCase(),
            user_email: userEmail,
            user_password: userPassword,
            filename: String(localStorage.getItem('filename')),
            date_added: new Date().toISOString(),
            added_by: String(localStorage.getItem('userLogin')) || "", // You might want to replace this with the actual admin name
        };

        const requestBody = {
            data: newAccount,
            spname: 'Update_User'
        };
        const response = await fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body:JSON.stringify(requestBody)});
        const jsonData = await response.json();
        console.log(jsonData);
        if(jsonData.status) {
            if(jsonData.data.result.status.toUpperCase() === "FAILED") {
                console.log(jsonData.data.result.message);
                toast.error(jsonData.data.result.message, { autoClose: 1500 });
            } else {
                toast.success(jsonData.data.result.message, { autoClose: 1500 });
                // onClose();
                // Reset form
                setUserFullname('');
                setUserEmail('');
                setUserCampus('');
                setUserPassword('');
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
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-blue-900">Add New Account</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="accountFullname" className="block text-sm font-medium text-gray-700">
                                    Fullname
                                </label>
                                <input
                                    type="text"
                                    id="accountFullname"
                                    value={userFullname}
                                    onChange={(e) => setUserFullname(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="accountCampus" className="block text-sm font-medium text-gray-700">
                                    Campus
                                </label>
                                <select  
                                    value={userCampus}
                                    onChange={(e) => setUserCampus(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                >
                                    <option value="">Select Campus</option>
                                    {campusLists.map((campus) => (
                                        <option key={campus.campus_name} value={campus.campus_name}>
                                            {campus.campus_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="accountEmail" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="accountEmail"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="accountPassword" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="accountPassword"
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
  
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    Add Account
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}