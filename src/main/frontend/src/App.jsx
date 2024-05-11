// Mebaselassie Kidane Kebede, mebkeb-0

import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Houses from "./components/Coursel/Houses.jsx";
import Contact from "./components/Contacts/Contact.jsx";
import GetStarted from "./components/GetStarted/GetStarted.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Register from "./components/Account/Register.jsx";
import PriceAnalysis from "./components/Analysis/PriceAnalysis.jsx"; 

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Function that renders different components.
function App() {
    return (
        <Router> 
            <div className="App">
                <Header />
                <Switch>
                    <Route exact path="/" component={Hero} />
                    <Route path="/PriceAnalysis" component={PriceAnalysis} />
                </Switch>
                <Houses />
                <Contact />
                <GetStarted />
                <Footer />
                <Register />
            </div>
        </Router>
    );
}

export default App;

