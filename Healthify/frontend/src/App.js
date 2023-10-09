import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Devices from './Devices';
import Control from "./Control"
import Home from "./Home"
import Medications from './Medications';
import DoctorAppointments from './DoctorAppointments';
import DoctorMedications from './DoctorMedications';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path="/medications" element={<Medications/>} />
          <Route path="/doctor-appointments" element={<DoctorAppointments/>} />
          <Route path="/doctor-medications" element={<DoctorMedications/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
