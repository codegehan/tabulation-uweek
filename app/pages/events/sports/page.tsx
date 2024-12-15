'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";


interface SportListProps {
    event_code: string
    event_name: string
    event_manager: string
    event_venue: string
}


export default function SportPage() {
    const [sportsLists, setSportsLists] = useState<SportListProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchSportLists = async () => {
        setIsLoading(true);
        const requestBody = {
            data: {
                event_type: "SPORTS",
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
                    setIsLoading(false);
                    console.log(jsonData.data.result.message);
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
                            setSportsLists(parsedEvents);
                        } else {
                            console.error('Event list is not an array:', parsedEvents);
                            setSportsLists([]); 
                        }
                    } catch (error) {
                        console.error('Error parsing events:', error);
                        setSportsLists([]);
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
    };

    fetchSportLists();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-2xl text-blue-800 font-bold mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}>
                SPORT EVENTS
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
                            <th className="py-3 px-4 border text-left">Name</th>
                            <th className="py-3 px-4 border text-left">Manager</th>
                            <th className="py-3 px-4 border text-left">Venue</th>
                            </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                                <tr className='bg-gray-50'>
                                    <td colSpan={3} className="py-3 px-4 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                                            <span className="ml-2">Loading events...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : sportsLists.length > 0 ? (
                                sportsLists.map((sport, index) => (
                                    <tr key={sport.event_code} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="py-3 px-4 border text-left underline underline-offset-1 text-blue-500">
                                            <Link href={`sports/${sport.event_code}`}>
                                                {sport.event_name}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4 border text-left">{sport.event_manager}</td>
                                        <td className="py-3 px-4 border text-left">{sport.event_venue}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className='bg-gray-50'>
                                    <td colSpan={3} className="py-3 px-4 text-center">No sports events found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                </motion.div>
            </div>
        </div>
  );
}