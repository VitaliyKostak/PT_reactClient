import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import useRouter from './hooks/useRouter';
import useAuthentication from './hooks/useAuthentication';
import authenticationContext from './context/authenticationContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';



function App() {
  const { checkAuthentication, token, userId, login, logout } = useAuthentication();
  const isAuthenticated = checkAuthentication();
  console.log('auth', isAuthenticated);
  const router = useRouter(isAuthenticated)
  return (
    <authenticationContext.Provider value={{ token, userId, login, logout, isAuthenticated, checkAuthentication }}>
      <div className="App">
        <Router>
          {router}
        </Router>
      </div>
    </authenticationContext.Provider>
  );
}

export default App;
