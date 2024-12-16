'use client'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminLogsPage(){
    const [logDetails, setLogDetails] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogDetails = async () => {
        setIsLoading(true);
        const requestBody = {
            data: { filename: localStorage.getItem('filename') },
            spname: 'Select_Logs'
        }
        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            const jsonData = await response.json();
            
            if (jsonData.status) {
                if (jsonData.data.result.status.toUpperCase() === "FAILED") {
                    console.log(jsonData.data.result.message);
                } else {
                    const logList = JSON.parse(jsonData.data.result.log_details);
                    setLogDetails(logList);
                }
            } else {
                toast.error("Something went wrong!", {
                    position: "top-right",
                    autoClose: 1500,
                });
            }
        } catch (error) {
            console.error("Error fetching log details:", error);
            toast.error("Failed to fetch log details", {
                position: "top-right",
                autoClose: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchLogDetails();
    }, [])
    


    return (
        <div className="container mx-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-blue-900 text-white">
                        <th className="border p-2 w-5 text-center">No</th>
                        <th className="border p-2 text-start">Activity</th>
                    </tr>
                </thead>
                <tbody className="text-xs">
                {isLoading ? (
                        <tr>
                            <td colSpan={3} className="border p-4 text-center">
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                                    <span className="ml-2">Fetching logs...</span>
                                </div>
                            </td>
                        </tr>
                    ) : logDetails.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="border p-4 text-center bg-gray-200">
                                No logs recorded
                            </td>
                        </tr>
                    ) : (
                        logDetails.map((log, index) => (
                            <tr key={index} className="border-b">
                                <td className="border p-2 text-center"><strong>{index + 1}</strong></td>
                                <td className="border p-2">
                                    <pre className="whitespace-pre-wrap">{log}</pre>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
