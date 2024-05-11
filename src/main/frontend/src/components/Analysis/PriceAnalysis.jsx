import React, { useState, useEffect } from 'react';
import './PriceAnalysis.css'
import Chart from 'chart.js/auto';
import { useRef } from 'react';


const PriceAnalysis = () => {

    const lineCanvasRef = useRef(null);
    const barCanvasRef = useRef(null);

    const [lineChartData, setLineChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Average House Prices (Line Chart)',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointRadius: 5,
            pointHitRadius: 10,
        }],
    });

    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Average House Prices (Bar Chart)',
            data: [],
            backgroundColor: 'rgba(192, 75, 192, 0.2)',
            borderColor: 'rgba(192, 75, 192, 1)',
            borderWidth: 1,
        }],
    });

   {/* const canvasRef = useRef(null);
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
  });*/}

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

        const formattedLineData = {
            labels: Object.keys(aggregatedData),
            datasets: [{
                label: 'Average House Prices (Line Chart)',
                data: Object.keys(aggregatedData).map(year => aggregatedData[year].totalPrice / aggregatedData[year].count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointRadius: 5,
                pointHitRadius: 10,
            }],
        };

        const formattedBarData = {
            labels: Object.keys(aggregatedData),
            datasets: [{
                label: 'Average House Prices (Bar Chart)',
                data: Object.keys(aggregatedData).map(year => aggregatedData[year].totalPrice / aggregatedData[year].count),
                backgroundColor: 'rgba(192, 75, 192, 0.2)',
                borderColor: 'rgba(192, 75, 192, 1)',
                borderWidth: 1,
            }],
        };

        setLineChartData(formattedLineData);
        setBarChartData(formattedBarData);
      });
  }, []);

       {/* const formattedData = {
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
    }, []); */}

    useEffect(() => {
      const lineCtx = lineCanvasRef.current.getContext('2d');
      const lineChart = new Chart(lineCtx, {
      
      //  const ctx = canvasRef.current.getContext('2d');
      //  const chart = new Chart(ctx, {
        type: 'line',
        data: lineChartData,
        //data: chartData,
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
      return () => lineChart.destroy();
    }, [lineChartData]);

      // return () => chart.destroy();
    //}, [chartData]);

    useEffect(() => {
        const barCtx = barCanvasRef.current.getContext('2d');
        const barChart = new Chart(barCtx, {
            type: 'bar',
            data: barChartData,
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
                            beginAtZero: true,
                        },
                    }],
                },
            },
        });
        return () => barChart.destroy();
    }, [barChartData]);

    return (
        <section className ="hero-wrapper">
            
            {/*<div>
            <canvas ref={canvasRef} /> 
            </div>*/}

            <div>
                <canvas ref={lineCanvasRef} />
            </div>

            <div>
                <canvas ref={barCanvasRef} />
            </div>

            <PriceAnalysis />
  
        </section>
    )

}

export default PriceAnalysis;