import React, { useState} from 'react';
import {useMutation} from '@apollo/client'
import { CREATE_PRODUCT } from '../utils/mutations';
import ProductList from './ProductList'
import { QUERY_PRODUCTS } from '../utils/queries';
import { useQuery } from '@apollo/client';




const initialState={
  name:'',
  type:'',
  quantity:undefined
}

export default function ProductComponent() {
  
  const [product, setProduct] = useState(initialState)

  const {data, loading:queryLoading, error:queryError }  = useQuery(QUERY_PRODUCTS)
  const [createProduct,{error: createProductError}] = useMutation(CREATE_PRODUCT,{
    update(cache, {data:{createProduct}}){
      try{
        const {getProducts} = cache.readQuery({query: QUERY_PRODUCTS})
        cache.writeQuery({
          query:QUERY_PRODUCTS,
          data: {getProducts:  [...getProducts, createProduct ]}
        })
      } catch (err) {
        console.log(err)
      }
    }
  })

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
            } catch  {
              console.error(createProductError);
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
              value={product?.quantity??''}
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
    
    {
      queryLoading?<div style={{textAlign:'center'}}>'Please wait... Loading'</div>:(queryError? <div style={{textAlign:'center'}}>Error with fetching data...</div>:(
        <ProductList 
          products={data?.getProducts} 
        />
      ))
    }
    </>
  );
}
