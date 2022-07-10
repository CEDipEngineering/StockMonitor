import React from "react";

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';


class StocksTable extends React.Component {

  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      details: this.props.details,
      names: this.props.names,
    };
  }

  // ComponentDidMount is used to
  // execute the code
  componentDidMount() {
  }

  render() {
    const { details, names } = this.state;
    const columns = [
      {field: "Name", headerName: "Stock", width: "100"},
      {field: "Key", headerName: "Key", width: "100"},
      {field: "Amount", headerName: "Amount", width: "75"},
      {field: "Investment", headerName: "Investment (R$)", width: "150", valueFormatter: (params) => {
          const formatted = Number(params.value).toFixed(2).toString();
          return `${formatted}`
        }
      },
      {field: "PurchasePrice", headerName: "Price at Purchase (R$/pt)", width: "200", valueFormatter: (params) => {
          const formatted = Number(params.value).toFixed(2).toString();
          return `${formatted}`
        }
      },
      {field: "Profit", headerName: "Profit", width: "125", valueFormatter: (params) => {
          const formatted = Number(params.value * 100).toFixed(2).toString();
          return `${formatted} %`
        }
      },
      {field: "PercentageWorth", headerName: "Percentage of Protfolio", width: "200", valueFormatter: (params) => {
        const formatted = Number(params.value * 100).toFixed(2).toString();
        return `${formatted} %`
      }
    }

    ];
    let rows = [];
    let index = 0;
    for (let n of names){
      rows.push({"id":index, "Name":n, ...details[n]});
      index++;
    }
    return (
      <Box sx={{ height: '36rem', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          rowsPerPageOptions={[names.length]}
        />
      </Box>
    );
  }
}

export default StocksTable;