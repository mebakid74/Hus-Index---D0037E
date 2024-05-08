// Mebaselassie Kidane Kebede, mebkeb-0

import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Houses from "./components/Coursel/Houses.jsx";
import Contact from "./components/Contacts/Contact.jsx";
import GetStarted from "./components/GetStarted/GetStarted.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Register from "./components/Account/Register.jsx";
import HouseList from "./components/Hero/HouseList.jsx";

// Function that renders different components.
function App() {
    return (
        <div className = "App">
            <Header/>
            <Hero/>
            <Houses/>
            <Contact/>
            <GetStarted/>
            <Footer/>
            <Register/>
            {/*<HouseList/>*/}
        </div>
    );
}
export default App;
