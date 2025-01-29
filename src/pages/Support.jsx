import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import Chat from '../components/Chat';


function Support() {
  const [tokenData, setTokenData] = useState([]);
  const [selectedTokenID, setSelectedTokenID] = useState(null);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('issue_token')
        .select('*')
        .eq('issue_status', 'open')
        .order('token_id', { ascending: false });

      if (error) throw error;

      console.log('Fetched Data:', data);

      // ✅ **Fix: Replace instead of appending**
      setTokenData(data); 

      if (data.length > 0 && selectedTokenID ===null) {
        setSelectedTokenID(data[0].token_id);
      }
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  };

  // ✅ **Fix: Call API only once**
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ **Fix: Real-time listener should not refetch all data**
  useEffect(() => {
    const subscription = supabase
      .channel('issue_token')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'issue_token' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchData(); // Fetch fresh data only when necessary
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className='w-full h-full flex items-center'>
      <div className='w-1/4 h-full border-r-2 p-3 flex flex-col gap-2 overflow-y-auto ' >
        {tokenData.length > 0 &&
          tokenData.map((token) => (
            <div
              className={`w-full h-fit p-2 border shadow-sm rounded-md cursor-pointer ${
                selectedTokenID === token.token_id ? 'border-green-500' : ''
              }`}
              key={token.token_id}
              onClick={()=>setSelectedTokenID(token.token_id)}
            >
              <p className='text-center text-base font-normal text-gray-700 mb-2'>{token.issue}</p>
              <div className='w-full flex items-center justify-between text-xs font-medium text-gray-600'>
                <p>{formatDate(token.created_at)}</p>
                <p>Priority: {token.priority}</p>
              </div>
            </div>
          ))}
      </div>
      <div className='w-3/4 h-full bg-slate-500'>
      <Chat tokenId={selectedTokenID}/>
      </div>
    </div>
  );
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export default Support;
