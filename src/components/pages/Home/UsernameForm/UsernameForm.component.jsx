import React, { useState, useEffect } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReposTable } from "../ReposTable/ReposTable.component";

import { githubUsernameSchema } from "../../../../schemas/githubUsername.schema";
import { useFetchReposForUser } from "../../../../hooks/useFetchReposForUser";

import "./Username.css";

export const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [displayError, setDisplayError] = useState("");
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(githubUsernameSchema),
  });

  const { response, error, loading } = useFetchReposForUser(username);

  useEffect(() => {
    if (error) {
      console.dir(error);
      setDisplayError(error?.response?.data?.message);
    } else if (response) {
      setData(response.data);
    } else {
      setData(null);
    }
  }, [response, error]);

  const onSubmit = (data) => {
    setUsername(data.username);
  };

  return (
    <div className="container">
      {displayError && <Message content={displayError} error />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          render={(props) => (
            <Form.Input
              label="Github Username"
              placeholder="Enter Github Username"
              error={errors.username?.message}
              autoComplete="off"
              loading={loading}
              onChange={(e, data) => {
                setDisplayError("");
                props.onChange(e, data);
              }}
            />
          )}
          control={control}
          name="username"
          defaultValue={""}
        />
        <Button primary>Submit</Button>
      </Form>
      {data?.length && <ReposTable data={data} />}
    </div>
  );
};
