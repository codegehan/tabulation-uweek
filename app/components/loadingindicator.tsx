import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function LoadingIndicator() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <div className="text-center">
        <FontAwesomeIcon 
          icon={faSpinner} 
          spin 
          className="text-blue-600 text-4xl mb-4" 
          aria-hidden="true"
        />
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
      </div>
    </div>
  );
}