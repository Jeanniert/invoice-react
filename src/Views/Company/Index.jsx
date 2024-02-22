import React, {useEffect, useState, useRef} from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import DivInput from '../../Components/DivInput';
import Modal from '../../Components/Modal';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import storage from '../../Storage/storage';
import axios from "axios";
import Swal from "sweetalert2";

export const show_alerta= (msj, icon)=> {
  Swal.fire({title:msj, icon:icon, buttonsStyling:true});
}

const Company = () => {

  const [company,setCompany]= useState([]);
  const [name,setName]= useState('');
  const [address,setAddress]= useState('');
  const [phone,setPhone]= useState('');
  const [logo,setLogo]= useState(null);
  const [id,setId]= useState('');
  const [identification_number,setIdentification_number]= useState('');
  const [currency,setCurrency]= useState('');
  const [description,setDescription]= useState('');

  const [operation,setOperation]= useState();
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
    getCompany(1);

  },[]);

  const selectedHandler=e=>{
    setLogo(e.target.files[0]);
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


const authToken= storage.get('authToken');
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    Authorization: 'Bearer '+authToken
  }
});

const send = async (e) => {
  
  e.preventDefault();
  if(operation == 1){

    const form = new FormData();
    form.append("name",name);
    form.append("identification_number",identification_number);
    form.append("address",address);
    form.append("phone", phone);
    form.append("logo",logo);
    form.append("currency",currency);
    form.append("description",description);
    form.append("user_id", storage.get('authUser').id);
        
  let res;
      await axiosInstance.post("api/company", form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(
      response => {
          res= response.data;          
          show_alerta(response.data.message, 'success');
          clear();
          getCompany(page);
          setTimeout( ()=> NameInput.current,focus(), 3000);
          
      }).catch( (errors)=>{
          show_alerta(errors.response.data.message, 'error')
      })
      return res;

  }else{
      method= 'PUT';
      url= 'api/company/'+id;
      const form= {name:name,address:address,phone:phone,currency:currency,description:description, user_id:storage.get('authUser').id};
      const res= await sendRequest(method,form,url,'');
      close.current.click();
      getCompany(page);
    }
  
};


  const getCompany= async(page)=>{
    
    const res= await sendRequest('GET','','api/company?page='+page);
    setCompany(res.data);
    setRows(res.total);
    setPageSize(res.per_page);
    setClassTable('');
    setClassLoad('d-none');
  }


  const deleteCompany= (id, name)=> {
    confirmation(name,'api/company/'+id,'company');
  }
  
  const clear= ()=>{
    setName('');
    setIdentification_number('');
    setAddress('');
    setPhone('');
    setLogo(null);
    setCurrency('');
    setDescription('');
  }
  
  const openModal= (op,name,identification_number,address,phone,logo,currency,description,em)=> {
    clear();
    setTimeout(()=> NameInput.current.focus(), 600);
    setOperation(op);
    setId(em);

    if (op == 1) {
      setTitle('Create Company');  

    }else{
      setTitle('Update Company');
      setName(name);
      setIdentification_number(identification_number);
      setAddress(address);
      setPhone(phone);
      setLogo(logo);
      setCurrency(currency);
      setDescription(description);
    }
  }

  const goPage= (p)=> {
    setPage(p);
    getCompany(p);

  }
  return (
    <div className='container-fluid'>
        <DivAdd>
          <button className='btn btn-info' data-bs-toggle='modal' data-bs-target='#modalCompany' 
          onClick={()=> openModal(1)}> <i className='fa fa-solid fa-circle-plus'></i> add
          </button>
        </DivAdd>

        <DivTable col='10' off='1' classLoad={classLoad} classTable={classTable}>
          <table className='table table-bordered'>
            <thead>
            <tr>
                <th>N°</th>
                <th>LOGO</th>
                <th>EMPRESA</th>
                <th>RIF/DNI</th>
                <th>DIRECCIÓN</th>
                <th>TELÉFONO</th>               
                <th>MONEDA</th>
                <th>DESCRIPCIÓN</th>                
                <th>USUARIO</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
            {company.map( (row,i) => (
                <tr key={row.id}>
                  <td>{(i+1)}</td>
                  <td>
                  <img className="avatar-60 rounded" width="60" height="60"
                    src={'http://127.0.0.1:8000/storage/company/'+row.logo} />  
                  </td>
                  <td>{row.name}</td>
                  <td>{row.identification_number}</td> 
                  <td>{row.address}</td>
                  <td>{row.phone}</td>
                  <td>{row.currency}</td>
                  <td>{row.description}</td>                 
                  <td>{row.user}</td> 
                  <td>
                  <button className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalCompanyEdit' 
                  onClick={()=> openModal(2,row.name,row.identification_number,row.address,row.phone, row.logo,row.currency,row.description, row.id)}>
                    <i className='fa fa-solid fa-edit'></i>
                  </button>
                  </td>
                  <td>
                    <button className='btn btn-danger' onClick={()=> deleteCompany(row.id, row.name)}>
                      <i className='fa fa-solid fa-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}            
            </tbody>
          </table>
          <PaginationControl changePage={page=> goPage(page)} next={true} limit={pageSize} page={page} total={rows}/>
        </DivTable>

        <Modal title={title} modal='modalCompany'>
          <div className='modal-body'>
            <form onSubmit={send}>

            <DivInput type='text' icon='fa fa-solid fa-building' value= {name} className='form-control'
              placeholder= 'Empresa'  required='required' ref={NameInput} handleChange={(e)=>setName(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-address-card' value= {identification_number} className='form-control'
              placeholder= 'RIF / DNI'  required='required' ref={NameInput} handleChange={(e)=>setIdentification_number(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-location-dot' value= {address} className='form-control'
              placeholder= 'Dirección'  required='required' ref={NameInput} handleChange={(e)=>setAddress(e.target.value)} />

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

            <DivInput type='text' icon='fa fa-solid fa-coins' value= {currency} className='form-control'
              placeholder= 'Moneda'  required='required' ref={NameInput} handleChange={(e)=>setCurrency(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-clipboard' value= {description} className='form-control'
              placeholder= 'Descripción'  required='required' ref={NameInput} handleChange={(e)=>setDescription(e.target.value)} />
              
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

        <Modal title={title} modal='modalCompanyEdit'>
          <div className='modal-body'>
            <form onSubmit={send}>

            <DivInput type='text' icon='fa fa-solid fa-building' value= {name} className='form-control'
              placeholder= 'Empresa'  required='required' ref={NameInput} handleChange={(e)=>setName(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-address-card' value= {identification_number} className='form-control'
              placeholder= 'RIF / DNI'  required='required' ref={NameInput} handleChange={(e)=>setIdentification_number(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-location-dot' value= {address} className='form-control'
              placeholder= 'Dirección'  required='required' ref={NameInput} handleChange={(e)=>setAddress(e.target.value)} />

            <div className='input-group mb-3'>
              <span className='input-group-text'>
                <i className='fa-solid fa-phone'></i>
              </span>
              <input type='tel' className='form-control' minLength="11" maxLength="13"
              placeholder='Phone' onChange={(e) => handlephoneNumber(e)} value={phone} />
            </div>

            <DivInput type='text' icon='fa fa-solid fa-coins' value= {currency} className='form-control'
              placeholder= 'Moneda'  required='required' ref={NameInput} handleChange={(e)=>setCurrency(e.target.value)} />

            <DivInput type='text' icon='fa fa-solid fa-clipboard' value= {description} className='form-control'
              placeholder= 'Descripción'  required='required' ref={NameInput} handleChange={(e)=>setDescription(e.target.value)} />
              
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
  )
}

export default Company