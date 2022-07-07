import React from "react";
import "./App.css"
import Box from '@mui/material/Box';
import { createRoot } from 'react-dom/client';

import StocksGraph from "./components/StocksGraph";
import Header from "./components/Header";

function App() {
  return (
    <Box className="Fetcher">
      <Header />
      <StocksGraph />
    </Box>
  )
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App/>);