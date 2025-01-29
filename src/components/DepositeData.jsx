import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
function DepositeData() {
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
        .from('deposits')
        .select('*', { count: 'exact' }) // Fetch data with total count
        .eq('deposit_status', 'success')
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
        .channel('deposits')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'deposits' },
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
  
    // Define columns for the Ant Design Table
    const columns = [
      {
        title: 'Sl. No.',
        dataIndex: 'sl',
        key: 'sl',
        render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      },
      {
        title: 'User ID',
        dataIndex: 'user_id',
        key: 'user_id',
      },
      {
        title: 'User Name',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: 'Deposit Amount',
        dataIndex: 'deposit_amount',
        key: 'deposit_amount',
      },
      {
        title: 'Transaction ID',
        dataIndex: 'deposit_transaction_id',
        key: 'deposit_transaction_id',
      },
      {
        title: 'Status',
        dataIndex: 'deposit_status',
        key: 'deposit_status',
      },
      {
        title: 'Payment To',
        dataIndex: 'payment_to',
        key: 'payment_to',
      },
      {
        title: 'Initiate At',
        dataIndex: 'initiate_time',
        key: 'initiate_time',
        render: (text) => new Date(text).toLocaleString(),
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Button type="primary" onClick={() => handleAction(record)}>
            Action
          </Button>
        ),
      },
    ];
  
    // Handle action button click
    const handleAction = (record) => {
      console.log('Action clicked for:', record);
      navigation("/d-config",{ state: { record } });
      // Add your logic here
    };
  
   console.log(depositedata)
  
  
    return (
      <div>
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
  }

export default DepositeData