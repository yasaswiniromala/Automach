import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewSignUp from './components/NewSignUp';
import NewLogin from './components/NewLogin';

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<NewLogin />} />
          <Route path="/signup" element={<NewSignUp />} />
          <Route path="/" exact element={<NewLogin />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
