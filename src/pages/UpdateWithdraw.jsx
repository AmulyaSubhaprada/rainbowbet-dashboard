import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import toast from 'react-hot-toast';
function UpdateWithdraw() {
    const location = useLocation();
    const record = location.state?.record;
    const navigate=useNavigate();
    const[isLoading,setIsLoading]=useState(false);
    const[errorMsg,setErrorMsg]=useState("")
    const[adminFormData,setAdminFormData]=useState({
        payment_through:"",
        transaction_id:"",
        debited_account_num:"",
        authorize_by:""
    })

    const{payment_through,transaction_id,debited_account_num,authorize_by}=adminFormData;
    const handleApproveClick=()=>{
        if(!payment_through && !transaction_id && !debited_account_num && !authorize_by){
            toast.error("Please fill first admin section data first")
            return;
        }
        setIsLoading(true);
        updateDepositeTable();
    }

    const handleChange=(e)=>{
       const {name,value}= e.target;
       setErrorMsg('');
       if(name ==="authorize_by"){
        if(value ===0 || value > 3){
            setErrorMsg("enter valid authorization Id");
            return;
        }
        
       }
       setAdminFormData({...adminFormData,[name]:value})
    }


const updateDepositeTable=async()=>{
    const currentTime = new Date()
    .toISOString()
    .replace("T", " ")
    .replace("Z", "+00");;
    const updateData={
        upi_transaction_id:transaction_id,
        pay_trough:payment_through,
        payment_from:debited_account_num,
        authorize_by:authorize_by,
        withdraw_status:"Approved",
        updated_at:currentTime
    }
    const {data,error}= await supabase
                       .from("withdraws")
                       .update(updateData)
                       .eq("id",record.id);
      if(error){
        console.log(error);
        setIsLoading(false);
        toast.error("Update failed Try again later");
        
      } else{
        setIsLoading(false);
        navigate("/withdraw");
        toast.success("Update successfully");
      }                
}


  return (
    <div className='w-full h-full overflow-y-auto p-4'>
        <h2 className='w-full flex items-center justify-center uppercase font-mono font-bold text-xl text-wide text-green-950 mb-4'>Deposite Details</h2>

        <h3 className='w-full uppercase font-mono font-bold text-base text-wide text-black underline mb-8'>User ID : {record.user_id}</h3>
    <form className='w-fill grid grid-cols-2 gap-6'>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="withdra_amount" className='text-base font-mono font-bold uppercase text-black'>Withdraw Amount</label>
         <input type="text"
          name='withdra_amount'
          value={record.withdraw_amount}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="withdraw_through" className='text-base font-mono font-bold uppercase text-black'>Withdraw Through</label>
         <input type="text"
          name='withdraw_through'
          value={record.withdraw_through}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="withdraw_status" className='text-base font-mono font-bold uppercase text-black'>Withdraw Status</label>
         <input type="text"
          name='withdraw_status'
          value={record.withdraw_status}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans capitalize text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="withdraw_request_time" className='text-base font-mono font-bold uppercase text-black'>Withdraw request time</label>
         <input type="text"
          name='withdraw_request_time'
          value={record.created_at}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="withdrawl_account" className='text-base font-mono font-bold uppercase text-black'>Withdrawl account</label>
         <input type="text"
          name='withdrawl_account'
          value={record?.withdral_account?.account_num || "NA"}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="ifsc" className='text-base font-mono font-bold uppercase text-black'>IFSC</label>
         <input type="text"
          name='ifsc'
          value={record?.withdral_account?.ifsc_code || "NA"}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="bank_name" className='text-base font-mono font-bold uppercase text-black'>Bank</label>
         <input type="text"
          name='bank_name'
          value={record?.withdral_account?.bank_name || "NA"}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="mobile" className='text-base font-mono font-bold uppercase text-black'>Mobile</label>
         <input type="text"
          name='mobile'
          value={record?.withdral_account?.mobile_num || "NA"}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="account_holder_name" className='text-base font-mono font-bold uppercase text-black'>A/C Name</label>
         <input type="text"
          name='account_holder_name'
          value={record?.withdral_account?.account_holder_name || "NA"}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="upi" className='text-base font-mono font-bold uppercase text-black'>UPI ID</label>
         <input type="text"
          name='upi'
          value={record?.withdral_account?.upi_id || "NA"}
          disabled
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
    </form>
    <div className='my-5 underline text-base font-bold uppercase text-red-500'>** Use for admin only **</div>
    <form className='w-fill grid grid-cols-2 gap-6'>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="payment_through" className='text-base font-mono font-bold uppercase text-black'>Payment Through</label>
         <input type="text"
          name='payment_through'
          value={payment_through}
          onChange={handleChange}
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="transaction_id" className='text-base font-mono font-bold uppercase text-black'>Transaction Id</label>
         <input type="text"
          name='transaction_id'
          value={transaction_id}
          onChange={handleChange}
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="debited_account_num" className='text-base font-mono font-bold uppercase text-black'>Debited Account Number</label>
         <input type="text"
          name='debited_account_num'
          value={debited_account_num}
          onChange={handleChange}
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
        </div>
        <div className='w-full flex flex-col gap-2 items-start'>
         <label htmlFor="authorize_by" className='text-base font-mono font-bold uppercase text-black'>Authorize By</label>
         <input type="text"
          name='authorize_by'
          value={authorize_by}
          onChange={handleChange}
          className='w-full px-5 py-1 border bg-slate-50 rounded text-base font-semibold font-sans text-gray-500'
           />
           {errorMsg !=="" && <p className='text-sm font-normal text-red-600'>{errorMsg}</p>}
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
export default UpdateWithdraw