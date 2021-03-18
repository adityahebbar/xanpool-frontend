import axios from "axios";

const API_ENDPOINT = "https://api.github.com";

export const getReposForUser = (username) => {
  return axios.get(`${API_ENDPOINT}/users/${username}/repos`);
};

export const getRepoReadme = (login, repoName) => {
  return axios.get(`${API_ENDPOINT}/repos/${login}/${repoName}/readme`);
};
