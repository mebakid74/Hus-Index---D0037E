import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './PriceAnalysis.css';
import 'chartjs-adapter-date-fns';

const PriceAnalysis = () => {
  // State variables
  const [houseData, setHouseData] = useState([]);
  const [activeChart, setActiveChart] = useState('line-chart');
  const [lineChart, setLineChart] = useState(null);
  const [pieChart, setPieChart] = useState(null);
  const [stapleChart, setStapleChart] = useState(null); // State for the third chart

   // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8081/list_analysis');
      const data = await response.json();
      setHouseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Render charts when houseData changes
  useEffect(() => {
    if (houseData.length > 0) {
      renderLineChart();
      renderPieChart();
    }
  }, [houseData]);


    // Line Chart
    const renderLineChart = () => {
      const aggregatedData = {};
      houseData.forEach(house => {
        const year = new Date(house.DocumentDate).getFullYear();
        if (!aggregatedData[year]) {
          aggregatedData[year] = {
            totalPrice: house.SalePrice,
            count: 1,
          };
        } else {
          aggregatedData[year].totalPrice += house.SalePrice;
          aggregatedData[year].count++;
        }
      });

      const labels = Object.keys(aggregatedData);
      const data = labels.map(year => aggregatedData[year].totalPrice / aggregatedData[year].count);

      const lineChartCtx = document.getElementById('line-chart').getContext('2d');
      if (lineChart) {
        lineChart.destroy();
      }

      const newLineChart = new Chart(lineChartCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Genomsnittliga fastighetpriser',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 5,
            pointHitRadius: 10,
          }],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'year',
                displayFormats: {
                  year: 'yyyy',
                },
              },
            },
            y: {
              ticks: {
                beginAtZero: false,
              },
            },
          },
        },
      });
      setLineChart(newLineChart);
    };

    // Pie Chart
    const renderPieChart = () => {
      const priceRanges = {
        'Minder än $100,000': 0,
        '$100,000 - $200,000': 0,
        '$200,000 - $300,000': 0,
        '$300,000 - $400,000': 0,
        '$400,000 - $500,000': 0,
        'Större än $500,000': 0,
      };
      houseData.forEach(house => {
        const price = house.SalePrice;
        if (price < 100000) {
          priceRanges['Minder än $100,000']++;
        } else if (price >= 100000 && price < 200000) {
          priceRanges['$100,000 - $200,000']++;
        } else if (price >= 200000 && price < 300000) {
          priceRanges['$200,000 - $300,000']++;
        } else if (price >= 300000 && price < 400000) {
          priceRanges['$300,000 - $400,000']++;
        } else if (price >= 400000 && price < 500000) {
          priceRanges['$400,000 - $500,000']++;
        } else {
          priceRanges['Större än $500,000']++;
        }
      });

      const pieChartCtx = document.getElementById('pie-chart').getContext('2d');
      if (pieChart) {
        pieChart.destroy();
      }
      const newPieChart = new Chart(pieChartCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(priceRanges),
          datasets: [{
            label: 'Fastigheter prisfördelning',
            data: Object.values(priceRanges),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
        },
      });
      setPieChart(newPieChart);
    };

  // Toggle active chart
  const toggleChart = (chartId) => {
    setActiveChart(chartId);
  };

  // Candle chart
  const renderStapleChart = () => {
    if (houseData.length > 0) {
      // Get the top 10 most expensive zip codes
      const sortedData = houseData.sort((a, b) => b.SalePrice - a.SalePrice).slice(0, 10);
      const zipcodes = sortedData.map(house => house.ZipCode);
      const prices = sortedData.map(house => house.SalePrice);

      const stapleChartCtx = document.getElementById('staple-chart').getContext('2d');
      if (stapleChart) {
        stapleChart.destroy();
      }

      const newStapleChart = new Chart(stapleChartCtx, {
        type: 'bar',
        data: {
          labels: zipcodes,
          datasets: [{
            label: 'Pris mot Postnummer',
            data: prices,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Postnummer',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Pris',
              },
              ticks: {
                beginAtZero: true,
              },
            },
          },
        },
      });
      setStapleChart(newStapleChart);
    }
  };


  return (
    <div className="chart-container">
      <div className="buttons-container">
        <button className='button' onClick={() => toggleChart('line-chart')}>Visa Prisutveckling</button>
        <button className='button' onClick={() => toggleChart('pie-chart')}>Visa Prisfördelning</button>
        <button className='button' onClick={() => { toggleChart('staple-chart'); renderStapleChart(); }}>Visa Top 10 dyra områden</button>
      </div>

      <canvas id="line-chart" style={{ display: activeChart === 'line-chart' ? 'block' : 'none' }}></canvas>
      <p style={{ display: activeChart === 'line-chart' ? 'block' : 'none' }}>
        Linjediagram som visar de genomsnittliga fastighetpriserna under åren.
      </p>

      <canvas id="pie-chart" style={{ display: activeChart === 'pie-chart' ? 'block' : 'none' }}></canvas>
      <p style={{ display: activeChart === 'pie-chart' ? 'block' : 'none' }}>
        Cirkeldiagram som visar fördelningen av fastighetpriser i olika intervall.
      </p>

      
      <canvas id="staple-chart" style={{ display: activeChart === 'staple-chart' ? 'block' : 'none' }}></canvas>
         <p style={{ display: activeChart === 'staple-chart' ? 'block' : 'none' }}>
        Stapeldiagram som visar de 10 dyraste områdena.
      </p>




    </div>
  );
};

export default PriceAnalysis;