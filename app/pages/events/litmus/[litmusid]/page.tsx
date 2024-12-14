'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

interface AwardDetails {
    award_code: string
    campus_code: string
    campus_name: string
    event_code: string
    event_name: string
    details: {
        score: number
    }
    filename: string
}

export default function SportsDetailsPage() {
    const [awardsDetails, setAwardDetails] = useState<AwardDetails[]>([]);
    const [eventName, setEventName] = useState<string>("");
    const params = useParams();
    const litmusid = params?.litmusid;
    const fetchedRef = useRef(false);
    
    const fetchAwardDetails = useCallback(async () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        try {
            const requestBody = {
                data: {
                    event_code: litmusid,
                    filename: localStorage.getItem('filename') || ''
                },
                spname: 'Select_Award_By_Code'
            };
            console.log("Payload", JSON.stringify(requestBody))
            const response = await fetch('/api', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(requestBody)
            });
            const jsonData = await response.json();
            console.log('API Response:', jsonData.data.result.event_name);
            const eventNameData = jsonData.data.result.event_name;
            setEventName(eventNameData)
            if (jsonData.status) {
                if (jsonData.data.result.status.toUpperCase() === "FAILED") {
                    setAwardDetails([]); 
                    console.log('Error message:', jsonData.data.result.message);
                } else {
                    const parsedData = jsonData.data.result.event_details.map((eventStr: string) => {
                        try {
                            return JSON.parse(eventStr);
                        } catch (parseError) {
                            console.error('Error parsing individual event:', parseError);
                            return null;
                        }
                    }).filter((event: AwardDetails | null): event is AwardDetails => event !== null);

                    if (Array.isArray(parsedData) && parsedData.length > 0) {
                        setAwardDetails(parsedData);
                        setEventName(parsedData[0].event_name || '');
                    } else {
                        console.error('Event list is empty or not an array:', parsedData);
                        setAwardDetails([]); 
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching award details:', error);
            setAwardDetails([]);
        }
    }, [litmusid]);
    
    useEffect(() => {
        toast.dismiss();
        fetchAwardDetails();
    }, [fetchAwardDetails]);

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-2xl text-blue-800 font-bold mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                {eventName}
            </motion.h1>
            <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
                <motion.div 
                    className="w-full"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-blue-900 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">Campus</th>
                                    <th className="py-3 px-4 text-center">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {awardsDetails.length > 0 ? (
                                    awardsDetails.map((event, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="py-3 px-4">{event.campus_name}</td>
                                            <td className="py-3 px-4 text-center">{event.details.score}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-3 px-4 text-center text-gray-500 bg-gray-50">
                                            No awards details available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Link href="../sports">
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4">
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Back
                        </button>
                    </Link>  
                </motion.div>
            </div>
        </div>
    );
}