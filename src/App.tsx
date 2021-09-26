/**
 * @name App
 * @author Lester
 * @date 2021-05-19 19:24
 */

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from 'src/layout/Layout';
import Login from 'src/pages/Login/Login';
import Context from 'src/store';

const App: React.FC = () => {
  return (
    <Context>
      <Router basename="/tenacity-oms">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={Layout} />
        </Switch>
      </Router>
    </Context>
  );
};

export default App;
