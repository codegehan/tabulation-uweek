'use client';

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencilAlt, faCheck, faTimes, faSearch, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AddEventModal from "../../../components/addeventmodal";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface Event {
    event_name?: string;
    event_type?: string;
    event_manager?: string;
    event_venue?: string;
    event_code?: string;
    filename?: string;
    date_added: string;
    added_by: string;
}

export default function AdminEventPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(10);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEventsData = async () => {
        setIsLoading(true)
        const requestBody = {
            data: {
                filename: String(localStorage.getItem('filename'))
            },
            spname: 'Select_Event_All'
        };
        const response = await fetch('/api', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(requestBody)
        });

        const jsonData = await response.json();
        if(jsonData.status) {
            if(jsonData.data.result.status.toUpperCase() === "FAILED") {
                setEvents([]); 
                console.log(jsonData.data.result.message)
            } else {
                try {
                    const parsedEvents = jsonData.data.result.event_list.map((eventStr: string) => {
                        try {
                            return JSON.parse(eventStr);
                        } catch (parseError) {
                            console.error('Error parsing individual event:', parseError);
                            return null;
                        }
                    }).filter((event: null) => event !== null);

                    if (Array.isArray(parsedEvents)) {
                        setEvents(parsedEvents);
                    } else {
                        console.error('Event list is not an array:', parsedEvents);
                        setEvents([]); 
                    }
                } catch (error) {
                    console.error('Error parsing events:', error);
                    setEvents([]);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    const updateEvent = async (updatedEvent: Event) => {
        try {
            const transformedData: Event = {
                ...updatedEvent,
                event_name: updatedEvent.event_name?.toUpperCase(),
                event_type: updatedEvent.event_type?.toUpperCase(),
                event_manager: updatedEvent.event_manager?.toUpperCase(),
                event_venue: updatedEvent.event_venue?.toUpperCase(),
                filename: String(localStorage.getItem('filename')),
                added_by: String(localStorage.getItem('userLogin')),
                date_added: new Date().toISOString()
            }
            const requestBody = {
                data: transformedData,
                spname: 'Update_Event',
            };
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            const jsonData = await response.json();
            if(jsonData.status && jsonData.data.result.status.toUpperCase() === "SUCCESS") {
                toast.success(jsonData.data.result.message);
                fetchEventsData();
                setEditingEvent(null);
            } else {
                toast.error(jsonData.data.result.message || "Failed to update event");
            }
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error("An error occurred while updating the event");
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchEventsData();
        }
    }, [isModalOpen]);

    useEffect(() => {
        fetchEventsData();
    }, []);

    const filteredEvents = events.filter(event => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (event.event_name?.toLowerCase().includes(searchLower) || false) ||
            (event.event_type?.toLowerCase().includes(searchLower) || false) ||
            (event.event_manager?.toLowerCase().includes(searchLower) || false) ||
            (event.event_venue?.toLowerCase().includes(searchLower) || false) ||
            (event.added_by?.toLowerCase().includes(searchLower) || false)
        );
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleEditChange = (field: keyof Event, value: string) => {
        if (editingEvent) {
            setEditingEvent({
                ...editingEvent,
                [field]: value
            });
        }
    };

    return (
        <motion.div 
            className="container mx-auto px-4 py-8"
            initial= {{ opacity: 0 }}
            animate= {{ opacity: 1  }}
            exit= {{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            >
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Event
                </button>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="text-sm min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Event Name</th>
                            <th className="py-3 px-4 text-center">Type</th>
                            <th className="py-3 px-4 text-center">Manager</th>
                            <th className="py-3 px-4 text-center">Venue</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="border p-4 text-center">
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                                <span className="ml-2">Fetching events...</span>
                            </div>
                            </td>
                        </tr>
                        ) : currentEvents.length > 0 ? (
                        currentEvents.map((event, index) => (
                            <tr key={event.event_code} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            {editingEvent && editingEvent.event_code === event.event_code ? (
                                <>
                                <td className="py-3 px-4">
                                    <input 
                                    type="text" 
                                    value={editingEvent.event_name} 
                                    onChange={(e) => handleEditChange('event_name', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                    />
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <select  
                                    value={editingEvent.event_type}  
                                    onChange={(e) => handleEditChange('event_type', e.target.value)} 
                                    className="w-full border rounded px-2 py-1" 
                                    >
                                    <option value="">Select Event Type</option>
                                    <option value="SPORTS">SPORTS</option>
                                    <option value="LITMUS">LITMUS</option>
                                    </select>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <input 
                                    type="text" 
                                    value={editingEvent.event_manager} 
                                    onChange={(e) => handleEditChange('event_manager', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                    />
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <input 
                                    type="text" 
                                    value={editingEvent.event_venue} 
                                    onChange={(e) => handleEditChange('event_venue', e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                    />
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex justify-center space-x-2">
                                    <button 
                                        onClick={() => updateEvent(editingEvent)}
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button 
                                        onClick={() => setEditingEvent(null)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                    </div>
                                </td>
                                </>
                            ) : (
                                <>
                                <td className="py-3 px-4">{event.event_name || 'NA'}</td>
                                <td className="py-3 px-4 text-center">{event.event_type || 'NA'}</td>
                                <td className="py-3 px-4 text-center">{event.event_manager || 'NA'}</td>
                                <td className="py-3 px-4 text-center">{event.event_venue || 'NA'}</td>
                                <td className="py-3 px-4 text-center">
                                    <button 
                                    onClick={() => setEditingEvent(event)}
                                    className="text-blue-500 hover:text-blue-700"
                                    >
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>
                                </td>
                                </>
                            )}
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan={5} className="py-3 px-4 text-center">No events found</td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination component remains the same */}
            <div className="mt-4 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <span className="sr-only">Previous</span>
                        <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === index + 1
                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === Math.ceil(filteredEvents.length / eventsPerPage)}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <span className="sr-only">Next</span>
                        <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" aria-hidden="true" />
                    </button>
                </nav>
            </div>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </motion.div>
    );
}