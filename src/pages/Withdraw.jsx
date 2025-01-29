import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { notification } from "antd";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";



const WithdrawTable = () => {
  const [depositedata, setDepositeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const navigation=useNavigate();
  // Fetch data from Supabase
  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('withdraws')
      .select('*', { count: 'exact' }) // Fetch data with total count
      .eq('withdraw_status', 'Pending')
      .order('id', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setDepositeData(data);
      setTotalRows(count);
    }

    setLoading(false);
  };

  // Set up real-time subscription for the deposits table
  useEffect(() => {
    const subscription = supabase
      .channel('withdraws')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'withdraws' },
        (payload) => {
          console.log('Real-time change received:', payload);
          fetchData(currentPage, pageSize); // Refetch data on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Cleanup subscription
    };
  }, [currentPage, pageSize]);

  // Fetch initial data
  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Withdraw Amount",
      dataIndex: "withdraw_amount",
      key: "withdraw_amount",
    },
    {
      title: "Withdraw Through",
      dataIndex: "withdraw_through",
      key: "withdraw_through",
    },
    {
      title: "Withdraw Status",
      dataIndex: "withdraw_status",
      key: "withdraw_status",
    },
    {
      title: "Action",
      key: "action",
      
         render: (_, record) => (
                <Button type="primary" onClick={() => handleAction(record)}>
                  Action
                </Button>
              ),
    },
  ];

  const handleAction = (record) => {
    console.log('Action clicked for:', record);
    navigation("/w-config",{ state: { record } });
    // Add your logic here
  };

  return (
   <div className="w-full h-full overflow-y-auto p-4">
        <div className="w-full text-center text-xl font-mono font-bold text-gray-900 uppercase">
          Withdraw Requests
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={depositedata}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalRows,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>
  );
};

export default WithdrawTable;
