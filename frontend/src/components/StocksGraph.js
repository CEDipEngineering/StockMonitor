import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import "@mui/material/Stack"
import Stack from "@mui/material/Stack";

class StocksGraph extends React.Component {

  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      names: [],
      DataisLoaded: false
    };
  }

  componentDidMount() {
    
    
    // Get all stock names
    fetch("http://localhost:8000/history")
      .then((res) => res.json())
      .then((json) => {
        // console.log(json["data"])
        this.setState({
          names: json["data"]
        });
        return json["data"];
      }).then((data)=>{
        // Use each key on a separate async fetch to get all the historical data from backend
        var items = {};
        var fetches = [];
        for (let key of data){
            fetches.push(
                fetch("http://localhost:8000/history/?key="+key)
                .then((res) => res.json())
                .then((json) => {
                    let arr = [];
                    for (let c of json) {
                        arr.push({"Day":new Date(c["Day"]), "Close": c["Close"], "Avg": c["Avg"]})
                    }
                    items[key] = arr.slice(); 
                })
            );
        }
        // Await all fetches then save to state
        Promise.all(fetches).then(()=>{
            this.setState({
                items: items,
                DataisLoaded: true
            });
            console.log(items);
        })
      });



  }
  render() {
    const monthObj = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec"
    } 
    const { DataisLoaded, items, names } = this.state;
    if (!DataisLoaded) return <h3> Loading graphs.... </h3>;
    return (
        <Stack className="Stack">
            { names.map((name) => {
                return <div>
                <LineChart 
                width={700}
                height={400}
                data={items[name]} >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Day" scale="time" tickFormatter={(date) => {return monthObj[date.getMonth()]}} />
                    <YAxis type="number" domain={['dataMin - 2', 'dataMax + 2']}/>
                    <Tooltip />
                    <Legend />
                    <Line dataKey="Close" stroke="#cc5000" strokeWidth={2} opacity={0.3} dot={false} name={name}/>
                    <Line dataKey="Avg" stroke="#21c977" strokeWidth={2} opacity={1} dot={false}/>
                </LineChart>
                </div>
            })
        }
        </Stack>
    );
}
}

export default StocksGraph;