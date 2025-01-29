import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import toast from 'react-hot-toast';

function UpdateDeposite() {
    const location = useLocation();
    const record = location.state?.record;
    const navigate=useNavigate();
    const[isLoading,setIsLoading]=useState(false);
    // console.log('Received record:', record);

    const handleApproveClick=()=>{
        setIsLoading(true);
        fetchUserDetails()
    }
  const fetchUserDetails=async()=>{
    const {data,error}=await supabase
                      .from("user")
                      .select("*")
                      .eq("id",record.user_id);
        if(error){
            console.log(error.message);
            
        } else{
        const wallet_balance=data[0].wallet_balance;
        updateDepositBalance(wallet_balance)
        }             
                         
  }

const updateDepositBalance=async(wallet_balance)=>{
    const   updateBalance = wallet_balance + record.deposit_amount;
     const{data,error}=await supabase
                      .from("user")
                      .update({wallet_balance: updateBalance})
                      .eq("id",record.user_id);
     if(error){
        console.log(error);
        
     }  else{
        updateDepositeTable();
     }               
}

const updateDepositeTable=async()=>{
    const {data,error}= await supabase
                       .from("deposits")
                       .update({deposit_status:"success"})
                       .eq("id",record.id);
      if(error){
        console.log(error);
        toast.error("Update failed Try again later");
        
      } else{
        setIsLoading(false);
        navigate("/deposit");
        toast.success("Update successfully");
      }                
}


  return (
    <div className='w-full h-full overflow-y-auto p-4'>
        <h2 className='w-full flex items-center justify-center uppercase font-mono font-bold text-xl text-wide text-green-950 mb-4'>Deposite Details</h2>

        <h3 className='w-full uppercase font-mono font-bold text-base text-wide text-black underline mb-8'>User ID : {record.user_id}</h3>
    <form className='w-fill grid grid-cols-2 gap-6'>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="deposit_amount" className='text-base font-mono font-bold uppercase text-black'>Deposit Amount</label>
         <input type="text"
          name='deposit_amount'
          value={record.deposit_amount}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="deposit_transaction_id" className='text-base font-mono font-bold uppercase text-black'>deposit transaction id</label>
         <input type="text"
          name='deposit_transaction_id'
          value={record.deposit_transaction_id}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="deposit_status" className='text-base font-mono font-bold uppercase text-black'>Deposit Status</label>
         <input type="text"
          name='deposit_status'
          value={record.deposit_status}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans capitalize text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="deposit_req_time" className='text-base font-mono font-bold uppercase text-black'>deposit request time</label>
         <input type="text"
          name='deposit_req_time'
          value={record.initiate_time}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
    </form>
    <div className='w-full flex items-center justify-center'>
     <div 
     onClick={handleApproveClick}
     className='py-2 px-6 flex items-center justify-center rounded bg-cyan-400 text-white uppercase text-base  font-sans font-bold tracking-wide mt-8 cursor-pointer'>{isLoading ?"Approving":"Approved"}</div>
    </div>
    </div>
  )
}

export default UpdateDeposite