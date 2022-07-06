import React from "react";
import { render } from 'react-dom';
import "./App.css"

import Fetcher from "./components/Fetcher";  // new

function App() {
  return (
    <div class="Fetcher">
      <Fetcher/>
    </div>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)