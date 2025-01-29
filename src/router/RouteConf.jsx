import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Transaction from '../pages/Transaction';
import Deposite from '../pages/Deposite';
import Withdraw from '../pages/Withdraw';
import Support from '../pages/Support';
import UpdateDeposite from '../pages/UpdateDeposite';
import UpdateWithdraw from '../pages/UpdateWithdraw';

function RouteConf() {
  return (

    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/deposit" element={<Deposite />} />
      <Route path="/withdraw" element={<Withdraw />} />
      <Route path="/support" element={<Support />} />
      <Route path="/d-config" element={<UpdateDeposite/>}/>
      <Route path="/w-config" element={<UpdateWithdraw/>}/>
    </Routes>

  )
}

export default RouteConf