import './App.css'
// import react router and import the AdminDashboard component and the Login component from the pages folder
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'

function App() {
  // continue implementing the routing logic

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard/:id" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
