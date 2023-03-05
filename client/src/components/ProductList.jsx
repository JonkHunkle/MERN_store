import React, {useState} from 'react'
import { useMutation } from '@apollo/client';
import { QUERY_PRODUCTS } from '../utils/queries';
import { EDIT_PRODUCT, DELETE_PRODUCT } from './../utils/mutations';


export default function ProductList({products}) {
  const [selectedProduct, setSelectedProduct] = useState({})
  const [editProduct, { error:editError }]= useMutation(EDIT_PRODUCT,{
    refetchQueries: [
      {query: QUERY_PRODUCTS}, 
      'getProducts' 
    ],
  })
  const [deleteProduct, { error: deleteError }]= useMutation(DELETE_PRODUCT,{
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

const toggleEdit = (e, product)=>{
  e.preventDefault()
  setSelectedProduct({...product})
}

const handleDeleteProduct = (e)=>{
  e.preventDefault()
  console.log(e.target.id)
  try {
    deleteProduct({
      variables:{
        id: e.target.id,
      }
  });
} catch (err) {
console.error('err: ', deleteError);
}

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
console.log('selectedProduct: ',selectedProduct)

// useEffect(()=>{subscribeToNewProducts()})

  return (
    <section className="product-list p-2" style={{display:'flex', flexDirection:'column', alignItems:'center' }}>
        {products.length>0&&products?.map((product) => (
          <div key={product._id} id={product._id} style={{textAlign:'center'}} className="card bg-light col-md-6 mb-3">
            {product._id===selectedProduct._id? (<> 
            <h4 className="card-header bg-primary text-light p-2 m-0">
              edit product</h4>
              <form id='editProduct' style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <fieldset style={{border:'none'}}> 
                <label htmlFor="name">name:&nbsp;</label>
               <input type="text" placeholder='name' name="name" id={product.id} value={selectedProduct.name} onChange={(e)=>{
                  handleEditProduct(e)
                }}/>
                </fieldset>
                <fieldset style={{border:'none'}}> 
                <label htmlFor="type">type:&nbsp;</label>
                <input type="text" placeholder='type' name="type" id={product.id} value ={selectedProduct.type} onChange={(e)=>{
                  handleEditProduct(e)
                }}/>
                </fieldset>
                <fieldset style={{border:'none'}}>
                <label htmlFor="quantity">quantity:&nbsp;</label>
                <input type='number' placeholder='quantity' name="quantity" id={product.id} value = {selectedProduct.quantity}  onChange={(e)=>{
                  handleEditProduct(e)
                }}/>
                </fieldset>
                <span style={{ fontSize: '1rem' }}>
              <button
              className='mt-2'
                // id="onHold"
                name='onHold'
                value = {selectedProduct.onHold} 
                onClick={e=>handleEditProduct(e)}
                >
                Toggle Hold
              </button>
              {(selectedProduct?.onHold) ? 'Available✅' : 'On Hold ⚠️ ' }
            </span>
              <button className='m-2' onClick={(e)=>{handleSubmit(e)}}>submit</button>
              <button className='mb-2' onClick={()=>setSelectedProduct({})}>cancel</button>
              </form>
            </>
            ): (<> 
            <h4 className="card-header bg-primary text-light p-2 m-0">
              <span> 
              {product.name} <br />
              <span style={{ fontSize: '1rem' }}>
                Quantity: {product.quantity } 
              </span>

              </span>
            </h4>
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
              <button style={{marginTop:'5px'}}onClick={(e)=>toggleEdit(e,product)}>Toggle Edit</button>
              <br/>
              <button className='mt-2'
                // id="onHold"
                name='delete'
                id= {product._id}
                onClick={e=>handleDeleteProduct(e)}
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
