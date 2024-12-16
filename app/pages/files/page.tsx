'use client'

import FileCard from '@/app/components/filecards';
import LoadingIndicator from '@/app/components/loadingindicator';
import ToastProvider from '@/app/components/toastprovider';
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'


interface Files {
  file_name: string
}

export default function Home() {
  const [fileLists, setFileLists] = useState<Files[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, [])
  
  useEffect(() => {
    setIsLoading(true);
    const fetchYearLists = async () => {
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
            console.log(jsonData.data.result.message)
            setFileLists([]); 
            setIsLoading(false);
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
                  // Sort the parsedEvents array by file_name
                    const sortedEvents = parsedEvents.sort((a, b) => 
                    b.file_name.localeCompare(a.file_name)
                  );
                  setFileLists(sortedEvents);
                } else {
                    console.error('Event list is not an array:', parsedEvents);
                    setFileLists([]); 
                }
            } catch (error) {
                console.error('Error parsing events:', error);
                setFileLists([]);
                
            } finally {
              setIsLoading(false);
            }
        }
    }
    }

    fetchYearLists();
  }, [])
  

  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <main className="w-full min-h-screen">
      <ToastProvider>
        {/* Centering the Year Cards Horizontally and Vertically */}
        <div className="flex items-center justify-center">
          <AnimatePresence>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full max-w-7xl px-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {Array.isArray(fileLists) && fileLists.length > 0 ? (
                fileLists.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FileCard file_name={file.file_name} isClickable />
                </motion.div>
                ))
              ): (
                <h1 className='text-red-600 text-xl font-bold'>No files yet.</h1>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ToastProvider>
    </main>
  )
}