import { useEffect, useState } from 'react';
import { initializeSampleData } from '../api/cancellation';

const DataInitializer = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initData = async () => {
      try {
        await initializeSampleData();
        setInitialized(true);
      } catch (err) {
        console.error('Failed to initialize sample data:', err);
        setError(err.message);
        // Don't block the app if sample data fails to initialize
        setInitialized(true);
      }
    };

    initData();
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('Sample data initialization failed:', error);
  }

  return children;
};

export default DataInitializer;