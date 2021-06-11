import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import Signup from "./containers/Signup";
import Notes from "./containers/Notes";
import Suggest from "./containers/Suggest"; 
import AnotherSuggestion from "./containers/AnotherSuggestion";
import SuggestRestaurant from "./containers/SuggestRestaurant"; 
import SuggestActivity from "./containers/SuggestActivity"; 
import SuggestSong from "./containers/SuggestSong";




export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/signup">
        <Signup />
      </Route>

      <Route exact path="/suggestion">
        <Suggest />
      </Route>

      <Route exact path="/suggestion/another">
        <AnotherSuggestion />
      </Route>

      <Route exact path="/suggestion/restaurant">
        <SuggestRestaurant />
      </Route>

      <Route exact path="/suggestion/activity">
        <SuggestActivity />
      </Route>

      <Route exact path="/suggestion/song">
        <SuggestSong />
      </Route>

      <Route exact path="/notes/:id">
        <Notes />
      </Route>

      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
