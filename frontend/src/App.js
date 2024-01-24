import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext } from './contexts/AuthContext';

import Layout from './components/Layout';
import Splash from './pages/Splash';
import Search from './pages/Search';
import SignIn from './pages/Authentication_Pages/Signin';
import SignUp from './pages/Authentication_Pages/Signup';
import Home from './pages/Home'
import AvailCalendar from './components/ReserveForm/AvailCalendar';
import Account from './pages/Account';
import User from './pages/User';
import CommentForm from './components/CommentForm';
import HomeForm from './components/HomeForm';
import HostingHub from './pages/Hosting_Hub';
import Property_Portal from './pages/Property_Portal';
import { ResReloadContext } from './contexts/ResReloadContext';

function App() {
  const [isSignedIn, setSignedIn] = useState(false);
  const [val0, setVal0] = useState(false);
  const [val1, setVal1] = useState(false);
  const [val2, setVal2] = useState(false);
  const [val3, setVal3] = useState(false);
  const [val4, setVal4] = useState(false);
  const [val5, setVal5] = useState(false);
  const [val6, setVal6] = useState(false);
  const [val7, setVal7] = useState(false);
  var dict = {0: {val: val0, setVal: setVal0}, 1: {val: val1, setVal: setVal1}, 2: {val: val2, setVal: setVal2}, 3: {val: val3, setVal: setVal3}, 4: {val: val4, setVal: setVal4}, 5: {val: val5, setVal: setVal5}, 6: {val: val6, setVal: setVal6}, 7:{val: val7, setVal: setVal7}};
  return (
    <AuthContext.Provider value={{isSignedIn, setSignedIn}}>
      <ResReloadContext.Provider 
        value={dict}>
        {}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Splash />}/>
              <Route path="search" element={<Search/>}/>
              <Route path="account" element={<Account/>}/> 
              <Route path="hosting_hub" element={<HostingHub/>}/>
              <Route path="property_portal/:homeID" element={<Property_Portal/>}/>
              <Route path="signin" element={<SignIn/>}/>
              <Route path="signup" element={<SignUp/>}/>
              <Route path="home/:homeID" element={<Home />}/>
              <Route path="user/:userID" element={<User />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </ResReloadContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

