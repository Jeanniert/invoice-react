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
    const [subtotal,setSubtotal]= useState('');
    const [tax,setTax]= useState('');
    const [totalWithTax,setTotalWithTax]= useState('');
    const NameInput= useRef();

    const [report,setReport]= useState([]);

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
  let montoTotal = 0;

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
    setReport(res.data);
  }

  const handleAddInput = () => {
    setProduct([...product,{name :  "", quantity : "", unit_price : ""}]);
};

const handleChange = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...product];
    onChangeValue[index][name] = value;
    setProduct(onChangeValue);

    // Recorrer el arreglo de productos con un bucle for
for (var i = 0; i < onChangeValue.length; i++) {
  // Obtener el producto actual
  var producto = onChangeValue[i];
  
  // Multiplicar la cantidad por el precio y guardar el resultado en una variable
  var montoProducto = producto.quantity * producto.unit_price;
  
  // Sumar el monto del producto al monto total
  montoTotal = montoTotal + montoProducto;
  var porcenX= tax*montoTotal/100;
  var totaImp= montoTotal+porcenX;
}

setTotal(totaImp);
setTotalWithTax(porcenX);
setSubtotal(montoTotal);
};

const handleDeleteInput = (index) => {
    const newArray = [...product];
    newArray.splice(index, 1);
    setProduct(newArray);
};

  const  save = async(e)=>{
    e.preventDefault();

    const form= {customer_id:customerId,company_id:companyId,total:total,tax:tax,product:product,subtotal:subtotal,totalWithTax:subtotal};
    const res= await sendRequest(method,form,url, '');
    close.current.click();  
    getInvoice(1);
    clear();   
    
}

  const clear= ()=>{
    setCustomerId('');
    setCompanyId('');
    setProduct([{name :  "", quantity : "", unit_price : ""}]);
    setTax('');
    setTotal('');
    setSubtotal('');
    setTotalWithTax('');
  }
  
  const openModal= (op,correlative,customer,company,address,phone,pro,total,tax,em)=> {
    clear();
    setOperation(op);
    setId(em);

    if (op == 1) {
      setTitle('Create Invoice');  

    }

    if (op == 2) {
      setTitle('Report');
      setCorrelative(correlative);
      setCustomerId(customer);
      setCompanyId(company);
      setCustomerAddress(address);
      setCustomerPhone(phone);
      setProduct([...pro,{name :  "", quantity : "", unit_price : ""}]);
      setTax(tax);
      setTotal(total);

    }
  }

  const goPage= (p)=> {
    setPage(p);
    getInvoice(p);

  }

  function formateNumber(input) {

    if (!input) return input;
    const numberInput = input.replace(/[^\d]/g, "");
    return numberInput;
  }

  const handletaxNumber = (e) => {
    const formattedTaxNumber = formateNumber(e.target.value);
    setTax(formattedTaxNumber);
  };
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
                  <button className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalReport' 
                  onClick={()=> reportInvoice(row.id)/*openModal(2, row.correlative,row.customer,row.company,row.address,row.phone,row.product, row.id)*/}>
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
                        <label className="form-label">Seleccionar cliente:</label>
                        <DivSelect icon='fa fa-solid fa-users' value= {customerId} className='form-select'
                        required='required' options={customer} handleChange={(e)=>setCustomerId(e.target.value)} />

                        <label className="form-label">Seleccionar empresa:</label>
                        <DivSelect icon='fa fa-solid fa-building' value= {companyId} className='form-select'
                        required='required' options={company} handleChange={(e)=>setCompanyId(e.target.value)} />

                        <div className='input-group mb-3'>
                              <span className='input-group-text'>
                                <i className='fa-solid fa-percent'></i>
                              </span>
                              <input type='text' className='form-control'  placeholder='Tasa de impuesto' onChange={(e) => handletaxNumber(e)} value={tax} />
                          </div>

                            <div className="container ">
                                    
                                    {product.map((item, index) => (                                    
                                    
                                    <div className="row g-3" key={index}>
                                        <div className='col-6'>
                                            <input name="name" placeholder='Articulo' type="text" value={item.name}
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

<hr />
<hr />
<div >
  <p><strong>Total parcial: {subtotal}</strong></p>
  <p><strong>Impuesto {tax}% : {totalWithTax}</strong></p>
  <p><strong>Total: {total}</strong></p>
</div>

<hr />
                          

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




        <Modal title={title} modal='modalReport'>
          <div className='modal-body'>
            <form onSubmit={save}>
            <div className="invoice-inner-9" id="invoice_wrapper">
                        <div className="invoice-top">
                            <div className="row">
                                <div className="col-lg-6 col-sm-6">
                                    <div className="logo">
                                    <img className="avatar-60 rounded" width="60" height="60" src={'http://127.0.0.1:8000/storage/company/'+report['companyLogo']} />  
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <div className="invoice">
                                        <h3>#<span>{report['correlative']}</span></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="invoice-info">
                            <div className="row">
                                <div className="col-sm-6 mb-50">
                                    <div className="invoice-number">
                                        <h4 className="inv-title-1">Fecha de la factura:</h4>
                                        <p className="invo-addr-1">
                                        {report['created_at']}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-sm-6 text-end mb-50">
                                    
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 mb-50">
                                    <h4 className="inv-title-1" >Cliente</h4>
                                    <p className="inv-from-1">{report['customer']}</p>
                                    <p className="inv-from-1">{report['customerAddress']}</p>
                                    <p className="inv-from-1">{report['customerPhone']}</p>
                                    <p className="inv-from-2"></p>
                                </div>
                                <div className="col-sm-6 text-end mb-50">
                                    <h4 className="inv-title-1">Empresa</h4>
                                    <p className="inv-from-1">{report['company']}</p>
                                    <p className="inv-from-2">{report['companyAddress']}</p>
                                </div>
                            </div>
                        </div>
                        <div className="order-summary">
                            <div className="table-outer">
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Articulo</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {report['product']?.map( (row) => (
                                      <tr key={row.name}>
                                        <td >{row.name}</td>
                                        <td >{row.quantity}</td>
                                        <td >{row.unit_price}</td>
                                      </tr>
                                    ))} 
                                        <tr>
                                            <td><strong className="text-danger">Total</strong></td>
                                            <td></td>
                                            <td></td>
                                            <td><strong className="text-danger">${report['total']}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
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