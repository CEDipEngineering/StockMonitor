import React from "react";

import { Box } from "@mui/system";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

class Summary extends React.Component {

  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data
    };
  }

  componentDidMount() {
  }

  render() {
    const { data } = this.state;
    const isProfit = data["Profit"]>1;
    const color = isProfit?"Green":"Red";
    const arrowStyle = {"display": "flex", "justifyContent": "center", "alignItems": "center", "color": color};
    return (
        <Box>
            {/* <p>Summary: {JSON.stringify(data)}</p> */}
            <Box style={{"display": "flex", "flexFlow": "row", "alignItems": "center"}}>
              <p style={{"fontSize": "1.25rem"}}>Stock: {data["Name"]}&nbsp;</p>
              <p style={{"fontSize": "0.65rem", "marginTop": "0.9rem"}}>  ({data["Key"]})  </p>
            </Box>
            <Box style={{"display": "flex", "flexFlow": "row"}}>
              <p style={{"color": color, 'margin':"0.3rem 0"}}>Profit: {(data["Profit"]*100).toFixed(2)}% </p>
              {isProfit?<ArrowUpwardIcon style={arrowStyle}/>:<ArrowDownwardIcon style={arrowStyle}/>}
            </Box>
            <Box style={{"display": "flex", "flexFlow": "row"}}>
              <p style={{'margin':"0.3rem 0"}}>
                Invested Value: R${data["Investment"].toFixed(2)} <br/> 
                Current Value: R${(data["Investment"]*data["Profit"]).toFixed(2)} <br/>
                Percentage of Portfolio: {(data["PercentageWorth"]*100).toFixed(2)}%
              </p>
            </Box>
        </Box>
    );
}
}

export default Summary;
