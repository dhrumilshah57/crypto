import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Col, Row, Typography } from 'antd';
import axios from 'axios';
import millify from 'millify';

const { Title } = Typography;

const FutureData = ({ coinHistory, currentPrice, coinName, time, cryptoDetails }) => {
  const [coinData, setCoinData] = useState([]);
  const [futureData, setFutureData] = useState([]);

  const coinPrice = [];
  const coinTimestamp = [];
  const coinLowercase = coinName.toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinLowercase}/ohlc?vs_currency=usd&days=1`);
      setCoinData(data);
    };
    fetchData();
  }, [coinLowercase]);
  
  console.log("GECKO COIN " + coinData)
  if(coinData)
  useEffect(() => {
    const predictData = async () => {
      try {
        const data = { "0": (coinData.map((d) => [d[3], d[2], d[1], d[4], parseFloat(cryptoDetails['24hVolume']), parseFloat(cryptoDetails.marketCap)])) };
        console.log("REQ DATA : " + JSON.stringify(data))
        const res = await axios.post('http://127.0.0.1:8080/predict', data);
        setFutureData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    predictData();
  }, [coinData, cryptoDetails]);

  console.log("PREDICTED DATA : " + JSON.stringify(futureData));

  if (!coinData.length) return null;

  for (let i = 0; i < coinHistory?.data?.history?.length; i += 13) {
    const date = new Date(coinHistory?.data?.history[i]?.timestamp * 1000).toLocaleString();
    coinTimestamp.push(date);
  }

  const futurePrices = Object.values(futureData);

  console.log(futurePrices[0]);

  let prices = futurePrices[0];

  prices?.forEach((coinDataPoint) => {
    coinPrice.push(coinDataPoint);
  });

  let currentDate = new Date();
  for (let i = 1; i <= 24; i++) {
  let futureDate = new Date(currentDate.getTime());
  futureDate.setHours(currentDate.getHours() + i);
  coinTimestamp.push(futureDate.toLocaleString());}
  let values = coinPrice.toString()
  let newValues = values.split(',')

  console.log(coinPrice);
  const data = {
    labels: coinTimestamp,
    datasets: [
      {
        label: 'Price In USD',
        data: newValues,
        fill: false,
        backgroundColor: '#0071bd',
        borderColor: '#0071bd',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      <Col className="coin-value-statistics">
        <Col className="coin-value-statistics-heading">
          <Title level={3} className="coin-details-heading">{coinName} Value Predictions</Title>
          <p>All values are in US dollars.</p>
          <p>This data will get updated every 5 to 10 minutes.</p>
        </Col>
        <Line data={data} options={options} />
        {futureData.length > 0 && (
          <ul>
            {futureData.map((item, index) => (
              <li key={index}>{item.key}: {item.value}</li>
            ))}
          </ul>
        )}
      </Col>
    </>
  );
};

export default FutureData;