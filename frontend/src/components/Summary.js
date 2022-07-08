import React from "react";

import { Box } from "@mui/system";

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
    return (
        <Box>
            <p>Summary: {JSON.stringify(data)}</p>
            <p>Name: {data["Name"]}</p>
            <p>Profit: {data["Profit"].toFixed(4)*100}%</p>
            <p>PurchaseDate: {data["PurchaseDate"].toString()}</p>
            <p>PurchasePrice: R${data["PurchasePrice"].toFixed(2)}</p>
            <p>Investment: R${data["Investment"].toFixed(2)}</p>
            <p>Amount: {data["Amount"]}</p>
        </Box>
    );
}
}

export default Summary;
