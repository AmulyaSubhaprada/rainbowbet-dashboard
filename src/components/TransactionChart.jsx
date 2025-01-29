import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import supabase from '../supabaseClient';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TransactionChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Get current date and calculate the date 3 days ago
      const currentDate = new Date();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(currentDate.getDate() - 3);
      
      // Format dates to match your table data format (i.e., 'YYYY-MM-DD' for withdraw and deposit)
      const formattedThreeDaysAgo = threeDaysAgo.toISOString().split('T')[0];  // 'YYYY-MM-DD'
      const formattedCurrentDate = currentDate.toISOString().split('T')[0];  // 'YYYY-MM-DD'

      // Fetch withdraws for the last 3 days based on 'updated_at' field
      const { data: withdrawData, error: withdrawError } = await supabase
        .from('withdraws')
        .select('withdraw_amount, updated_at')
        .gte('updated_at', formattedThreeDaysAgo)
        .lte('updated_at', currentDate.toISOString())
        .eq('withdraw_status', 'Approved');
        
      // Fetch deposits for the last 3 days based on 'created_at' field
      const { data: depositData, error: depositError } = await supabase
        .from('deposits')
        .select('deposit_amount, created_at')
        .gte('created_at', formattedThreeDaysAgo)
        .lte('created_at', currentDate.toISOString())
        .eq('deposit_status', 'success');
        
      if (withdrawError || depositError) {
        console.error('Error fetching data', withdrawError || depositError);
        return;
      }

      // Process withdraws and deposits data by day
      const days = [
        formattedThreeDaysAgo, 
        new Date(currentDate.setDate(currentDate.getDate() - 1)).toISOString().split('T')[0],  // Yesterday
        formattedCurrentDate  // Today
      ];

      const withdrawAmounts = days.map(day => {
        const totalWithdraw = withdrawData.filter(item => item.updated_at.startsWith(day))
          .reduce((acc, item) => acc + item.withdraw_amount, 0);
        return totalWithdraw;
      });

      const depositAmounts = days.map(day => {
        const totalDeposit = depositData.filter(item => item.created_at.startsWith(day))
          .reduce((acc, item) => acc + item.deposit_amount, 0);
        return totalDeposit;
      });

      setData({
        labels: days.reverse(),  // Reverse to show the most recent day at the right
        withdrawAmounts: withdrawAmounts.reverse(),
        depositAmounts: depositAmounts.reverse(),
      });
    }

    fetchData();
  }, []);

  // Chart data setup
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Withdraw',
        data: data.withdrawAmounts,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',  // Red bars
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Deposit',
        data: data.depositAmounts,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',  // Green bars
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Withdraw vs Deposit (Last 3 Days)',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "45%", height: "250px"  }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default TransactionChart;
