'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function LitmusPage() {
  const sportsData = [
    { name: "Song - Solo",eventid: '001', manager: "John Doe", venue: "Arena 1" },
    { name: "Song - Duet",eventid: '002', manager: "Jane Smith", venue: "Stadium 2" },
    { name: "Dance Sport",eventid: '003', manager: "Mike Lee", venue: "Court 3" },
    { name: "Charcoal Rendering",eventid: '004', manager: "Sara Kim", venue: "Court 4" },
  ];

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
                            {sportsData.map((event, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="py-3 px-4 border text-left underline underline-offset-1 text-blue-500">
                                    <Link
                                        href={`litmus/${event.eventid}`}
                                    >
                                    {event.name}
                                    </Link>
                                </td>
                                <td className="py-3 px-4 border text-left">{event.manager}</td>
                                <td className="py-3 px-4 border text-left">{event.venue}</td>
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