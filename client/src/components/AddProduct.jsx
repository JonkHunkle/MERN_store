import React, {useState} from 'react'
import {useMutation} from '@apollo/client'
import { CREATE_PRODUCT } from '../utils/mutations';


export default function AddProduct({setDisplayModal}) {

  const initialState={
    name:'',
    type:'',
    quantity:undefined
  }
  const [product, setProduct] = useState(initialState)

  const [createProduct,{error: createProductError}] = useMutation(CREATE_PRODUCT)

  const handleChange = (e) =>{
    e.preventDefault()
    const {name:prop, value} = e.target
    setProduct({...product, [prop]:value})
  }

    const handleAddProduct = () =>{
      try {
        createProduct({
          variables:{productInput:{ 
            name:product.name.toString(),
            type:product.type.toString(),
            quantity:Number(product.quantity),
          }
        },
      });
  } catch  {
    console.error(createProductError);
  }
      setProduct(initialState)
      setDisplayModal(false)
}



  return (
    <div className="add-product py-2">
            <input
              className='mx-2'
              name='name'
              tabIndex='0'
              aria-label='New Product Name'
              value={product.name}
              onChange={(e) => handleChange(e)}
              placeholder="New Product name..."
              type="text"
            />
            <input
              className='mx-2'
              name='type'
              aria-label='New Product Type'
              value={product.type}
              onChange={(e) => handleChange(e)}
              placeholder="New Product Type..."
              type="text"
            />
            <input
              className='mx-2'
              name='quantity'
              aria-label='New Product Quantity'
              value={product?.quantity??''}
              onChange={(e) => handleChange(e)}
              placeholder="New Product quantity..."
              type="number"
            />
            <button className='add-product-btn'
            style={{margin:'1rem 0'}}
              onClick={() =>handleAddProduct() }
            >
              Add Product
            </button>
          </div>
  )
}
