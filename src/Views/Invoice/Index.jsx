/*import React from 'react'
import FormFact from '../../Components/FormFact';

const Index = () => {
  return (
    <FormFact id={null} title='New Customer'></FormFact>
  )
}

export default Index

*/


import React, {useEffect, useState, useRef} from 'react';
import DivAdd from '../../Components/DivAdd';
import DivTable from '../../Components/DivTable';
import DivInput from '../../Components/DivInput';
import Modal from '../../Components/Modal';
import DivSelect from '../../Components/DivSelect';
import { confirmation, sendRequest } from '../../functions';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import storage from '../../Storage/storage';
import axios from "axios";
import Swal from "sweetalert2";

export const show_alerta= (msj, icon)=> {
  Swal.fire({title:msj, icon:icon, buttonsStyling:true});
}

const Index = () => {

    const [customerId,setCustomerId]= useState('');
    const [invoice,setInvoice]= useState([]);
    const [product, setProduct] = useState([{name :  "", quantity : "", unit_price : ""}]);
    const [customer,setCustomer]= useState([]);
    const [companyId,setCompanyId]= useState('');
    const [company,setCompany]= useState([]);
    const [total,setTotal]= useState('');
    const [tax,setTax]= useState('');  
    const NameInput= useRef();
    let method= 'POST';
    let url= 'api/invoice'
    let redirect= '';

  const [id,setId]= useState('');
  const [operation,setOperation]= useState();
  const [title,setTitle]= useState('');
  const [classLoad,setClassLoad]= useState('');
  const [classTable,setClassTable]= useState('d-none');
  const [rows,setRows]= useState(0);
  const [page,setPage]= useState(1);
  const [pageSize,setPageSize]= useState(0);
  const close= useRef();

  useEffect(()=>{
    getInvoice(1);
    getCompany();
    getCustomer();  

  },[]);

  const getInvoice= async(page)=>{
    
    const res= await sendRequest('GET','','api/invoice?page='+page);
    setInvoice(res.data);
    setRows(res.total);
    setPageSize(res.per_page);
    setClassTable('');
    setClassLoad('d-none');
  }

  const getCompany= async()=>{
    const res= await sendRequest('GET','','api/company');
    setCompany(res.data);
  }

  const getCustomer= async()=>{
    const res= await sendRequest('GET','','api/customer');
    setCustomer(res.data);
  }

  const deleteInvoice= (id, name)=> {
    confirmation(name,'api/invoice/'+id,'invoice');
  }

  const reportInvoice= async(id)=>{
    const res= await sendRequest('GET','','api/report/'+id);
  }

  const handleAddInput = () => {
    setProduct([...product,{name :  "", quantity : "", unit_price : ""}]);
};

const gettotalAmount = () => {
  const valor1 = input1Ref.current.value;
  const valor2 = input2Ref.current.value;

  const resultado = Number(valor1) + Number(valor2);
  console.log(resultado);
};

const handleChange = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...product];
    onChangeValue[index][name] = value;
    setProduct(onChangeValue);

    let valor1 = onChangeValue[index]["quantity"];
    let valor2 = onChangeValue[index]["unit_price"];
    setTotal(valor1 * valor2);
};

const handleDeleteInput = (index) => {
    const newArray = [...product];
    newArray.splice(index, 1);
    setProduct(newArray);
};

  const  save = async(e)=>{
    e.preventDefault();

    const form= {customer_id:customerId,company_id:companyId,total:total,tax:tax,product:product};
    const res= await sendRequest(method,form,url, '');
    getInvoice(1);
    clear();
    
}

  const clear= ()=>{
    setCustomerId('');
    setCompanyId('');
    setProduct([{name :  "", quantity : "", unit_price : ""}]);
    setTax('');
    setTotal('');
  }
  
  const openModal= (op,cId,compId,pro,to,tx,em)=> {
    clear();
    setTimeout(()=> NameInput.current.focus(), 600);
    setOperation(op);
    setId(em);

    if (op == 1) {
      setTitle('Create Invoice');  

    }else{
      setTitle('Update Company');
      
      setCustomerId(cId);
      setCompanyId(compId);
      setProduct([...pro,{name :  "", quantity : "", unit_price : ""}]);
      setTax(tx);
      setTotal(to);
    }
  }

  const goPage= (p)=> {
    setPage(p);
    getInvoice(p);

  }
  return (
    <div className='container-fluid'>
        <DivAdd>
          <button className='btn btn-info' data-bs-toggle='modal' data-bs-target='#modalInvoice' 
          onClick={()=> openModal(1)}> <i className='fa fa-solid fa-circle-plus'></i> add
          </button>
        </DivAdd>

        <DivTable col='10' off='1' classLoad={classLoad} classTable={classTable}>
          <table className='table table-bordered'>
            <thead>
            <tr>
                <th>N°</th>
                <th>N° FACTURA</th>
                <th>CLIENTE</th>
                <th>EMPRESA</th>
                <th></th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
            {invoice.map( (row,i) => (
                <tr key={row.id}>
                  <td>{(i+1)}</td>
                  <td>{row.correlative}</td>
                  <td>{row.customer}</td>
                  <td>{row.company}</td>
                  <td>
                  <button className='btn btn-warning' onClick={()=> reportInvoice(row.id)}>
                      <i className='fa fa-solid fa-edit'></i>
                    </button>
                  </td>
                  <td>
                    <button className='btn btn-danger' onClick={()=> deleteInvoice(row.id, row.correlative)}>
                      <i className='fa fa-solid fa-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}            
            </tbody>
          </table>
          <PaginationControl changePage={page=> goPage(page)} next={true} limit={pageSize} page={page} total={rows}/>
        </DivTable>

        <Modal title={title} modal='modalInvoice'>
          <div className='modal-body'>
            <form onSubmit={save}>

            <DivSelect icon='fa fa-solid fa-building' value= {customerId} className='form-select'
                        required='required' options={customer} handleChange={(e)=>setCustomerId(e.target.value)} />

                        <DivSelect icon='fa fa-solid fa-building' value= {companyId} className='form-select'
                        required='required' options={company} handleChange={(e)=>setCompanyId(e.target.value)} />

                            <div className="container ">
                                    
                                    {product.map((item, index) => (                                    
                                    
                                    <div className="row g-3" key={index}>
                                        <div className='col-6'>
                                            <input name="name" placeholder='producto' type="text" value={item.name}
                                            onChange={(event) => handleChange(event, index)} className='form-control' />
                                        </div>

                                        <div className='col-2'>
                                            <input name="quantity"  type="text" placeholder='cant' value={item.quantity}
                                            onChange={(event) => handleChange(event, index)} className='form-control' />
                                        </div>

                                        <div className='col-3'>
                                            <input name="unit_price" type="text" placeholder="precio" value={item.unit_price}
                                            onChange={(event) => handleChange(event, index)} className='form-control' />
                                            <br />                                       
                                        </div>

                                        <div className='col-1'>
                                            {product.length > 1 && (
                                                <button className='btn btn-danger' onClick={() => handleDeleteInput(index)}>
                                                    <i className='fa fa-solid fa-minus'></i>
                                                </button>
                                            )}
                                            {index === product.length - 1 && (
                                                <button className='btn btn-success' onClick={() => handleAddInput()}>
                                                    <i className='fa fa-solid fa-plus'></i>
                                                </button>
                                            )}                                        
                                        </div>
                                        
                                    </div>
                                    ))}
                                </div>
                            
                            <DivInput type='text' icon='fa fa-solid fa-user' value= {total} className='form-control'
                            placeholder= 'Total'  required='required' ref={NameInput} disabled/>

                            <DivInput type='text' icon='fa fa-solid fa-building' value= {tax} className='form-control'
                                placeholder= 'Impuesto'  required='required' ref={NameInput} 
                                handleChange={(e)=>setTax(e.target.value)} />

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

export default Index