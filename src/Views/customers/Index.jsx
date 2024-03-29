import React, {useEffect, useState, useRef} from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import DivSelect from '../../Components/DivSelect';
import DivInput from '../../Components/DivInput';
import Modal from '../../Components/Modal';
import storage from '../../Storage/storage';
import axios from "axios";
import Swal from "sweetalert2";
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';

export const show_alerta= (msj, icon)=> {
  Swal.fire({title:msj, icon:icon, buttonsStyling:true});
}

const Customers = () => {

  
    const [customers, setCustomers]= useState([]);
    const [name,setName]= useState('');
    const [address,setAddress]= useState('');
    const [phone,setPhone]= useState('');
    const [logo,setLogo]= useState(null);
    const [id,setId]= useState('');
    const [identification_number,setIdentification_number]= useState('');
    const [company,setCompany]= useState('');

  const [operation,setOperation]= useState('');
  const [title,setTitle]= useState('');
  const [classLoad,setClassLoad]= useState('');
  const [classTable,setClassTable]= useState('d-none');
  const [rows,setRows]= useState(0);
  const [page,setPage]= useState(1);
  const [pageSize,setPageSize]= useState(0);
  const NameInput= useRef();
  const close= useRef();
  let method= '';
  let url= '';


  useEffect(()=>{
    getCustomers(1);

  },[]);

  const selectedHandler=e=>{
    setLogo(e.target.files[0]);
  }

  const authToken= storage.get('authToken');
  const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    Authorization: 'Bearer '+authToken
  }
});

  const send = async (e) => {
  
    e.preventDefault();
    if (operation == 1) {
      const form = new FormData();
        form.append("name",name);
        form.append("identification_number",identification_number);
        form.append("address",address);
        form.append("phone", phone);
        form.append("logo",logo);
        form.append("company",company);
        form.append("user_id", storage.get('authUser').id);    
        let res;
        
        await axiosInstance.post("api/customer", form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(
        response => {
            res= response.data;        
            show_alerta(response.data.message, 'success');
            clear();
            getCustomers(page);           
            
        }).catch( (errors)=>{
            show_alerta(errors.response.data.message, 'error')
        })
        close.current.click();
        return res;

    }else{
      method= 'PUT';
      url= 'api/customer/'+id;
      const form= {name:name,address:address,phone:phone,company:company, user_id:storage.get('authUser').id};
      const res= await sendRequest(method,form,url,'');
      close.current.click();
      getCustomers(page);
    }
                  
  };

  const getCustomers = async() =>{
    const res = await sendRequest('GET', '', 'api/customer','');
    setCustomers(res.data);
    setClassTable('')
    setClassLoad('d-none');
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

  const deleteCustomer = (id, name)=>{
    confirmation(name,'api/customer/'+id,'/');

  }
  
  const clear= ()=>{
      setName('');
      setIdentification_number('');
      setAddress('');
      setPhone('');
      setLogo(null);
      setCompany('');
  }
  
  const openModal= (op,name,identification_number,address,phone,company,em)=> {
    clear();
    setTimeout(()=> NameInput.current.focus(), 600);
    setOperation(op);
    setId(em);

    if (op == 1) {
      setTitle('Create Customer');  

    }else{
      setTitle('Update Customer');
      setName(name);
      setIdentification_number(identification_number);
      setAddress(address);
      setPhone(phone);
      setCompany(company);
    }
  }

  const goPage= (p)=> {
    setPage(p);
    getCustomers(p);

  }
  return (
    <div className='container-md'>
      <div className="card ">
        <div className="card-header">
          Lista de Clintes
        </div> 
        <DivAdd>
          <button className='btn btn-info' data-bs-toggle='modal' data-bs-target='#modalCustomer' 
          onClick={()=> openModal(1)}> <i className='fa fa-solid fa-circle-plus'></i> add
          </button>
        </DivAdd>

        <div className="card-body">
          <DivTable col='10' off='1' classLoad={classLoad} classTable={classTable}>
            <table className='table table-striped'>
              <thead>
              <tr>
                  <th>N°</th>
                  <th>LOGO</th>
                  <th>CLIENTE</th>
                  <th>DIRECCIÓN</th>
                  <th>TELÉFONO</th>               
                  <th>EMPRESA</th>
                  <th>RIF / DNI</th>
                  <th>USUARIO</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
              {customers.map( (row,i) => (
                  <tr key={row.id}>
                    <td>{(i+1)}</td>
                    <td>
                      <img className="avatar-60 rounded" width="40" height="40"
                      src={'http://127.0.0.1:8000/storage/customers/'+row.logo} />
                    </td>
                    <td>{row.name}</td>
                    <td>{row.address}</td>
                    <td>{row.phone}</td>
                    <td>{row.company}</td>
                    <td>{row.identification_number}</td> 
                    <td>{row.user}</td> 
                    <td>
                    <button className='btn btn-warning btn-sm' data-bs-toggle='modal' data-bs-target='#modalCustomerEdit' 
                    onClick={()=> openModal(2,row.name,row.identification_number,row.address,row.phone,row.company,row.id)}>
                      <i className='fa fa-solid fa-edit'></i>
                    </button>
                    </td>
                    <td>
                      <button className='btn btn-danger btn-sm' onClick={()=> deleteCustomer(row.id, row.name)}>
                        <i className='fa fa-solid fa-trash'></i>
                      </button>
                    </td>
                  </tr>
                ))}            
              </tbody>
            </table>
            <PaginationControl changePage={page=> goPage(page)} next={true} limit={pageSize} page={page} total={rows}/>
          </DivTable>
        </div>

        <Modal title={title} modal='modalCustomer'>
          <div className='modal-body'>
            <form onSubmit={send}>

            <DivInput type='text' icon='fa fa-solid fa-user' value= {name} className='form-control'
                            placeholder= 'Nombre'  required='required' ref={NameInput} 
                            handleChange={(e)=>setName(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-address-card' value= {identification_number} className='form-control'
                                placeholder= 'RIF / DNI'  required='required' ref={NameInput} 
                                handleChange={(e)=>setIdentification_number(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-location-dot' value= {address} className='form-control'
                                placeholder= 'Dirección'  required='required' ref={NameInput} 
                                handleChange={(e)=>setAddress(e.target.value)} />

                            <div className='input-group mb-3'>
                                <span className='input-group-text'>
                                  <i className='fa-solid fa-phone'></i>
                                </span>
                                <input type='tel' className='form-control' minLength="11" maxLength="13"
                                placeholder='Phone' onChange={(e) => handlephoneNumber(e)} value={phone} />
                            </div>
                             
                            
                                  <div className='input-group mb-3'>
                                  <span className='input-group-text'>
                                      <i className='fa fa-solid fa-image'></i>
                                  </span>
                                  <input type="file" onChange={selectedHandler} className='form-control' required='required' />
                                  </div>
                               

                            <DivInput type='text' icon='fa fa-solid fa-building' value= {company} className='form-control'
                                placeholder= 'Empresa'  required='required' ref={NameInput} 
                                handleChange={(e)=>setCompany(e.target.value)} />
              
              <div className='d-grid col-10 mx-auto'>
                <button className='btn btn-success'>
                  <i className='fa fa-solid fa-save'></i>  save
                </button>
              </div>
            </form>
          </div>

          <div className='modal-footer'>
            <button className='btn btn-dark' data-bs-dismiss='modal' ref={close}> Close</button>
          </div>
        </Modal>

        <Modal title={title} modal='modalCustomerEdit'>
          <div className='modal-body'>
            <form onSubmit={send}>

            <DivInput type='text' icon='fa fa-solid fa-user' value= {name} className='form-control'
                            placeholder= 'Nombre'  required='required' ref={NameInput} 
                            handleChange={(e)=>setName(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-address-card' value= {identification_number} className='form-control'
                                placeholder= 'RIF / DNI'  required='required' ref={NameInput} 
                                handleChange={(e)=>setIdentification_number(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-location-dot' value= {address} className='form-control'
                                placeholder= 'Dirección'  required='required' ref={NameInput} 
                                handleChange={(e)=>setAddress(e.target.value)} />
                             
                             <div className='input-group mb-3'>
                                <span className='input-group-text'>
                                  <i className='fa-solid fa-phone'></i>
                                </span>
                                <input type='tel' className='form-control' minLength="13" maxLength="13"
                                placeholder='Phone' onChange={(e) => handlephoneNumber(e)} value={phone} />
                            </div>
                               

                            <DivInput type='text' icon='fa fa-solid fa-building' value= {company} className='form-control'
                                placeholder= 'Empresa'  required='required' ref={NameInput} 
                                handleChange={(e)=>setCompany(e.target.value)} />
              
              <div className='d-grid col-10 mx-auto'>
                <button className='btn btn-success'>
                  <i className='fa fa-solid fa-save'></i>  save
                </button>
              </div>
            </form>
          </div>

          <div className='modal-footer'>
            <button className='btn btn-dark' data-bs-dismiss='modal' ref={close}> Close</button>
          </div>
        </Modal>

    </div>
  </div>
  )
}

export default Customers