'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";


interface LitmusListProps {
    event_code: string
    event_name: string
    event_manager: string
    event_venue: string
}


export default function LitmusPage() {
    const [litmusLists, setLitmusLists] = useState<LitmusListProps[]>([]);
    const fetchedRef = useRef(false);
  useEffect(() => {
    const fetchLitmusLists = async () => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

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
                    toast.error(jsonData.data.result.message, {
                        position: "top-right",
                        autoClose: 1500,
                    });
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
                    }
                }
            }
    };

    fetchLitmusLists();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-2xl text-blue-800 font-bold mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}>
                LITERARY MUSICAL EVENTS
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
                            {litmusLists.map((litmus, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="py-3 px-4 border text-left underline underline-offset-1 text-blue-500">
                                    <Link
                                        href={`litmus/${litmus.event_code}`}
                                    >
                                    {litmus.event_name}
                                    </Link>
                                </td>
                                <td className="py-3 px-4 border text-left">{litmus.event_manager}</td>
                                <td className="py-3 px-4 border text-left">{litmus.event_venue}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </motion.div>
            </div>
        </div>
  );
}