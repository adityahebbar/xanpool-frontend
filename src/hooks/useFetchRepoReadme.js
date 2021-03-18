import { useState, useEffect } from "react";

import { getRepoReadme } from "../services/github";

export const useFetchRepoReadme = (login, repoName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const service = async () => {
      setError(null);
      setResponse(null);

      try {
        if (login && repoName) {
          setLoading(true);
          const result = await getRepoReadme(login, repoName);
          setResponse(result);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };

    service();
  }, [login, repoName]);

  return { loading, error, response };
};
