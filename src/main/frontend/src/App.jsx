// Mebaselassie Kidane Kebede, mebkeb-0

import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Houses from "./components/Coursel/Houses.jsx";
import Contact from "./components/Contacts/Contact.jsx";
import GetStarted from "./components/GetStarted/GetStarted.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Register from "./components/Account/Register.jsx";
import PriceAnalysis from "./components/Analysis/PriceAnalysis.jsx"; 
import MarketAnalysis from "./components/WebSocket/MarketAnalysis.jsx";
import Input from "./components/WebSocket/Input.jsx";
import BidChart from "./components/WebSocket/BidChart.jsx";
import HouseList from "./components/Hero/HouseList.jsx";

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';



// Function that renders different components.
function App() {
    return (
   <Router>
  <div className="App">
    <Header />
    <Switch>
      <Route exact path="/"> {/* Only renders Hero component */}
        <Hero />
        <Houses />
        <Contact />
        <Register />
        <GetStarted />
        <Footer />
        <Input />
        <BidChart />
      </Route>

      <Route path="/HouseList">
        <HouseList />  {/* HouseList component */}
      </Route>

      <Route path="/PriceAnalysis">
        <PriceAnalysis />  {/* PriceAnalysis component */}
      </Route>
      
      <Route path="/MarketAnalysis">
        <MarketAnalysis />  {/* MarketAnalysis component */}
      </Route>
      
    </Switch>
    

  </div>
</Router>

    );
}

export default App;

