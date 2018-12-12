import React from "react";
import { Switch, Route } from "react-router-dom";

import Merimee from "./merimee";
import Joconde from "./joconde";
import Mnr from "./mnr";
import Memoire from "./memoire";
import Palissy from "./palissy";
import Home from "./home";

import "./index.css";

export default props => {
  return (
    <div>
      <Switch>
        <Route path={`/recherche/`} exact component={Home} />
        <Route path={`/recherche/merimee`} component={() => <Merimee />} />
        <Route path={`/recherche/palissy`} component={() => <Palissy />} />
        <Route path={`/recherche/mnr`} component={() => <Mnr />} />
        <Route path={`/recherche/joconde`} component={() => <Joconde />} />
        <Route path={`/recherche/memoire`} component={() => <Memoire />} />
        <Route
          path={`/recherche-avancee/merimee`}
          component={() => <Merimee expert={true} />}
        />
        <Route
          path={`/recherche-avancee/palissy`}
          component={() => <Palissy expert={true} />}
        />
        <Route
          path={`/recherche-avancee/mnr`}
          component={() => <Mnr expert={true} />}
        />
        <Route
          path={`/recherche-avancee/joconde`}
          component={() => <Joconde expert={true} />}
        />
        <Route
          path={`/recherche-avancee/memoire`}
          component={() => <Memoire expert={true} />}
        />
      </Switch>
    </div>
  );
};
