import { useState, useEffect, useRef, useCallback } from 'react';

// Custom hook that calls an async function and returns data / loading / error state
export function useFetch(fetchFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Keep a ref to the latest fetch function so the effect always calls the current one
  const fetchRef = useRef(fetchFunction);

  useEffect(() => {
    fetchRef.current = fetchFunction;
  });

  // The actual fetch logic, wrapped in useCallback so it's stable
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRef.current();
      // Unwrap nested data if present (common with Axios), otherwise use the raw response
      setData(res.data?.data ?? res.data ?? res);
    } catch (err) {
      // Extract a meaningful error message from the error object
      const msg = err.response?.data?.message || err.message || 'Something went wrong';
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run the fetch automatically when the component mounts
  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

export default useFetch;
