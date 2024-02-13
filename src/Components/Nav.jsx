import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2";
import storage from '../Storage/storage'
import {sendRequest} from '../functions'
import axios from "axios";

export const show_alerta= (msj, icon)=> {
    Swal.fire({title:msj, icon:icon, buttonsStyling:true});
}

const Nav = () => {

    const go= useNavigate();
    const logout= async()=> {
        const datos = JSON.parse(localStorage.authToken);
        storage.remove('authToken');
        storage.remove('authUser');        
        await axios.get('api/logout', datos);        
        go('/login');
    }

  return (
   <nav className="navbar navbar-expand-lg navbar-white bg-info">
        <div className="container-fluid">
            <a className="navbar-brand">INVOICE</a>
            <button className="navbar-toggler" type="button" data-bs-toggler= 'collapse'
            data-bs-target="#nav" aria-controls= "navbarSupportedContent">
                <span className="navbar-toggler icon"></span>
            </button>
        

        {storage.get('authUser') ? (
            <div className="collapse navbar-collapse" id="nav">
                <ul className="navbar-nav mx-auto mb-2">                    
                    <li className="nav-item px-lg-5 h4">
                        {storage.get('authUser').name}
                    </li>
                    <li className="nav-item px-lg-5">
                        <Link to="/" className= "nav-link">CLIENTES</Link>
                    </li>
                    <li className="nav-item px-lg-5">
                        <Link to="/company" className= "nav-link">EMPRESAS</Link>
                    </li>
                    <li className="nav-item px-lg-5">
                        <Link to="/invoice" className= "nav-link">FACTURAR</Link>
                    </li>
                </ul>
                <ul className="navbar-nav mx-auto mb-2"> 
                    <li className="nav-item px-lg-5">
                       <button className="btn btn-info" onClick={logout}>Logout</button>
                    </li>
                </ul>
                
            </div>
        ):''}
        
        </div>
   </nav>
  )
}

export default Nav