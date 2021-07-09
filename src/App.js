import React,{useEffect, useState} from 'react';
import './App.css';
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { useStateValue } from './StateProvider';
import db from "./firebase";

function App() {
const [{ user }, dispatch] = useStateValue();


  return (
    <div className="App">
      {!user ?(
      <Login/>
      ):(
        
        <div className="app_body">
      <Router>
        <Sidebar/>
          <Switch>
          <Route path="/rooms/:roomId">
            <Chat type="room"/>
          </Route>
          <Route path="/users/:roomId">
            <Chat type="user"/>
          </Route>
          <Route path="/">
            <Chat/>
          </Route>
        </Switch>
      </Router>
      </div>
      )}
      

    </div>
  );
}

export default App;
