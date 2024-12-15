'use client'
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface RankingSportProps {
    campus_code: string;
    campus_name: string;
    event_type: string;
    details: {
        gold: number;
        silver: number;
        bronze: number
    };
}
interface RankingLitmusProps {
    campus_code: string;
    campus_name: string;
    event_type: string;
    details: {
        score: number
    };
}

export default function TabulationYearDetails() {
    const [sportsEventRankingList, setSportsEventRankingList] = useState<RankingSportProps[]>([]);
    const [litmusEventRankingList, setLitmusEventRankingList] = useState<RankingLitmusProps[]>([]);
    const [isOn, setIsOn] = useState(false);
    const toggleSwitch = () => setIsOn(!isOn);
    const fetchRef = useRef(false);
    
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
        console.log("Sports ",jsonData);
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
        console.log("Litmus ",jsonData);
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
        if (fetchRef.current) return;
        fetchRef.current = true;

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

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                className="text-2xl text-blue-800 font-bold mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}>
                JRMSU Universitiy Week Ranking Summary
            </motion.h1>
            <div className="flex items-center">
                <h1 className="me-2 text-blue-900"><strong>LIVE RESULT</strong></h1>
                <div className='switch' 
                    data-ison={isOn} 
                    onClick={toggleSwitch}>
                    <motion.div className="handle" layout transition={spring} />
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8 mt-6">
                <motion.div 
                    className="w-full md:w-1/2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-center">Sports Events</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-blue-900 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">Campus</th>
                                    <th className="py-3 px-4 text-center">Gold</th>
                                    <th className="py-3 px-4 text-center">Silver</th>
                                    <th className="py-3 px-4 text-center">Bronze</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sportsEventRankingList.map((event, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="py-3 px-4">{event.campus_name}</td>
                                        <td className="py-3 px-4 text-center">{event.details.gold}</td>
                                        <td className="py-3 px-4 text-center">{event.details.silver}</td>
                                        <td className="py-3 px-4 text-center">{event.details.bronze}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
                <motion.div 
                    className="w-full md:w-1/2"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-center">Literary - Musical Events</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-blue-900 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left">Campus</th>
                                    <th className="py-3 px-4 text-center">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {litmusEventRankingList.map((event, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="py-3 px-4">{event.campus_name}</td>
                                        <td className="py-3 px-4 text-center">{event.details.score}</td>
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