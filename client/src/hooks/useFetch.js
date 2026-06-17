import { useState, useEffect, useRef, useCallback } from 'react';

export function useFetch(fetchFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchRef = useRef(fetchFunction);

  useEffect(() => {
    fetchRef.current = fetchFunction;
  });

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRef.current();
      setData(res.data?.data ?? res.data ?? res);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong';
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

export default useFetch;
