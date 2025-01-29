import React, { useEffect, useRef, useState } from 'react'
import { User,Send  } from 'lucide-react';
import supabase from '../supabaseClient';

function Chat({tokenId}) {
    const[message,setMessage]=useState('');
    const[messageData,setMessageData]=useState([]);

    const messagesEndRef = useRef(null);

   
     

      useEffect(() => {
        if (tokenId) {
            fetchMessage();
    
          const subscription = supabase
            .channel("support_message") 
            .on(
              "postgres_changes",
              {
                event: "INSERT",
                schema: "public",
                table: "support_message",
                filter: `token_id=eq.${tokenId}`,
              },
              (payload) => {
                console.log("New message received:", payload);
                setMessageData((prevMessages) => [...prevMessages, payload.new]);
              }
            )
            .subscribe();
    
          return () => {
            supabase.removeChannel(subscription);
          };
        }
      }, [tokenId]);

      useEffect(() => {
        scrollToBottom();
      }, [messageData]);

    const handleSendMessage=()=>{
        if(message === ""){
            toast.error("first type some message");
        }else{
            SendMessage()
        }
    }


    const SendMessage=async()=>{
        const insertMessage={
            token_id:tokenId,
            message:message,
            user_type:"admin"
        }
      const {error}=await supabase
                  .from("support_message")
                  .insert(insertMessage);
           if(error){
            toast.error("message send failed try again later");
            console.log(error.message);
            
           }else{
            setMessage("");

           }       
    }



const fetchMessage=async()=>{
    const {data,error}=await supabase
                       .from("support_message")
                       .select("*")
                       .eq("token_id",tokenId)
                       .order("id",{ascending:true});
         if(error){
            console.log(error);
            
         }
         else{
            if(data.length > 0){
                setMessageData(data);
            }
         }
}

const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className='w-full h-full p-4'>
      <div style={{height:"calc(100% - 48px)",scrollbarWidth:"none"}} className='w-full overflow-y-auto '>
                 {messageData.length > 0 && messageData.map((message,index)=>{
                    return(
             <div className={`w-full flex flex-col  ${message.user_type ==="user" ? 'items-start':"items-end"} gap-1 mt-2`} key={index}>
                 
              <div className={`h-fit p-2 text-gray-900 font-sans text-sm font-semibold ${message.user_type ==="user" ?"bg-gray-200 text-right rounded-es-2xl rounded-r-2xl":"bg-white text-left rounded-se-2xl rounded-l-2xl"}`} style={{maxWidth:"60%"}}>
                {message.message}
              </div>
              </div>
                    )
                 })}
             <div ref={messagesEndRef} />
         
             </div>  

            <div className='w-full h-12 bg-gray-200 mt-2 rounded-b-md px-2 py-1 flex items-center justify-between'>
             {/* <div className='w-8 h-8 p-1 rounded-full bg-gray-100 shadow-md'><User className='text-black'/></div> */}
             <div className='w-full h-full bg-gray-100 flex items-center rounded-lg shadow-lg'>
             <textarea name="message" id="message" value={message} placeholder='write your query here' onChange={(e)=>setMessage(e.target.value)} className='w-full h-full resize-none overflow-scroll text-sm font-semibold text-gray-900  rounded-l-md px-3 py-1 outline-none bg-gray-100 '/>
              <div className=' w-[100px]  h-full flex items-center justify-center bg-blue-500 rounded-r-lg rounded-es-3xl cursor-pointer' onClick={handleSendMessage} >
              <Send className='w-8 h-8 text-white' />
              </div>
              </div>
            </div>
    </div>
  )
}

export default Chat