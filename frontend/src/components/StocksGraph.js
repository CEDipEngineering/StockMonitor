import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
class StocksGraph extends React.Component {

  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      DataisLoaded: false
    };
  }

  componentDidMount() {
    fetch(
"http://localhost:8000/history")
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        let arr = [];
        for (let c of json) {
            arr.push({"Day":new Date(c["Day"]), "Close": c["Close"]})
        } 
        console.log(arr)
        this.setState({
          items: arr,
          DataisLoaded: true
        });
      });
  }
  render() {
    const { DataisLoaded, items } = this.state;
    if (!DataisLoaded) return <h3> Loading graphs.... </h3>;
    return (
        <LineChart 
            width={700}
            height={400}
            data={items}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Day" scale="time"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="Close" stroke="#ff7300" />
        </LineChart>
    );
}
}

export default StocksGraph;