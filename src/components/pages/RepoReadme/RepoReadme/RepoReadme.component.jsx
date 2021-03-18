import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { Message, Segment, Dimmer, Loader } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";

import { useFetchRepoReadme } from "../../../../hooks/useFetchRepoReadme";

import "./RepoReadme.css";

export const RepoReadme = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const history = useHistory();
  const [displayError, setDisplayError] = useState("");
  const [data, setData] = useState(null);

  const { response, error, loading } = useFetchRepoReadme(state?.login, id);

  useEffect(() => {
    if (!state?.login) {
      history.push("/");
    }
  }, [state, history]);

  useEffect(() => {
    if (error) {
      setDisplayError(error?.response?.data?.message);
    } else if (response) {
      setData(atob(response?.data?.content));
    } else {
      setData(null);
    }
  }, [response, error]);

  return (
    <div className="readmeContainer" data-testid="readme-page">
      <Segment className="readmeContent">
        {displayError && <Message error content={displayError} />}
        {loading ? (
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        ) : (
          <ReactMarkdown>{data}</ReactMarkdown>
        )}
      </Segment>
    </div>
  );
};
