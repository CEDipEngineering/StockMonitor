import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";

import StocksTable from "./StocksTable";
import Summary from "./Summary";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};



class TabbedMenu extends React.Component {

  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      details: {},
      names: [],
      portfolio_worth: [],
      value: 0,
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
      }).then((data) => {
        // Use each key on a separate async fetch to get all the historical data from backend
        var items = {};
        var fetches = [];
        var details = {};
        var portfolio_worth = [];
        for (let key of data) {
          fetches.push(
            fetch("http://localhost:8000/history?key=" + key)
              .then((res) => res.json())
              .then((json) => {
                let arr = [];
                for (let c of json) {
                  arr.push({ "Day": new Date(c["Day"]), "Close": c["Close"], "Avg": c["Avg"] })
                }
                items[key] = arr.slice();
              })
          );
          fetches.push(
            fetch("http://localhost:8000/details?key=" + key)
            .then((res) => res.json())
            .then((json) => {
              json["PurchaseDate"] = new Date(json["PurchaseDate"])
              details[key] = json;
            })
          );
        }
        fetches.push(
          fetch('http://localhost:8000/portfolio/worth')
          .then((res) => res.json())
          .then((json) => {
            let arr = [];
            // console.log(json);
            for (let c of json) {
              arr.push({ "Day": new Date(c["Day"]), "Portfolio": c["Portfolio"], 'Avg': c['Avg']})
            }
            portfolio_worth=arr.slice();
          })
        )

        // Await all fetches then save to state
        Promise.all(fetches).then(() => {
          this.setState({
            items: items,
            DataisLoaded: true,
            details: details,
            portfolio_worth: portfolio_worth
          });
          console.log(details['ITSA4.SA']['PurchaseDate']);
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

    const handleChange = (event, newValue) => {
      this.setState({ value: newValue });
    };

    const { DataisLoaded, items, names, value, details, portfolio_worth } = this.state;
    if (!DataisLoaded) return <h3> Loading graphs.... </h3>;
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Summary" index={0} key={0} />
            {
              names.map((name, index) => {
                return <Tab label={name} index={index + 1} key={index + 1} />
              })
            }
            <Tab label={"Portfolio"} index={names.length+1} key={names.length+1}/>
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <StocksTable details={details} names={names}/>
        </TabPanel>
        {
          names.map((name, index) => {
            return <TabPanel value={value} index={index + 1} key={index + 1}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={items[name]} >
                  <XAxis dataKey="Day" tickFormatter={(date) => { return monthObj[date.getMonth()] }} />
                  <YAxis type="number" domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="Close" stroke="#cc5000" strokeWidth={2} opacity={0.3} dot={false} name={name} />
                  <Line dataKey="Avg" stroke="#21c977" strokeWidth={2} opacity={1} dot={false} name={"Rolling Average"}/>
                </LineChart>
              </ResponsiveContainer>
              <Summary data={details[name]}/>
            </TabPanel>
          })
        }
        <TabPanel value={value} index={names.length+1}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={portfolio_worth} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Day" scale="time" tickFormatter={(date) => { return monthObj[date.getMonth()] }} />
              <YAxis type="number" domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip />
              <Legend />
              <Line dataKey="Portfolio" stroke="#cc5000" strokeWidth={2} opacity={0.3} dot={false} name={"Portfolio"} />
              <Line dataKey="Avg" stroke="#21c977" strokeWidth={2} opacity={1} dot={false} name={"Rolling Average"}/>
            </LineChart>
          </ResponsiveContainer>
        </TabPanel> 
      </Box>
    );
  }
}

export default TabbedMenu;