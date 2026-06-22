import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DeliveryLog from './pages/deliveryLog';
import Deliveryverify from './pages/deliveryverify';
import ProtectedDeliveryBoy from './auth/authroute';
import Location from './pages/location';
import Deliverydashboard from './pages/deliverydashboard';

function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<DeliveryLog />} />
                    <Route path="/deliveryBoy-auth-success" element={<Deliveryverify />} />             
                    <Route element={<ProtectedDeliveryBoy />}>
                        <Route path="/location" element={<Location />} />
                        <Route path='/' element={<Deliverydashboard />} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
