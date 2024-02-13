import React, {useEffect, useState, useRef} from 'react';
import { sendRequest } from '../functions';
import  DivInput from './DivInput';
import DivSelect from './DivSelect';

const FormFact = (params) => {

    const [customerId,setCustomerId]= useState('');
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

    useEffect(()=>{
        NameInput.current.focus();
        getCustomer();
        getCompany();
    },[]);

    const getCustomer= async()=>{
        const res= await sendRequest('GET','','api/customer');
        setCustomer(res.data);
      }

    const getCompany= async()=>{
        const res= await sendRequest('GET','','api/company');
        setCompany(res.data);
      }

      

        const handleAddInput = () => {
            setProduct([...product,{name :  "", quantity : "", unit_price : ""}]);
        };

        const handleChange = (event, index) => {
            let { name, value } = event.target;
            let onChangeValue = [...product];
            onChangeValue[index][name] = value;
            setProduct(onChangeValue);
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
        if (method == 'POST' && res.status == true) {
        }
    }

  return (
    <div className='container-fluid'>
        <div className='row mt-5'>
            <div className='col-md-4 offset-md-4'>
                <div className='card border  border-info'>
                    <div className='card-header bg-info border border-info'>
                        {params.title}
                    </div>
                    <div className='card-body'>
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
                                            <input name="quantity" placeholder='cant' type="text" value={item.quantity}
                                            onChange={(event) => handleChange(event, index)} className='form-control' />
                                        </div>

                                        <div className='col-3'>
                                            <input name="unit_price" placeholder="precio" type="text" value={item.unit_price}
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
                            placeholder= 'Total'  required='required' ref={NameInput} 
                            handleChange={(e)=>setTotal(e.target.value)} />

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

                </div>
            </div>

        </div>
        
    </div>
  )
}

export default FormFact