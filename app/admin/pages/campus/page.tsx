'use client';

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencilAlt, faSearch, faChevronLeft, faChevronRight, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AddCampusModal from "@/app/components/addcampusmodal";

interface Campus {
    campus_code?: string;
    campus_name?: string;
    filename?: string;
    date_added: string;
    added_by: string;
}

export default function AdminCampusPage() {
    const [campus, setCampus] = useState<Campus[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [campusPerPage] = useState(10);
    const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCampusData = async () => {
        setIsLoading(true);
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
                setCampus([]); 
                console.log(jsonData.data.result.message)
                setIsLoading(false);
            } else {
                try {
                    const parsedCampus = jsonData.data.result.campus_list.map((campustr: string) => {
                        try {
                            return JSON.parse(campustr);
                        } catch (parseError) {
                            console.error('Error parsing individual event:', parseError);
                            return null;
                        }
                    }).filter((event: null) => event !== null);

                    if (Array.isArray(parsedCampus)) {
                        setCampus(parsedCampus);
                    } else {
                        console.error('Campus list is not an array:', parsedCampus);
                        setCampus([]); 
                    }
                } catch (error) {
                    console.error('Error parsing campus:', error);
                    setCampus([]);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    const updateCampus = async (updatedCampus: Campus) => {
        try {
            const transformedData: Campus = {
                ...updatedCampus,
                campus_name: updatedCampus.campus_name?.toUpperCase(),
                filename: String(localStorage.getItem('filename')),
                added_by: String(localStorage.getItem('userLogin')),
                date_added: new Date().toISOString()
            }
            const requestBody = {
                data: transformedData,
                spname: 'Update_Campus',
            };
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            const jsonData = await response.json();
            if(jsonData.status && jsonData.data.result.status.toUpperCase() === "SUCCESS") {
                toast.success(jsonData.data.result.message);
                fetchCampusData();
                setEditingCampus(null);
            } else {
                toast.error(jsonData.data.result.message || "Failed to update event");
            }
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error("An error occurred while updating the event");
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchCampusData();
        }
    }, [isModalOpen]);

    useEffect(() => {
        fetchCampusData();
    }, []);

    const filteredCampus = campus.filter(event => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (event.campus_name?.toLowerCase().includes(searchLower) || false) || ""
        );
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastCampus = currentPage * campusPerPage;
    const indexOfFirstCampus = indexOfLastCampus - campusPerPage;
    const currentCampus = filteredCampus.slice(indexOfFirstCampus, indexOfLastCampus);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleEditChange = (field: keyof Campus, value: string) => {
        if (editingCampus) {
            setEditingCampus({
                ...editingCampus,
                [field]: value
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Campus
                </button>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search campus..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="text-sm min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
                    <thead className="bg-blue-900 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Campus Name</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                            <tr>
                                <td colSpan={2} className="py-3 px-4 text-center">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                                        <span className="ml-2">Loading campuses...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : Array.isArray(currentCampus) && currentCampus.length > 0 ? (
                            currentCampus.map((campus, index) => (
                                <tr key={campus.campus_code} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    {editingCampus && editingCampus.campus_code === campus.campus_code ? (
                                        // Editing mode
                                        <>
                                            <td className="py-3 px-4">
                                                <input 
                                                    type="text" 
                                                    value={editingCampus.campus_name || ''} 
                                                    onChange={(e) => handleEditChange('campus_name', e.target.value)}
                                                    className="w-full border rounded px-2 py-1"
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button 
                                                        onClick={() => editingCampus && updateCampus(editingCampus)}
                                                        className="text-green-500 hover:text-green-700"
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingCampus(null)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        // Display mode
                                        <>
                                            <td className="py-3 px-4">{campus.campus_name || 'NA'}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button 
                                                    onClick={() => setEditingCampus(campus)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="py-3 px-4 text-center">No campuses found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination component remains the same */}
            <div className="mt-4 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <span className="sr-only">Previous</span>
                        <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: Math.ceil(filteredCampus.length / campusPerPage) }).map((_, index) => (
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
                        disabled={currentPage === Math.ceil(filteredCampus.length / campusPerPage)}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <span className="sr-only">Next</span>
                        <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" aria-hidden="true" />
                    </button>
                </nav>
            </div>

            <AddCampusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}