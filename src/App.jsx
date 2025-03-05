import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import Planner from './pages/Planner'
import NutritionTracker from './pages/NutritionTracker'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Header from './components/Header/Header'
import Workout from './pages/Workout'
import Community from './pages/Community'
import { DataProvider } from './context/DataContext'
import TestDashboard from './components/TestDashboard'
import Dashboard from './pages/Dashboard'
import CursorEffect from './components/common/CursorEffect'

function App() {
  
  return (
    <DataProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <div className="px-10">
            <Header />
          </div>
          <Routes> 
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/meal-planner" element={<Planner />} />
            <Route path="/nutrition-tracker" element={<NutritionTracker />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/community" element={<Community />} />
            <Route path="/test" element={<TestDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <CursorEffect />
        </div>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
