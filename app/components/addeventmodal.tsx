import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

interface Event {
    event_code: string;
    event_name: string;
    event_type: string;
    event_manager: string;
    event_venue: string;
    event_file: string;
    date_added: string;
    added_by: string;
}

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
    const [eventName, setEventName] = useState('');
    const [eventManager, setEventManager] = useState('');
    const [eventVenue, setEventVenue] = useState('');
    const [eventType, setEventType] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newEvent: Event = {
            event_code: 'EC' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            event_name: eventName.toUpperCase(),
            event_type: eventType.toUpperCase(),
            event_manager: eventManager.toUpperCase(),
            event_venue: eventVenue.toUpperCase(),
            event_file: String(localStorage.getItem('filename')),
            date_added: new Date().toISOString(),
            added_by: String(localStorage.getItem('userLogin')) || "", // You might want to replace this with the actual admin name
        };

        const requestBody = {
            data: newEvent,
            spname: 'Update_Event'
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
                onClose();
                // Reset form
                setEventName('');
                setEventManager('');
                setEventVenue('');
                setEventType('');
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
                            <h2 className="text-2xl font-bold text-blue-900">Add New Event</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    id="eventName"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="eventManager" className="block text-sm font-medium text-gray-700">
                                    Event Manager
                                </label>
                                <input
                                    type="text"
                                    id="eventManager"
                                    value={eventManager}
                                    onChange={(e) => setEventManager(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="eventVenue" className="block text-sm font-medium text-gray-700">
                                    Event Venue
                                </label>
                                <input
                                    type="text"
                                    id="eventVenue"
                                    value={eventVenue}
                                    onChange={(e) => setEventVenue(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                                    Event Type
                                </label>
                                <select
                                    id="eventType"
                                    value={eventType}
                                    onChange={(e) => setEventType(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Select an event type</option>
                                    <option value="sports">Sports</option>
                                    <option value="litmus">Literary Musical</option>
                                </select>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    Add Event
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}