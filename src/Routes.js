import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
<<<<<<< HEAD
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";

=======
>>>>>>> c8ed075775d2aea16303c19f6f2e44273903df7b

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
<<<<<<< HEAD
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/notes/new">
        <NewNote />
      </Route>
      <Route exact path="/notes/:id">
        <Notes />
      </Route>

      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
=======
>>>>>>> c8ed075775d2aea16303c19f6f2e44273903df7b
    </Switch>
  );
}
