import React from "react";
import { render } from 'react-dom';
import "./App.css"

import StocksTable from "./components/StocksTable";
import StocksGraph from "./components/StocksGraph";

function App() {
  return (
    <div className="Fetcher">
      <StocksTable/>
      <StocksGraph/>
    </div>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)