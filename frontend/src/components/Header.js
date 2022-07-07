import React from "react";

import Box from '@mui/material/Box';

class Header extends React.Component {

  // Constructor
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    
  }
  render() {
    return (
        <Box display="flex"
        justifyContent="center"
        alignItems="center">
          <h1>Welcome to my Stock Monitoring Webpage!</h1>
        </Box>
    );
  }
}

export default Header;
