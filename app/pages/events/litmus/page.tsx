'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import LoadingIndicator from "@/app/components/loadingindicator";

interface LitmusListProps {
    event_code: string
    event_name: string
    event_manager: string
    event_venue: string
}

export default function LitmusPage() {
    const [litmusLists, setLitmusLists] = useState<LitmusListProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(8);

    useEffect(() => {
        const fetchLitmusLists = async () => {
            setIsLoading(true);
            const requestBody = {
                data: {
                    event_type: "LITMUS",
                    filename: String(localStorage.getItem('filename'))
                },
                spname: 'Select_Event_By_Type'
            }; 
            
            const response = await fetch('/api', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(requestBody)
            });
            const jsonData = await response.json();
            if(jsonData.status) {
                if(jsonData.data.result.status.toUpperCase() === "FAILED") {
                    console.log(jsonData.data.result.message);
                    setIsLoading(false);
                } else {
                    try {
                        console.log(jsonData.data.result)
                        const parsedEvents = jsonData.data.result.event_details.map((eventStr: string) => {
                            try {
                                return JSON.parse(eventStr);
                            } catch (parseError) {
                                console.error('Error parsing individual event:', parseError);
                                return null;
                            }
                        }).filter((event: null) => event !== null);
    
                        if (Array.isArray(parsedEvents)) {
                            setLitmusLists(parsedEvents);
                        } else {
                            console.error('Event list is not an array:', parsedEvents);
                            setLitmusLists([]); 
                        }
                    } catch (error) {
                        console.error('Error parsing events:', error);
                        setLitmusLists([]);
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
        };

        fetchLitmusLists();
    }, []);

    const filteredEvents = litmusLists.filter(event => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (event.event_name?.toLowerCase().includes(searchLower) || false) ||
            (event.event_manager?.toLowerCase().includes(searchLower) || false) ||
            (event.event_venue?.toLowerCase().includes(searchLower) || false)
        );
    });

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="container mx-auto px-4 pt-6 pb-20 space-y-8 max-w-4xl">
            <motion.h1
                className="text-3xl md:text-4xl text-blue-800 font-bold text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                LITERARY MUSICAL EVENTS
            </motion.h1>

            <div className="bg-white shadow-md rounded-lg p-4 mb-8">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {currentEvents.length > 0 ? (
                <motion.div 
                    className="grid gap-6 sm:grid-cols-2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {currentEvents.map((litmus) => (
                        <div key={litmus.event_code} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-blue-900 p-4">
                                <h2 className="text-lg font-semibold">
                                    <Link href={`litmus/${litmus.event_code}`} className="text-white hover:underline">
                                        {litmus.event_name}
                                    </Link>
                                </h2>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-semibold">Manager:</span> {litmus.event_manager}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Venue:</span> {litmus.event_venue}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
                    <p className="text-xl font-semibold">No literary musical events found</p>
                    <p className="mt-2">Try adjusting your search criteria</p>
                </div>
            )}

            <div className="flex justify-center space-x-4 mt-8">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium">
                    {currentPage} / {Math.ceil(filteredEvents.length / eventsPerPage)}
                </span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredEvents.length / eventsPerPage)}
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}