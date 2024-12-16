'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import TopNavigation from "./components/clienttopnav";

interface RankingSportProps {
    campus_code: string;
    campus_name: string;
    event_type: string;
    details: {
        gold: number;
        silver: number;
        bronze: number;
        fourth: number;
        fifth: number;
    };
}

interface RankingLitmusProps {
    campus_code: string;
    campus_name: string;
    event_type: string;
    details: {
        gold: number
        silver: number
        bronze: number
        fourth: number
        fifth: number
    };
}

export default function TabulationSummaryRanking() {
    const [sportsEventRankingList, setSportsEventRankingList] = useState<RankingSportProps[]>([]);
    const [litmusEventRankingList, setLitmusEventRankingList] = useState<RankingLitmusProps[]>([]);
    const [isOn, setIsOn] = useState(false);
    const toggleSwitch = () => setIsOn(!isOn);
    const [year, setYear] = useState<string>('');

    useEffect(() => {
        const currentYear = new Date().getFullYear().toString();
        const savedFilename = localStorage.getItem("filename");
        if (!savedFilename) {
            localStorage.setItem("filename", currentYear);
        }
    }, []);
    
    const fetchSportRanking = async () => {
        const requestBody = {
            data: {
                filename: localStorage.getItem('filename'),
                event_type: 'SPORTS'
            },
            spname: "Ranking_Summary"
        }
        const responseSports = await fetch('/api', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(requestBody)
        });
        const jsonData = await responseSports.json();
        console.log("Sports ", jsonData);
        if(jsonData.status) {
            if(jsonData.data.result.status.toUpperCase() === "FAILED") {
                setSportsEventRankingList([]); 
                console.log(jsonData.data.result.message)
            } else {
                try {
                    const parsedRankingLists = jsonData.data.result.ranking_lists
                        .filter((rankingStr: string) => rankingStr.trim() !== "")
                        .map((rankingStr: string) => JSON.parse(rankingStr));
                    setSportsEventRankingList(parsedRankingLists);
                } catch (error) {
                    console.error('Error parsing campus:', error);
                    setSportsEventRankingList([]);
                }
            }
        }
    };

    const fetchLitmusRanking = async () => {
        const requestBody = {
            data: {
                filename: localStorage.getItem('filename'),
                event_type: 'LITMUS'
            },
            spname: "Ranking_Summary"
        }
        const responseLitmus = await fetch('/api', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(requestBody)
        });
        const jsonData = await responseLitmus.json();
        console.log("Litmus ", jsonData);
        if(jsonData.status) {
            if(jsonData.data.result.status.toUpperCase() === "FAILED") {
                setLitmusEventRankingList([]); 
                console.log(jsonData.data.result.message)
            } else {
                try {
                    const parsedRankingLists = jsonData.data.result.ranking_lists
                        .filter((rankingStr: string) => rankingStr.trim() !== "")
                        .map((rankingStr: string) => JSON.parse(rankingStr));
                        setLitmusEventRankingList(parsedRankingLists);
                } catch (error) {
                    console.error('Error parsing campus:', error);
                    setLitmusEventRankingList([]);
                }
            }
        }
    };

    useEffect(() => {
        fetchLitmusRanking();
        fetchSportRanking();
    }, []);

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;
        if (isOn) {
          intervalId = setInterval(() => {
            fetchLitmusRanking();
            fetchSportRanking();
          }, 10000); 
        } else {
          if (intervalId) {
            clearInterval(intervalId);
          }
        }

        return () => {
          if (intervalId) {
            clearInterval(intervalId);
          }
        };
    }, [isOn]);

    useEffect(() => {
        const savedYear = localStorage.getItem('filename')?.toString();
        setYear(savedYear || '');
    }, [])

    return (
        <div>
            <TopNavigation />
            <div className="container mx-auto px-4 pt-6 pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold text-blue-900">{year}</h1>
                <div className="flex items-center">
                    <span className="mr-3 text-blue-900 font-semibold">LIVE RESULT</span>
                    <div 
                        className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer ${
                            isOn ? 'bg-blue-900' : 'bg-gray-300'
                        }`}
                        onClick={toggleSwitch}
                    >
                        <motion.div 
                            className="bg-white w-5 h-5 rounded-full shadow-md"
                            layout
                            transition={spring}
                            style={{ x: isOn ? 26 : 0 }}
                        />
                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-semibold bg-blue-900 text-white py-3 px-4">Sports Events</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-blue-900">Campus</th>
                                    <th className="py-3 px-4 text-center text-blue-900">
                                        <FontAwesomeIcon icon={faMedal} className="text-yellow-500 mr-2" />
                                        Gold
                                    </th>
                                    <th className="py-3 px-4 text-center text-blue-900">
                                        <FontAwesomeIcon icon={faMedal} className="text-gray-400 mr-2" />
                                        Silver
                                    </th>
                                    <th className="py-3 px-4 text-center text-blue-900">
                                        <FontAwesomeIcon icon={faMedal} className="text-yellow-700 mr-2" />
                                        Bronze
                                    </th>
                                    <th className="py-3 px-4 text-center text-blue-900">
                                        4th
                                    </th>
                                    <th className="py-3 px-4 text-center text-blue-900">
                                        5th
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sportsEventRankingList.map((event, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                                        <td className="py-3 px-4 font-medium text-blue-900">{event.campus_name}</td>
                                        <td className="py-3 px-4 text-center">{event.details.gold}</td>
                                        <td className="py-3 px-4 text-center">{event.details.silver}</td>
                                        <td className="py-3 px-4 text-center">{event.details.bronze}</td>
                                        <td className="py-3 px-4 text-center">{event.details.fourth}</td>
                                        <td className="py-3 px-4 text-center">{event.details.fifth}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
                <motion.div 
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold bg-blue-900 text-white py-3 px-4">Literary - Musical Events</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-blue-900">Campus</th>
                                    <th className="py-3 px-4 text-center text-blue-900"><FontAwesomeIcon icon={faMedal} className="text-yellow-500 mr-2" /></th>
                                    <th className="py-3 px-4 text-center text-blue-900"><FontAwesomeIcon icon={faMedal} className="text-gray-400 mr-2" /></th>
                                    <th className="py-3 px-4 text-center text-blue-900"><FontAwesomeIcon icon={faMedal} className="text-yellow-700 mr-2" /></th>
                                    <th className="py-3 px-4 text-center text-blue-900">4th</th>
                                    <th className="py-3 px-4 text-center text-blue-900">5th</th>
                                </tr>
                            </thead>
                            <tbody>
                                {litmusEventRankingList.map((event, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                                        <td className="py-3 px-4 font-medium text-blue-900">{event.campus_name}</td>
                                        <td className="py-3 px-4 text-center">{event.details.gold}</td>
                                        <td className="py-3 px-4 text-center">{event.details.silver}</td>
                                        <td className="py-3 px-4 text-center">{event.details.bronze}</td>
                                        <td className="py-3 px-4 text-center">{event.details.fourth}</td>
                                        <td className="py-3 px-4 text-center">{event.details.fifth}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
        </div>
    );
}