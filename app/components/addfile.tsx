import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

interface File {
    file_name: string;
    date_added: string;
    added_by: string;
}

interface AddFileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddFileModal({ isOpen, onClose }: AddFileModalProps) {
    const [fileName, setFileName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newFile: File = {
            file_name: fileName,
            date_added: new Date().toISOString(),
            added_by: String(localStorage.getItem('userLogin')), // You might want to replace this with the actual admin name
        };

        const requestBody = {
            data: newFile,
            spname: 'Add_File'
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
            console.log()
            } else {
                toast.success(jsonData.data.result.message, { autoClose: 1500 });
                onClose();
                setFileName('');
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
                            <h2 className="text-2xl font-bold text-blue-900">Add New File</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="fileName" className="block text-sm font-medium text-gray-700">
                                    File Name
                                </label>
                                <input
                                    type="text"
                                    id="fileName"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    Add File
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}