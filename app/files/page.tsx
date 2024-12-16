'use client'

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddFileModal from "../components/addfile";

interface FileList {
    file_name: string;
}

export default function ListOfFiles() {

    const [filesLists, setFileLists] = useState<FileList[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchFilesLists = async () => {
        const requestBody = {
            data: {
                "data": "ALL"
            },
            spname: "Select_Files"
        }
        const response = await fetch('/api', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(requestBody)
        });
        const jsonData = await response.json();
        if(jsonData.status) {
            if(jsonData.data.result.status.toUpperCase() === "FAILED") {
                // toast.error(jsonData.data.result.message, {
                //     position: "top-right",
                //     autoClose: 1500,
                // });
                console.log(jsonData.data.result.message);
                setFileLists([]);
            } else {
                try {
                    const parsedEvents = jsonData.data.result.file_lists.map((eventStr: string) => {
                        try {
                            return JSON.parse(eventStr);
                        } catch (parseError) {
                            console.error('Error parsing individual event:', parseError);
                            return null;
                        }
                    }).filter((event: null) => event !== null);

                    if (Array.isArray(parsedEvents)) {
                        setFileLists(parsedEvents);
                    } else {
                        console.error('Event list is not an array:', parsedEvents);
                        setFileLists([]); 
                    }
                } catch (error) {
                    console.error('Error parsing events:', error);
                    setFileLists([]);
                }
            }
        }
    } 
    useEffect(() => {
        fetchFilesLists();
    }, [])
    return (
        <div className="container mx-auto px-4 py-8">
              <motion.h1
                  className="text-2xl text-blue-800 font-bold mb-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}>
                  FILE LISTS
              </motion.h1>
              <button
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                    onClick={() => setIsModalOpen(true)}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    New File
                </button>
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
                              <th className="py-3 px-4 border text-left">File</th>
                              </tr>
                          </thead>
                          <tbody>
                                {Array.isArray(filesLists) && filesLists.length > 0 ? (
                                    filesLists.map((file, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="py-3 px-4 border text-left underline underline-offset-1 text-blue-500">
                                                <Link
                                                onClick={() => {
                                                    if(localStorage.getItem('filename')) {
                                                        localStorage.removeItem('filename');
                                                    } 
                                                    localStorage.setItem('filename', file.file_name);
                                                }}
                                                    href={`admin/pages/events`}
                                                >
                                                {file.file_name}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-3 px-4 text-center text-gray-500 bg-gray-50">
                                            No files available.
                                        </td>
                                    </tr>
                                )}
                          </tbody>
                      </table>
                  </div>
                  </motion.div>
              </div>
              <AddFileModal
                isOpen={isModalOpen}
                onClose={() => {
                    fetchFilesLists();
                    setIsModalOpen(false);
                }}
              />
        </div>
        
    );
  }