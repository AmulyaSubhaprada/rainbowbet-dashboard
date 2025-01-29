import React, { useEffect, useState } from 'react'
import supabase from '../supabaseClient'
import CountUp from 'react-countup';

function DashboardHeader() {
    const[totalUser,setTotalUser]=useState(0);
    const[newUser,setNewUser]=useState(0)
    const[betAmount,setBetAmount]=useState(0)
    const[transactionData,setTransactionData]=useState({})

    useEffect(()=>{
        fetchTotaluserCount();
        fetchNewUser();
        fetchBetAmount();
        fetchTotalTransaction();
    },[])


  const fetchTotaluserCount=async()=>{
    let { data, error } = await supabase
  .rpc('get_total_user_count')
if (error){
     console.error(error)}
else {
    console.log(data,"tu")}
    setTotalUser(data||0)
  }
  const fetchNewUser=async()=>{
    let { data, error } = await supabase
  .rpc('get_total_user_count_today')
if (error){
     console.error(error)}
else {
    console.log(data,"Nu")}
    setNewUser(data||0)
  }
  const fetchBetAmount=async()=>{
    let { data, error } = await supabase
  .rpc('get_total_bet_amount')
if (error){
     console.error(error)}
else {
    console.log(data,"Nu")}
    setBetAmount(data||0)
  }
  const fetchTotalTransaction=async()=>{
    let { data, error } = await supabase
  .rpc('get_lifetime_withdraw_and_deposit')
if (error){
     console.error(error)}
else {
    console.log(data,"Nu")}
    setTransactionData(data[0]||0)
  }

  return (
    <div className='w-full h-fit px-4 py-5'>
        <div className='w-full flex items-center justify-center flex-wrap gap-4'>
          <div className='w-[250px] h-20 border bg-[orange] rounded-lg border-[orange] text-xl font-medium text-white uppercase flex flex-col gap-2 item-center justify-center'>
           
           <CountUp end={totalUser} />
           <p className='text-base'>Total user</p>
          </div>
          <div className='w-[250px] h-20 border bg-[blue] rounded-lg border-[blue] text-xl font-medium text-white uppercase  flex flex-col gap-2 item-center justify-center'>
           
           <p className='flex gap-1 text-center w-full items-center justify-center'>₹ <CountUp end={betAmount} /></p>
           <p className='text-base'>Bet Amount</p>
          </div>
          <div className='w-[250px] h-20 border bg-[orange] rounded-lg border-[orange] text-xl font-medium text-white uppercase  flex flex-col gap-2 item-center justify-center'>
          
           <CountUp end={newUser} />
           <p className='text-base'>New user</p>
          </div>
          
          </div>
        <div className='w-full flex items-center justify-center gap-4 mt-5 flex-wrap'>
          <div className='w-[350px] h-20 border bg-[red] rounded-lg border-[red] text-xl font-medium text-white uppercase flex flex-col  item-center justify-center p-2'>
           
         <p className='flex gap-1 text-center w-full items-center justify-center'> ₹<CountUp end={transactionData.total_withdraw_amount} /> </p>
          
           <p className='text-base'>Total Withdraw Amount</p>
          </div>
        
          <div className='w-[350px]  h-20 border bg-[green] text-white text-xl font-medium uppercase  rounded-lg border-[green]  flex flex-col  item-center justify-center'>
          <p className='flex gap-1 text-center w-full items-center justify-center'> ₹<CountUp end={transactionData.total_deposit_amount} /></p>
           <p className='text-base'>Total Deposite Amount</p>
          </div>
        </div>
        
    </div>
  )
}

export default DashboardHeader