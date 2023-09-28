
import Navbar from './components/navbar/navbar';
import Home from './components/home/home'
import AuctionList from './components/auction-list/auction-list'
import {Route, Routes } from 'react-router-dom';
import AuctionDetails from './components/auction-details/auction-details';
import AuctionHistory from './components/auction-history/auction-history';
import AuctionAdd from './components/auction-add/auction-add';
import AuctionSignup from './components/auction-signup/auction-signup';
import AuctionLogin from './components/auction-login/auction-login';
import PrivateRoute from './routers/PrivateRoute';

function App() {
  return (
    <div>
         <Navbar/>
         <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/auction-list' element={<AuctionList/>} />
            <Route path='/auction-details/:id' element={<AuctionDetails/>} />
            <Route path='/auction-history' element={
              <PrivateRoute><AuctionHistory/></PrivateRoute>
            } />
            <Route path='/auction-history/auction-details/:id' element={
              <PrivateRoute><AuctionDetails/></PrivateRoute>
            } />
            <Route path='/auction-add' element={
              <PrivateRoute><AuctionAdd/></PrivateRoute>
            } />
            <Route path='/auction-signup' element={<AuctionSignup/>} />
            <Route path='/auction-login' element={<AuctionLogin/>} />
         </Routes>
    </div>
  );
}

export default App;
