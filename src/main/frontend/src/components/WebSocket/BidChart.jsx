import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BidChart = ({ bids = [] }) => {
    const data = {
        labels: bids.map((bid, index) => `Bid ${index + 1}`),
        datasets: [
            {
                label: 'Budgivningspris',
                data: bids.map((bid) => bid.amount),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    return <Line data={data} />;
};

BidChart.propTypes = {
    //bids: PropTypes.array,
    bids: PropTypes.arrayOf(PropTypes.shape({
        amount: PropTypes.number.isRequired,
    })).isRequired,
};

export default BidChart;
