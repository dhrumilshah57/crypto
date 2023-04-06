
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Col, Row, Typography } from 'antd';
import axios from 'axios';
import millify from 'millify';

const { Title } = Typography;



const FutureData = ({ coinHistory, currentPrice, coinName, time, cryptoDetails }) => {
  const [coinData, setCoinData] = useState();
  let coinPrice = [];

  let coinTimestamp = [];
  let coinLowercase = coinName.toLowerCase();
  for (let i = 0; i < coinHistory?.data?.history?.length; i += 13) {
    //this is how to convert timestamp to date
    let date = new Date(coinHistory?.data?.history[i]?.timestamp * 1000).toLocaleString()
    // console.log(date);
    coinTimestamp.push(date)
  }
  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${coinLowercase}/ohlc?vs_currency=usd&days=1`)
      .then((res) => setCoinData(res.data))
      .catch((error) => console.error(error));
  }, []);

  if (!coinData) return null;

  coinData.forEach((coinDataPoint) => {
    coinPrice.push(coinDataPoint[4]);
  });
  console.log(coinData)
  const obj = { ...coinData }
  //time,open,high,low,close avu order ave che 
  //high,low,open,close,volume,marketcap evu joie che
  // console.log(coinData[0]);
  console.log(obj[0][0]); //this is how to access all data

  // let future = [
  //   { key: 'high', value: obj[48][2] },
  //   { key: 'low', value: obj[48][3] },
  //   { key: 'open', value: obj[48][1] },
  //   { key: 'close', value: obj[48][4] },
  //   { key: 'volume', value: millify(cryptoDetails?.['24hVolume']) },
  //   { key: 'marketCap', value: millify(cryptoDetails?.marketCap) },
  // ];
  // future.map((items) => {
  //   console.log(items)
  // })
  let obj1 = { new_input: [] }
  const val = coinData.map((d) => d.slice(1, 5))
  const proper_value = val.map((d) => [d[2], d[1], d[0], d[3]])
  console.log(proper_value);
  obj1.new_input.push(proper_value)
  let values = coinPrice.toString()
  let newValues = values.split(',')
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
      {/* <Row className="chart-header">
        <Title level={2} className="chart-title">{coinName} Price Predictor </Title>
        <Col className="price-container">
          <Title level={5} className="price-change">Change: {coinHistory?.data?.change}%</Title>
          <Title level={5} className="current-price">Current {coinName} Price: $ {currentPrice}</Title>
          {coinPrice.length > 0 && (
            <Title level={5} className="current-price">
              {coinName} Price: $ {coinPrice[coinPrice.length - 1]}
            </Title>)}
        </Col>
      </Row> */}
      {/* <Line data={data} options={options} /> */}
      <Col className="coin-value-statistics">
        <Col className="coin-value-statistics-heading">
          <Title level={3} className="coin-details-heading">{coinName} Value Predictions</Title>
          <p>All values are in US dollars.</p>
          <p>This data will get updated every 5 to 10 minutes.</p>
          <p>Press the button to get future predicted price of {coinName}.</p>
        </Col>
        {/* {future.map((items) => (
          <Col className="coin-stats">
            <Col >
              <h4>{items.key}</h4>
            </Col>
            <h4 >{items.value}</h4>
          </Col>
        ))} */}

      </Col>
      <button>Predict</button>

    </>
  );
};

export default FutureData;
