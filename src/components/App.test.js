import React from "react";
import { MemoryRouter as Router, Route } from "react-router-dom";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Axios from "axios";

import App from "./App";
import { mockRepos, mockReadme } from "../constants/mocks";
import { RepoReadme } from "./pages/RepoReadme/RepoReadme/RepoReadme.component";
import { UsernameForm } from "./pages/Home/UsernameForm/UsernameForm.component";

jest.mock("axios");

describe("integrated Test suite for the application", () => {
  function renderApp() {
    return render(<App />);
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("on render, an input box and submit button are shown to the user", () => {
    renderApp();

    expect(screen.getByPlaceholderText("Enter Github Username")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeTruthy();
  });

  it("An api call is made to fetch repos when a github username is entered", async () => {
    const { container } = renderApp();

    /* Mock the get repos api to pass with mock results */
    Axios.get.mockResolvedValueOnce({
      data: mockRepos,
    });

    userEvent.type(
      screen.getByPlaceholderText("Enter Github Username"),
      "aditya"
    );

    userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalledTimes(1);
    });

    /* 
        A table with the repos is rendered and has the right number of rows 
        (1 for header + 2 rows from mockdata 
    */
    expect(screen.getByTestId("repo-table")).toBeTruthy();
    expect(container.querySelectorAll("tr")).toHaveLength(3);
  });

  it("error from the api to fetch repos are handled", async () => {
    renderApp();

    /* Mock the get repos api to pass with mock results */
    Axios.get.mockRejectedValueOnce({
      response: {
        data: {
          message: "Not Found",
        },
      },
    });

    userEvent.type(
      screen.getByPlaceholderText("Enter Github Username"),
      "aditya"
    );

    userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalledTimes(1);
    });

    /* Error message from the API is rendered */
    expect(screen.getByText(/Not Found/i)).toBeTruthy();

    /* Repo table is not rendered */
    expect(screen.queryByTestId("repo-table")).toBeNull();
  });

  it("When the user clicks on one of the repos, the route changes and an api is made to get its readme file", async () => {
    const { container } = renderApp();

    /* Mock the get repos api to pass with mock results */
    Axios.get.mockResolvedValueOnce({
      data: mockRepos,
    });

    userEvent.type(
      screen.getByPlaceholderText("Enter Github Username"),
      "facebook"
    );

    userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalledTimes(1);
    });

    /* 
        A table with the repos is rendered and has the right number of rows 
        (1 for header + 2 rows from mockdata 
    */
    expect(screen.getByTestId("repo-table")).toBeTruthy();
    expect(container.querySelectorAll("tr")).toHaveLength(3);

    /* Mock the get readme api to pass with mock results */
    Axios.get.mockResolvedValueOnce({
      data: mockReadme,
    });

    /* user clicks on a repo link */
    userEvent.click(screen.getByText(/Ax/i));

    await waitFor(() => {
      /* A loader is rendered when an api call is in progress */
      expect(container.querySelector(".ui.inverted.text.loader")).toBeTruthy();
    });

    await waitFor(() => {
      expect(container.querySelector(".ui.inverted.text.loader")).toBeNull();
    });

    expect(screen.getByTestId("readme-page")).toBeTruthy();

    /* Axios.get must have been called again to fetch readme file */
    expect(Axios.get).toHaveBeenCalledTimes(2);
  });

  it("api errors from the get readme file api are handled", async () => {
    const { container } = render(
      <Router initialEntries={["/"]}>
        <UsernameForm />
        <Route path="/repo/:id">
          <RepoReadme />
        </Route>
      </Router>
    );

    /* Mock the get repos api to pass with mock results */
    Axios.get.mockResolvedValueOnce({
      data: mockRepos,
    });

    userEvent.type(
      screen.getByPlaceholderText("Enter Github Username"),
      "facebook"
    );

    userEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalledTimes(1);
    });

    /* 
        A table with the repos is rendered and has the right number of rows 
        (1 for header + 2 rows from mockdata 
    */
    expect(screen.getByTestId("repo-table")).toBeTruthy();
    expect(container.querySelectorAll("tr")).toHaveLength(3);

    /* Mock the get readme api to fail with mock error */
    Axios.get.mockRejectedValueOnce({
      response: {
        data: {
          message: "Unable to fetch the readme file",
        },
      },
    });

    /* user clicks on a repo link */
    userEvent.click(screen.getByText(/Ax/i));

    await waitFor(() => {
      expect(container.querySelector(".ui.inverted.text.loader")).toBeNull();
    });

    expect(screen.getByTestId("readme-page")).toBeTruthy();

    /* Axios.get must have been called again to fetch readme file */
    expect(Axios.get).toHaveBeenCalledTimes(2);

    /* Error message from the API is rendered */
    expect(screen.getByText(/Unable to fetch the readme file/i)).toBeTruthy();
  });

  it("The user is redirected to the home page, if the readme page is directly rendered and there is not owner data", async () => {
    render(
      <Router>
        <RepoReadme />
        <Route path="/">
          <UsernameForm />
        </Route>
      </Router>
    );

    await waitFor(() => {
      /* user is taken to the home page where he sees an input and a submit button */
      expect(screen.getByPlaceholderText("Enter Github Username")).toBeTruthy();
      expect(screen.getByRole("button", { name: /Submit/i })).toBeTruthy();
    });
  });
});
