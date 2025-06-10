import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './Components/Navbar';
import Footer from "./Components/Footer";

import './App.css'; 


function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <Provider store={store}>
      <div>
        <Navbar />
        <main >
          <Outlet />
        </main>
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
