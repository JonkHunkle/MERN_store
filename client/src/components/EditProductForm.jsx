import React from 'react'
import { useMutation } from '@apollo/client'
import { QUERY_PRODUCTS } from '../utils/queries';
import { EDIT_PRODUCT } from '../utils/mutations';


export default function EditProductForm({selectedProduct, setSelectedProduct}) {

    const [editProduct, { error:editError }]= useMutation(EDIT_PRODUCT,{
        refetchQueries: [
            {query: QUERY_PRODUCTS}, 
            'getProducts' 
        ],
        })

    const handleEditProduct = (e) =>{
    e.preventDefault()
        let {name, value} = e.target
        if(name==='quantity') value = Number(value)
        if(name==='onHold')value=!(value==='true')
        setSelectedProduct({...selectedProduct, [name]:value})
    }
    
    const handleSubmit = (e)=>{
        e.preventDefault()
        const {__typename, _id, ...productInput}= selectedProduct
        try {
            editProduct({
            variables:{
                id: selectedProduct._id,
                productInput: productInput
            }
        });
        } catch (err) {
        console.error('err: ',editError);
        }
        setSelectedProduct({})
        }

    
    return (
    <div> 
    <p className="card-header bg-primary text-light p-2 m-0">
        edit product</p>
        <form id='editProduct' style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <fieldset style={{border:'none'}}> 
            <label htmlFor="name">Name:&nbsp;</label>
            <input 
                type="text"
                placeholder='Name' 
                name="name"
                aria-label='Edit Product Name'
                value={selectedProduct.name}
                onChange={(e)=>{
                    handleEditProduct(e)
        }}/>
        </fieldset>
        <fieldset style={{border:'none'}}> 
        <label htmlFor="type">Type:&nbsp;</label>
        <input 
            type="text" 
            placeholder='Type' 
            name="type" 
            aria-label='Edit Product Type'
            value ={selectedProduct.type} 
            onChange={(e)=>{
                handleEditProduct(e)
        }}/>
        </fieldset>
        <fieldset style={{border:'none'}}>
        <label htmlFor="quantity">Quantity:&nbsp;</label>
        <input 
          type='number' 
          placeholder='Quantity' 
          name="quantity" 
          aria-label='Edit Product Quantity'
          value = {selectedProduct.quantity}
          onChange={(e)=>{
            handleEditProduct(e)
        }}/>
        </fieldset>
        <span style={{ fontSize: '1rem' }}>
      <button
        className='mt-2'
        aria-label='Edit Product On Hold'
        name='onHold'
        value = {selectedProduct.onHold} 
        onClick={e=>handleEditProduct(e)}
      >
        Toggle Hold
      </button>
      {(selectedProduct?.onHold) ? 'Available✅' : 'On Hold ⚠️ ' }
    </span>
      <button 
        className='m-2'
        aria-label='Submit Product Edit'
        onClick={(e)=>{handleSubmit(e)}}
      >
        Submit
      </button>
      <button 
        className='mb-2' 
        aria-label='Cancel Edit Product'
        onClick={()=>setSelectedProduct({})}
      >
        Cancel
      </button>
      </form>
    </div>
  )
}
