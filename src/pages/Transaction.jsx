import React, { useState } from 'react'
import DepositeData from '../components/DepositeData'
import WithdrawData from '../components/WithdrawData';

function Transaction() {
  const[isWithdraw,setIsWithdraw]=useState(false);
  return (
    <div className="w-full h-full overflow-y-auto p-4">
   <div className='w-full h-8 flex items-center'>
     <div className={`px-4 py-2 text-base font-medium ${isWithdraw ?"bg-blue-500 text-white":"bg-sky-50 text-gray-700"} rounded-t-xl border cursor-pointer`} onClick={()=>setIsWithdraw(true)} >Withdraw Transaction</div>
     <div className={`px-4 py-2 text-base font-medium ${!isWithdraw ?"bg-blue-500 text-white":"bg-sky-50 text-gray-700"} rounded-t-xl border cursor-pointer`} onClick={()=>setIsWithdraw(false)}>Deposite Transaction</div>
   </div>
     <div className='w-full h-fit'>
     {!isWithdraw ? <DepositeData/>: <WithdrawData/>}
      </div> 
    </div>
  )
}

export default Transaction