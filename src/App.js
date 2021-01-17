import React from "react";
import MainContainer from "./components/MainContainer";
import Navbar from "./components/Navbar";
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <Navbar />
          <MainContainer />
        </div>
      </div>
    );
  }
}

export default App;
