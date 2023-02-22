import React, { useState} from 'react';
import {useMutation} from '@apollo/client'
import { CREATE_PRODUCT } from '../utils/mutations';
import ProductList from './ProductList'
import { QUERY_PRODUCTS } from '../utils/queries';
import { useQuery } from '@apollo/client';




const initialState={
  name:'',
  type:'',
  quantity:0
}

export default function ProductComponent() {
  
  const [product, setProduct] = useState(initialState)

  const [createProduct,{error}] = useMutation(CREATE_PRODUCT,{
    refetchQueries: [
      {query: QUERY_PRODUCTS}, 
      'getProducts' 
    ],
  })
  const {data, loading }  = useQuery(QUERY_PRODUCTS)

  
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
                // refetch()
            } catch (err) {
              console.error(err);
            }
                setProduct(initialState)
  }

  const handleChange = (e) =>{
    e.preventDefault()
    const {name:prop, value} = e.target
    setProduct({...product, [prop]:value})
  }



  return (
    <>
    <div style={{background:'	#90a7d5', textAlign:'center'}} className='p-2'> 
      <h1>Digital Store Inventory</h1>
      <section className="product-input" >
        <div>
          <div className="add-product py-2">
            Add a Product:
            <input
              className='mx-2'
              name='name'
              value={product.name}
              onChange={(e) => handleChange(e)}
              placeholder="New Product name..."
              type="text"
            />
            <input
              className='mx-2'
              name='type'
              value={product.type}
              onChange={(e) => handleChange(e)}
              placeholder="New Product type..."
              type="text"
            />
            <input
              className='mx-2'
              name='quantity'
              value={product.quantity}
              onChange={(e) => handleChange(e)}
              placeholder="New Product quantity..."
              type="number"
            />
            <button
              onClick={() =>handleAddProduct() }
            >
              Add Product
            </button>
          </div>
        </div>
      </section>
    </div>
      <ProductList 
      products={data?.getProducts} 
      />
    </>
  );
}
