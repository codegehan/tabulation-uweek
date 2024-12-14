'use client'

import { faCirclePlus, faMinus, faRefresh, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface SportAward {
    award_code: string
    campus_code: string
    campus_name: string
    event_code: string
    event_name: string
    event_type: string
    details: {
        gold: number
        silver: number
        bronze: number
    }
    filename: string
    added_by: string
    date_added: string
}

interface SportListProps {
    event_code: string
    event_name: string
}

interface CampusListProps {
    campus_code: string
    campus_name: string
}

// const campusLists = ['Dapitan', 'Dipolog', 'Katipunan', 'Tampilisan', 'Siocon'];

export default function AdminAwardsPage() {
    const [sportsLists, setSportsLists] = useState<SportListProps[]>([]);
    const [campusLists, setCampusLists] = useState<CampusListProps[]>([]);
    useEffect(() => {
        // Clear all toasts on component mount
        toast.dismiss();
    }, []);
    useEffect(() => {
        const fetchSportLists = async () => {
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
                    toast.error(jsonData.data.result.message, {
                        position: "top-right",
                        autoClose: 1500,
                    });
                } else {
                    try {
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
                    }
                }
            }
        };
        fetchSportLists();
    }, [])

    useEffect(() => {
        const fetchCampusLists = async () => {
            const requestBody = {
                data: {
                    filename: String(localStorage.getItem('filename'))
                },
                spname: 'Select_Campus_All'
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
                        const parsedEvents = jsonData.data.result.campus_list.map((eventStr: string) => {
                            try {
                                return JSON.parse(eventStr);
                            } catch (parseError) {
                                console.error('Error parsing individual event:', parseError);
                                return null;
                            }
                        }).filter((event: null) => event !== null);
    
                        if (Array.isArray(parsedEvents)) {
                            setCampusLists(parsedEvents);
                        } else {
                            console.error('Event list is not an array:', parsedEvents);
                            setCampusLists([]); 
                        }
                    } catch (error) {
                        console.error('Error parsing events:', error);
                        setCampusLists([]);
                    }
                }
            }
        }
        fetchCampusLists();
    }, [])

    const [sportsAwards, setSportsAwards] = useState<SportAward[]>([])

    const addSportRow = () => {
        setSportsAwards([...sportsAwards, { 
            award_code: "",
            campus_code: "",
            campus_name: "",
            event_code: "",
            event_name: "",
            event_type: "",
            details: {
                gold: 0,
                silver: 0,
                bronze: 0
            },
            filename: String(localStorage.getItem('filename')),
            added_by: "Gehan",
            date_added: new Date().toISOString()
        }])
    }

    const updateSportAward = (index: number, field: keyof SportAward, value: string) => {
        const updatedAwards = sportsAwards.map((award, i) => {
            if (i === index) {
                const updatedAward = { ...award, [field]: value };
                if (field === 'event_code') {
                    const selectedEvent = sportsLists.find(sport => sport.event_code === value);
                    updatedAward.event_name = selectedEvent ? selectedEvent.event_name : '';
                }
                if (field === 'campus_code') {
                    const selectedCampus = campusLists.find(campus => campus.campus_code === value);
                    updatedAward.campus_code = value;
                    updatedAward.campus_name = selectedCampus ? selectedCampus.campus_name : '';
                }
                return updatedAward;
            }
            return award;
        });
        setSportsAwards(updatedAwards);
    };

    const updateDetailsAward = (index: number, field: keyof SportAward['details'], value: number) => {
        setSportsAwards((prevAwards) =>
            prevAwards.map((award, i) =>
                i === index
                    ? {
                        ...award,
                        details: {
                            ...award.details,
                            [field]: value,
                        },
                    }
                    : award
            )
        );
    };

    const handleSportsUpload = async () => {
        const formattedAwards = sportsAwards.map(award => ({
            ...award,
            award_code: `${award.campus_code}${award.event_code}`,
            event_type: 'SPORTS'
        }));
        // SEND TO API HEREEEEEEEEEEEEEEEEEEEEEEEE
        // console.log(JSON.stringify(formattedAwards, null, 2));
        const requestBody = {
            data: formattedAwards,
            spname: 'Add_Award',
        };
        const response = await fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const jsonData = await response.json();
        if(jsonData.status && jsonData.data.result.status.toUpperCase() === "SUCCESS") {
            toast.success(jsonData.data.result.message, { autoClose: 1500 });
            resetTable();
        } else {
            toast.error(jsonData.data.result.message || "Failed to update event");
        }
    };

    const removeItem = () => {
        setSportsAwards(prevAwards => prevAwards.slice(0, -1));
    }
    const resetTable = () => {
        setSportsAwards([]);
    }

    return (
        <div className="container mx-auto p-4">
            <div>
                <div className="mb-3 flex items-center">
                    <h2 className="text-xl font-semibold me-4">Sports</h2>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        onClick={addSportRow}
                    >
                        <FontAwesomeIcon icon={faCirclePlus} className='me-1' /> 
                        New Row
                    </button>
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
                        onClick={handleSportsUpload}
                    >
                        <FontAwesomeIcon icon={faUpload} className='me-1' /> 
                        Upload
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded ml-2"
                        onClick={removeItem}
                    >
                        <FontAwesomeIcon icon={faMinus} className='me-1' /> 
                        Remove Item
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded ml-2"
                        onClick={resetTable}
                    >
                        <FontAwesomeIcon icon={faRefresh} className='me-1' /> 
                        Reset
                    </button>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-900 text-white">
                            <th className="border p-2 text-start">Sport Type</th>
                            <th className="border p-2 text-start">Campus</th>
                            <th className="border p-2">Gold</th>
                            <th className="border p-2">Silver</th>
                            <th className="border p-2">Bronze</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sportsAwards.map((award, index) => (
                            <tr key={index}>
                                <td className="border p-2">
                                    <select
                                        className="w-full p-1 border rounded"
                                        value={award.event_code}
                                        onChange={(e) => updateSportAward(index, 'event_code', e.target.value)}
                                    >
                                        <option value="">Select Event</option>
                                        {sportsLists.map((sport) => (
                                            <option key={sport.event_code} value={sport.event_code}>
                                                {sport.event_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border p-2">
                                    <select
                                        className="w-full p-1 border rounded"
                                        value={award.campus_code}
                                        onChange={(e) => updateSportAward(index, 'campus_code', e.target.value)}
                                    >
                                        <option value="">Select Campus</option>
                                        {campusLists.map((campus) => (
                                            <option key={campus.campus_code} value={campus.campus_code}>
                                                {campus.campus_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border p-2 text-center">
                                    <input
                                        type="number"
                                        className="w-12 text-center p-1 border rounded"
                                        value={award.details.gold}
                                        onChange={(e) => updateDetailsAward(index, 'gold', parseInt(e.target.value) || 0)}
                                    />
                                </td>
                                <td className="border p-2 text-center">
                                    <input
                                        type="number"
                                        className="w-12 text-center p-1 border rounded"
                                        value={award.details.silver}
                                        onChange={(e) => updateDetailsAward(index, 'silver', parseInt(e.target.value) || 0)}
                                    />
                                </td>
                                <td className="border p-2 text-center">
                                    <input
                                        type="number"
                                        className="w-12 text-center p-1 border rounded"
                                        value={award.details.bronze}
                                        onChange={(e) => updateDetailsAward(index, 'bronze', parseInt(e.target.value) || 0)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}