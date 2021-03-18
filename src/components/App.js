import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { UsernameForm } from "./pages/Home/UsernameForm/UsernameForm.component.jsx";
import { RepoReadme } from "./pages/RepoReadme/RepoReadme/RepoReadme.component";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/repo/:id">
            <RepoReadme />
          </Route>
          <Route exact path="/">
            <UsernameForm />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
