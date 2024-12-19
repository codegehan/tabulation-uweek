'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronLeft, faChevronRight, faMedal } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface AwardDetails {
    campus_name: string
    event_code: string
    event_name: string
    details: {
        award: string
    }
}

export default function CampusAwardsDetails() {
    const [awardsDetails, setAwardDetails] = useState<AwardDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [awardsPerPage] = useState(10);
    const [campusName, setCampusName] = useState<string>("");
    const [eventType, setEventType] = useState<'SPORTS' | 'LITMUS'>('SPORTS');
    const params = useParams();
    const campusid = params?.campusid;
    const [isLoading, setIsLoading] = useState(false);
    
    const fetchCampusAwards = useCallback(async (type: 'SPORTS' | 'LITMUS') => {
        setIsLoading(true);
        try {
            const requestBody = {
                data: {
                    campus_code: campusid,
                    event_type: type,
                    filename: localStorage.getItem('filename') || ''
                },
                spname: 'Select_Award_By_Campus'
            };
            const response = await fetch('/api', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(requestBody)
            });
            const jsonData = await response.json();
            console.log(jsonData);
            if (jsonData.status) {
                if (jsonData.data.result.status.toUpperCase() === "FAILED") {
                    setAwardDetails([]); 
                    console.log('Error message:', jsonData.data.result.message);
                } else {
                    const campusNameData = jsonData.data.result.campus_name;
                    setCampusName(campusNameData)
                    const eventDetails = jsonData.data.result.award_details;
                    // Sort the awards by event_name
                    const sortedEventDetails = eventDetails.sort((a: { event_name: string; }, b: { event_name: string; }) => 
                        a.event_name.localeCompare(b.event_name)
                    );
                    setAwardDetails(sortedEventDetails);
                }
            }
        } catch (error) {
            console.error('Error fetching award details:', error);
            setAwardDetails([]);
        } finally {
            setIsLoading(false);
        }
    }, [campusid]);

    useEffect(() => {
        fetchCampusAwards(eventType);
    }, [fetchCampusAwards, eventType])

    const filteredEvents = awardsDetails.filter(event => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (event.event_name?.toLowerCase().includes(searchLower) || false)
        );
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastEvent = currentPage * awardsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - awardsPerPage;
    const currentAwards = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between">
                <motion.h1
                    className="text-2xl text-blue-800 font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    {campusName} CAMPUS
                </motion.h1>
                <input
                    type="hidden"
                    placeholder="Search event"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex mb-4">
                <div className="inline-flex rounded-md shadow-s" role="group">
                    <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700`}
                        onClick={() => setEventType('SPORTS')}
                    >
                        Sports
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700`}
                        onClick={() => setEventType('LITMUS')}
                    >
                        Literary Musical
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
                <motion.div 
                    className="w-full"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full shadow-md rounded-lg overflow-hidden text-sm">
                            <thead className="bg-blue-900 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">Event - {eventType}</th>
                                    <th className="py-3 px-4 text-center">Award</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={2} className="py-3 px-4 text-center bg-white">
                                            <div className="flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                                                <span className="ml-2">Fetching data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ): (
                                    currentAwards.length > 0 ? (
                                        currentAwards.map((event, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                <td className="py-3 px-4">{event.event_name}</td>
                                                <td className="py-3 px-4 text-center">
                                                {event.details.award === '1' ? (
                                                    <FontAwesomeIcon icon={faMedal} className="text-yellow-500 mr-2" />
                                                ) : event.details.award === '2' ? (
                                                    <FontAwesomeIcon icon={faMedal} className="text-gray-400 mr-2" />
                                                ) : event.details.award === '3' ? (
                                                    <FontAwesomeIcon icon={faMedal} className="text-yellow-700 mr-2" />
                                                ) : event.details.award === '4' ? (
                                                    '4TH'
                                                ) : event.details.award === '5' ? (
                                                    '5TH'
                                                ) : (
                                                    '-'
                                                )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-3 px-4 text-center text-gray-500 bg-gray-50">
                                                No awards details available.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Link href="/">
                        <button className="flex items-center px-4 py-2 text-sm z-10 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4">
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Back
                        </button>
                    </Link>  
                </motion.div>
            </div>

            <div className="bottom-0 pb-10 left-0 right-0 border-gray-200 p-4">
                <div className="container mx-auto flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {Array.from({ length: Math.ceil(filteredEvents.length / awardsPerPage) }).map((_, index) => (
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
                            disabled={currentPage === Math.ceil(filteredEvents.length / awardsPerPage)}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}