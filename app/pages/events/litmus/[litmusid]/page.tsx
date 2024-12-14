'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBackward, faBackwardStep, faTentArrowTurnLeft } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";


const sportsEvents = [
    { name: "Dapitan", score: "10"},
    { name: "Dipolog", score: "20"},
    { name: "Katipunan", score: "30"},
    { name: "Tampilisan", score: "40"},
    { name: "Siocon", score: "35"},
  ];

export default function LitmusDetailsPage() {
    const params = useParams();
    const litmusid = params?.litmusid;
    return <div className="container mx-auto px-4 py-8">
    <motion.h1
        className="text-2xl text-blue-800 font-bold mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}>
        {litmusid}
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
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-center">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sportsEvents.map((event, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="py-3 px-4">{event.name}</td>
                                <td className="py-3 px-4 text-center font-bold">{event.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link
                href='../litmus'
            >
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
            </button>
            </Link>
            
        </motion.div>
    </div>
</div>
}