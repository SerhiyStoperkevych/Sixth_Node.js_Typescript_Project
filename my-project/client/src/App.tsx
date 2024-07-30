import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import List from './components/list/List';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/logIn" />} />
        <Route path="/logIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/list" element={<List />} />
      </Routes>
    </Router>
  );
};

export default App;
