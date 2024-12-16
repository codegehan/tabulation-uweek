'use client';

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencilAlt, faCheck, faTimes, faSearch, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AddAccountModal from "../../../components/addaccountmodal";
import { toast } from "react-toastify";

interface Account {
    user_fullname?: string;
    user_password?: string;
    user_email?: string;
    user_campus?: string;
    filename?: string;
    date_added: string;
    added_by: string;
}

interface CampusListProps {
    campus_code: string
    campus_name: string
}

export default function AdminAccountPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [accountsPerPage] = useState(10);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [campusLists, setCampusLists] = useState<CampusListProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCampusLists = async () => {
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
                    setIsLoading(false);
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
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
        }
        fetchCampusLists();
    }, [])

    const fetchAccountsData = async () => {
        const requestBody = {
            data: {
                filename: String(localStorage.getItem('filename'))
            },
            spname: 'Select_User_All'
        };
        const response = await fetch('/api', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(requestBody)
        });

        const jsonData = await response.json();
        if(jsonData.status) {
            if(jsonData.data.result.status.toUpperCase() === "FAILED") {
                setAccounts([]); 
                console.log(jsonData.data.result.message)
            } else {
                try {
                    const parsedAccounts = jsonData.data.result.user_lists.map((eventStr: string) => {
                        try {
                            return JSON.parse(eventStr);
                        } catch (parseError) {
                            console.error('Error parsing individual event:', parseError);
                            return null;
                        }
                    }).filter((event: null) => event !== null);

                    if (Array.isArray(parsedAccounts)) {
                        setAccounts(parsedAccounts);
                    } else {
                        console.error('Account list is not an array:', parsedAccounts);
                        setAccounts([]); 
                    }
                } catch (error) {
                    console.error('Error parsing accounts:', error);
                    setAccounts([]);
                }
            }
        }
    };

    const updateAccount = async (updatedAccount: Account) => {
        try {
            const transformedData: Account = {
                ...updatedAccount,
                user_fullname: updatedAccount.user_fullname?.toUpperCase(),
                user_email: updatedAccount.user_email?.toUpperCase(),
                user_password: updatedAccount.user_password,
                user_campus: updatedAccount.user_campus?.toUpperCase(),
                filename: String(localStorage.getItem('filename')),
                added_by: String(localStorage.getItem('userLogin')),
                date_added: new Date().toISOString()
            }
            const requestBody = {
                data: transformedData,
                spname: 'Update_User',
            };
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            const jsonData = await response.json();
            if(jsonData.status && jsonData.data.result.status.toUpperCase() === "SUCCESS") {
                toast.success(jsonData.data.result.message);
                fetchAccountsData();
                setEditingAccount(null);
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
            fetchAccountsData();
        }
    }, [isModalOpen]);

    useEffect(() => {
        fetchAccountsData();
    }, []);

    const filteredAccounts = accounts.filter(account => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (account.user_fullname?.toLowerCase().includes(searchLower) || false) ||
            (account.user_campus?.toLowerCase().includes(searchLower) || false)
        );
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastAccount = currentPage * accountsPerPage;
    const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
    const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleEditChange = (field: keyof Account, value: string) => {
        if (editingAccount) {
            setEditingAccount({
                ...editingAccount,
                [field]: value
            });
        }
    };

    return (
        <div className="container mx-auto">
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Account
                </button>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search accounts..."
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
                            <th className="py-3 px-4 text-left">Account Name</th>
                            <th className="py-3 px-4 text-center">Campus</th>
                            <th className="py-3 px-4 text-center">Email</th>
                            <th className="py-3 px-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                            <tr>
                                <td colSpan={4} className="py-3 px-4 text-center">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                                        <span className="ml-2">Loading accounts...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : Array.isArray(currentAccounts) && currentAccounts.length > 0 ? (
                            currentAccounts.map((account, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    {editingAccount && editingAccount.user_email === account.user_email ? (
                                        // Editing mode
                                        <>
                                            <td className="py-3 px-4">
                                                <input 
                                                    type="text" 
                                                    value={editingAccount.user_fullname || ''} 
                                                    onChange={(e) => handleEditChange('user_fullname', e.target.value)}
                                                    className="w-full border rounded px-2 py-1"
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <select  
                                                    value={editingAccount.user_campus || ''}  
                                                    onChange={(e) => handleEditChange('user_campus', e.target.value)} 
                                                    className="w-full border rounded px-2 py-1" 
                                                >
                                                    <option value="">Select Account Type</option>
                                                    {campusLists.map((campus) => (
                                                        <option key={campus.campus_code} value={campus.campus_name}>
                                                            {campus.campus_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <input 
                                                    type="email" 
                                                    value={editingAccount.user_email || ''} 
                                                    onChange={(e) => handleEditChange('user_email', e.target.value)}
                                                    className="w-full border rounded px-2 py-1"
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button 
                                                        onClick={() => editingAccount && updateAccount(editingAccount)}
                                                        className="text-green-500 hover:text-green-700"
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingAccount(null)}
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
                                            <td className="py-3 px-4">{account.user_fullname || 'NA'}</td>
                                            <td className="py-3 px-4 text-center">{account.user_campus || 'NA'}</td>
                                            <td className="py-3 px-4 text-center">{account.user_email || 'NA'}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button 
                                                    onClick={() => setEditingAccount(account)}
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
                                <td colSpan={4} className="py-3 px-4 text-center bg-gray-200">No accounts found</td>
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
                    {Array.from({ length: Math.ceil(filteredAccounts.length / accountsPerPage) }).map((_, index) => (
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
                        disabled={currentPage === Math.ceil(filteredAccounts.length / accountsPerPage)}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <span className="sr-only">Next</span>
                        <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" aria-hidden="true" />
                    </button>
                </nav>
            </div>

            <AddAccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}