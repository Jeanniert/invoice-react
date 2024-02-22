import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {sendRequest} from '../functions'
import DivInput from '../Components/DivInput'
import axios from 'axios'

const Register = () => {
  const [name, setName]= useState('');
  const [address, setAddress]= useState('');
  const [phone, setPhone]= useState('');
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');
  const go= useNavigate();
  
  const csrf= async()=>{
    await axios.get('/sanctum/csrf-cookie');
  }

  function formatPhoneNumber(input) {

    if (!input) return input;
    const numberInput = input.replace(/[^\d]/g, "");
    return numberInput;
  }

  const handlephoneNumber = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedPhoneNumber);
  };

  const register= async(e)=>{
    e.preventDefault();
    await csrf();
    const form ={name:name,address:address,phone:phone,email:email,password:password};
    const res= await sendRequest('POST', form,'/api/auth/register','', false);
    if(res.status== true){
      go('/login');
    }
  }
  return (
    <div className='container-fluid'>
    <div className='row mt-5'>
      <div className='col-md-4 offset-md-4'>
        <div className='card border border-primary'>
          <div className='card-header bg-primary border border-primary text-white'>
            REGISTER
          </div>
          <div className='card-body'>
            <form onSubmit={register}>
            <DivInput type='text' icon='fa fa-solid fa-user' value={name} className='form-control' placeholder='Name'
              required='required' handleChange={(e)=> setName(e.target.value)}/>

              <DivInput type='text' icon='fa fa-solid fa-location-dot' value={address} className='form-control' placeholder='Address'
              required='required' handleChange={(e)=> setAddress(e.target.value)}/>

              <div className='input-group mb-3'>
                  <span className='input-group-text'>
                    <i className='fa-solid fa-phone'></i>
                  </span>
                  <input type='tel' className='form-control' minLength="13" maxLength="13" placeholder='Phone' onChange={(e) => handlephoneNumber(e)} value={phone} />
              </div>

              <DivInput type='email' icon='fa fa-solid fa-at' value={email} className='form-control' placeholder='Email'
              required='required' handleChange={(e)=> setEmail(e.target.value)}/>

              <DivInput type='password' icon='fa fa-solid fa-key' value={password} className='form-control' placeholder='Password'
              required='required' handleChange={(e)=> setPassword(e.target.value)}/>
              <div className='d-grid col-10 mx-auto'>
                <button className='btn btn-primary'>
                  <i className='fa fa-solid fa-door-open'></i> Register
                </button>
              </div>
            </form>
            <Link to='/login'>
                <i className='fa fa-solid fa-user-plus'></i> login
              </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Register