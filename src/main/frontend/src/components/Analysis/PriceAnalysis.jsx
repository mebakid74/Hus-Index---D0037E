import React, { useState, useEffect } from 'react';
import './PriceAnalysis.css'
import Chart from 'chart.js/auto';
import { useRef } from 'react';


const PriceAnalysis = () => {

    const canvasRef = useRef(null);
        const [chartData, setChartData] = useState({
        labels: [],
            datasets: [{
            label: 'Average House Prices',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 5,
            pointHitRadius: 10,
    }],
  });

  useEffect(() => {
    fetch('http://localhost:8081/list_analysis')
      .then(response => response.json())
      .then(data => {
        const aggregatedData = {};
        data.forEach(house => {
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
        const formattedData = {
            labels: Object.keys(aggregatedData),
            datasets: [{
              label: 'Average House Prices',
              data: Object.keys(aggregatedData).map(year => aggregatedData[year].totalPrice / aggregatedData[year].count),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              pointRadius: 5,
              pointHitRadius: 10,
            }],
          };
          setChartData(formattedData);
        });
    }, []);
  
    useEffect(() => {
      const ctx = canvasRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'year',
                displayFormats: {
                  year: 'YYYY',
                },
              },
            }],
            yAxes: [{
              ticks: {
                beginAtZero: false, 
              },
            }],
          },
        },
      });
      return () => chart.destroy();
    }, [chartData]);

    return (
        <section className ="hero-wrapper">
            
            <div>
            <canvas ref={canvasRef} />
            </div>
  

        </section>
    )

}

export default PriceAnalysis;