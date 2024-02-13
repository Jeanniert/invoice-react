import { BrowserRouter, Routes, Route } from "react-router-dom"
import Nav from './Components/Nav'
import Customer from './Views/customers/Index'
import Company from './Views/Company/Index'
import Invoice from './Views/Invoice/Index'
import Login from './Views/Login'
import Register from "./Views/Register"
import ProtectedRoutes from './Components/ProtectedRoutes'

function App() {

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Customer />}/>
          <Route path="/company" element={<Company />}/>
          <Route path="/invoice" element={<Invoice />}/>
        </Route>        
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
