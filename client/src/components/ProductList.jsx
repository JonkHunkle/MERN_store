import React, {useState} from 'react'
import { useMutation } from '@apollo/client';
import { QUERY_PRODUCTS } from '../utils/queries';
import { DELETE_PRODUCT } from './../utils/mutations';
import EditProductForm from './EditProductForm';


export default function ProductList({products}) {

  const [selectedProduct, setSelectedProduct] = useState({})


 
  const [deleteProduct, { error: deleteError }]= useMutation(DELETE_PRODUCT,{
    refetchQueries: [
      {query: QUERY_PRODUCTS}, 
      'products' 
    ],
  })



const toggleEdit = (e, product)=>{
  e.preventDefault()
  setSelectedProduct({...product})
}

const handleDeleteProduct = (id)=>{
  try {
    deleteProduct({
      variables:{
        id: id,
      }
  });
} catch (err) {
console.error('err: ', deleteError);
}

}

  return (
    <section className="product-list p-2" style={{display:'flex', flexDirection:'column', alignItems:'center' }}>
        {products.length>0&&products?.map((product) => (
          <div key={product._id} id={product._id} style={{textAlign:'center'}} className="card bg-light col-md-6 mb-3">
            {product._id===selectedProduct._id? ( 

              <EditProductForm selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/> 
            // {/*<>
            //   <p className="card-header bg-primary text-light p-2 m-0">
            //   edit product</p>
            //   <form id='editProduct' style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            //     <fieldset style={{border:'none'}}> 
            //     <label htmlFor="name">Name:&nbsp;</label>
            //     <input 
            //       type="text"
            //       placeholder='Name' 
            //       name="name"
            //       aria-label='Edit Product Name'
            //       value={selectedProduct.name}
            //       onChange={(e)=>{
            //         handleEditProduct(e)
            //     }}/>
            //     </fieldset>
            //     <fieldset style={{border:'none'}}> 
            //     <label htmlFor="type">Type:&nbsp;</label>
            //     <input 
            //       type="text" 
            //       placeholder='Type' 
            //       name="type" 
            //       aria-label='Edit Product Type'
            //       value ={selectedProduct.type} 
            //       onChange={(e)=>{
            //         handleEditProduct(e)
            //     }}/>
            //     </fieldset>
            //     <fieldset style={{border:'none'}}>
            //     <label htmlFor="quantity">Quantity:&nbsp;</label>
            //     <input 
            //       type='number' 
            //       placeholder='Quantity' 
            //       name="quantity" 
            //       aria-label='Edit Product Quantity'
            //       value = {selectedProduct.quantity}
            //       onChange={(e)=>{
            //         handleEditProduct(e)
            //     }}/>
            //     </fieldset>
            //     <span style={{ fontSize: '1rem' }}>
            //   <button
            //     className='mt-2'
            //     aria-label='Edit Product On Hold'
            //     name='onHold'
            //     value = {selectedProduct.onHold} 
            //     onClick={e=>handleEditProduct(e)}
            //   >
            //     Toggle Hold
            //   </button>
            //   {(selectedProduct?.onHold) ? 'Available✅' : 'On Hold ⚠️ ' }
            // </span>
            //   <button 
            //     className='m-2'
            //     aria-label='Submit Product Edit'
            //     onClick={(e)=>{handleSubmit(e)}}
            //   >
            //     Submit
            //   </button>
            //   <button 
            //     className='mb-2' 
            //     aria-label='Cancel Edit Product'
            //     onClick={()=>setSelectedProduct({})}
            //   >
            //     Cancel
            //   </button>
            //   </form>
            // </> */}
            ): (<> 
            <p className="card-header bg-primary text-light p-2 m-0">
              <span> 
              {product.name} <br />
              <span style={{ fontSize: '1rem' }}>
                Quantity: {product.quantity } 
              </span>

              </span>
            </p>
            <div className="card-body bg-light mx-2 wt-2">
              <p>Type: {product.type}</p>
              <code>
                Product ID:
                {product._id}
              </code>
              <br/>
            <span style={{ fontSize: '1rem'}}>
              {product?.onHold ? 'Available✅' : 'On Hold ⚠️ ' }
            </span>
            <br/>
              <button 
              style={{marginTop:'5px'}}
              aria-label='Select Product To Edit'
              onClick={(e)=>toggleEdit(e,product)}
              >
                Toggle Edit
              </button>
              <br/>
              <button className='mt-2'
                aria-label='Delete Product'
                name='delete'
                // id= {product._id}
                onClick={e=>handleDeleteProduct(product._id)}
                >
                delete
              </button>
            </div>
                </>
            )}
          </div>
        ))}
      </section>
  )
}
