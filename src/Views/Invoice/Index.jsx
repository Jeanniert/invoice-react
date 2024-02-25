import React, {Fragment,useEffect, useState, useRef} from 'react';
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
import { Document, Page,Image, Text, View, StyleSheet,PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";


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
  const fecha = new Date();
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
const dias = ["Domingo","Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ];
const date= dias[fecha.getDay()]+' '+fecha.getDate()+' '+meses[fecha.getMonth()]+' '+fecha.getFullYear();
const borderColor = '#90e5fc';

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

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 11,
      paddingTop: 30,
      paddingLeft: 60,
      paddingRight: 60,
      lineHeight: 1.5,
      flexDirection: 'column',
    },

    titleContainer:{
      flexDirection: 'row',
      marginTop: 24,
  },
  reportTitle:{
      color: '#61dafb',
      letterSpacing: 4,
      fontSize: 25,
      textAlign: 'center',
      textTransform: 'uppercase',
  },
  invoiceNoContainer: {
    flexDirection: 'row',
    marginTop: 36,
    justifyContent: 'flex-end'
},
invoiceDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
},
invoiceDate: {
        fontSize: 12,
        fontStyle: 'bold',
},
label: {
    width: 60
},
headerContainer: {
  marginTop: 36
},
billTo: {
  marginTop: 20,
  paddingBottom: 3,
  fontFamily: 'Helvetica-Oblique'
},
tableContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 24,
  borderWidth: 1,
  borderColor: '#bff0fd',
},
container: {
  flexDirection: 'row',
  borderBottomColor: '#bff0fd',
  backgroundColor: '#bff0fd',
  borderBottomWidth: 1,
  alignItems: 'center',
  height: 24,
  textAlign: 'center',
  fontStyle: 'bold',
  flexGrow: 1,
},
description: {
  width: '60%',
  borderRightColor: borderColor,
  borderRightWidth: 1,
},
qty: {
  width: '11%',
  borderRightColor: borderColor,
  borderRightWidth: 1,
},
rate: {
  width: '15%',
  borderRightColor: borderColor,
  borderRightWidth: 1,
},
amount: {
  width: '15%'
},
row: {
  flexDirection: 'row',
  borderBottomColor: '#bff0fd',
  borderBottomWidth: 1,
  alignItems: 'center',
  height: 24,
  fontStyle: 'bold',
},
description1: {
  width: '66%',
  textAlign: 'left',
  borderRightColor: borderColor,
  borderRightWidth: 1,
  paddingLeft: 8,
},
qty1: {
  width: '11%',
  borderRightColor: borderColor,
  borderRightWidth: 1,
  textAlign: 'right',
  paddingRight: 8,
},
rate1: {
  width: '15%',
  borderRightColor: borderColor,
  borderRightWidth: 1,
  textAlign: 'right',
  paddingRight: 8,
},
amount1: {
  width: '15%',
  textAlign: 'right',
  paddingRight: 8,
},
row1: {
  flexDirection: 'row',
  borderBottomColor: '#bff0fd',
  borderBottomWidth: 1,
  alignItems: 'center',
  height: 24,
  fontSize: 12,
  fontStyle: 'bold',
},
description2: {
  width: '85%',
  textAlign: 'right',
  borderRightColor: borderColor,
  borderRightWidth: 1,
  paddingRight: 8,
},
total: {
  width: '15%',
  textAlign: 'right',
  paddingRight: 8,
},
titleContainer1:{
  flexDirection: 'row',
  marginTop: 12
},
reportTitle1:{
  fontSize: 12,
  textAlign: 'center',
  textTransform: 'uppercase',
},
logo: {
  width: 74,
  height: 66,
  marginLeft: 'auto',
  marginRight: 'auto'
}
  });
  
  const MyDoc = () => (
    <Document>
      <Page size="A4" style={styles.page}>

      <Image style={styles.logo} src={'http://127.0.0.1:8000/storage/company/'+report['companyLogo']} />
      <View style={styles.titleContainer}>
        <Text style={styles.reportTitle}>{title}</Text>
      </View>


      <Fragment>
            <View style={styles.invoiceNoContainer}>
                <Text style={styles.label}>N°:</Text>
                <Text style={styles.invoiceDate}>{report['correlative']}</Text>
            </View >
            <View style={styles.invoiceDateContainer}>
                <Text style={styles.label}>Fecha:</Text>
                <Text >{report['date']}</Text>
            </View >
        </Fragment>

        <View style={styles.headerContainer}>
            <Text style={styles.billTo}>Cliente:</Text>
            <Text>{report.customer}</Text>
            <Text>{report['customerPhone']}</Text>
            <Text>{report['customerAddress']}</Text>
        </View>

        <View style={styles.headerContainer}>
            <Text style={styles.billTo}>Empresa:</Text>
            <Text>{report.company}</Text>
            <Text>{report['companyPhone']}</Text>
            <Text>{report['companyAddress']}</Text>
        </View>

      <View style={styles.tableContainer}>
            <View style={styles.container}>
              <Text style={styles.description}>Descripción</Text>
              <Text style={styles.qty}>Cantidad</Text>
              <Text style={styles.amount}>Precio</Text>
            </View>
            {report['product']?.map((item) => (
              <View style={styles.row} key={item.name} >
                  <Text style={styles.description1}>{item.name}</Text>
                  <Text style={styles.qty1}>{item.quantity}</Text>
                  <Text style={styles.amount1}>{Number.parseFloat(item.unit_price).toFixed(2)}</Text>
              </View>
            ))}
          <View style={styles.row1}>
            <Text style={styles.description2}>TOTAL</Text>
            <Text style={styles.total}>{ Number.parseFloat(report['total']).toFixed(2)}</Text>
        </View>
          </View>
          <View style={styles.titleContainer1}>
              <Text style={styles.reportTitle1}>Muchas gracias por su confianza</Text>
          </View>
      </Page>
    </Document>
  );

  const getCustomer= async()=>{
    const res= await sendRequest('GET','','api/customer');
    setCustomer(res.data);
  }

  const deleteInvoice= (id, name)=> {
    confirmation(name,'api/invoice/'+id,'invoice');
  }

  const reportInvoice= async(id)=>{
    setTitle('Factura');
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

    const form= {customer_id:customerId,company_id:companyId,total:total,tax:tax,product:product,subtotal:subtotal,totalWithTax:totalWithTax,date:date};
    const res= await sendRequest(method,form,url, '');
    close.current.click();
    clear();  
    getInvoice(1);
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
     
    <div className='container-md'>
      <div className="card ">
        <div className="card-header">
          Lista de Facturas
        </div> 
        <DivAdd>
          <button className='btn btn-info' data-bs-toggle='modal' data-bs-target='#modalInvoice' 
          onClick={()=> openModal(1)}> <i className='fa fa-solid fa-circle-plus'></i> add
          </button>
        </DivAdd>

        <div className="card-body">
          <DivTable col='10' off='1' classLoad={classLoad} classTable={classTable}>
            <table className='table table-striped'>
              <thead>
              <tr>
                  <th>N°</th>
                  <th>N° FACTURA</th>
                  <th>CLIENTE</th>
                  <th>EMPRESA</th>
                  <th>OPCIONES</th>
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
                        <button className='btn btn-warning btn-sm' data-bs-toggle='modal' data-bs-target='#modalReport' 
                        onClick={()=> reportInvoice(row.id)/*openModal(2, row.correlative,row.customer,row.company,row.address,row.phone,row.product, row.id)*/}>
                          <i className='fa fa-solid fa-edit'></i>
                        </button>
                        <button className='ms-1 btn btn-danger btn-sm' onClick={()=> deleteInvoice(row.id, row.correlative)}>
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
          <PDFViewer style={{with:"100%", height:"500px"}} >
          <MyDoc />
        </PDFViewer>
        <hr />
        

          <div className='modal-footer'>
          <button className='btn btn-danger' data-bs-dismiss='modal' ref={close}> Cerrar</button>
          <PDFDownloadLink document={<MyDoc/>} fileName={'invoice.pdf'}>
            {({ loading, url, error, blob }) =>
              loading ? (
                <button className='btn btn-success'>Cargando factura ...</button>
              ) : (
                <button className='btn btn-success'>Generar factura</button>
              )
            }
          </PDFDownloadLink>
            
          </div>
        </Modal>

      </div>
    </div>
  )
}

export default Index