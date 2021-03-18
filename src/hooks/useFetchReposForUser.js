import { useState, useEffect } from "react";

import { getReposForUser } from "../services/github";

export const useFetchReposForUser = (username) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const service = async () => {
      setError(null);
      setResponse(null);

      try {
        if (username) {
          setLoading(true);
          const result = await getReposForUser(username);
          setResponse(result);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };

    service();
  }, [username]);

  return { loading, error, response };
};
