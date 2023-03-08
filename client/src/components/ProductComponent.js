import React, {useState} from 'react';
import {useSubscription} from '@apollo/client'
import ProductList from './ProductList'
import AddProduct from './AddProduct'
import { QUERY_PRODUCTS,PRODUCTS_SUBSCRIPTION } from '../utils/queries';
import { useQuery } from '@apollo/client';

export default function ProductComponent() {

  const {data, loading:queryLoading, error:queryError }  = useQuery(QUERY_PRODUCTS)

  const [displayModal, setDisplayModal] = useState(false)

  useSubscription(
    PRODUCTS_SUBSCRIPTION,
    {
      onSubscriptionData:({client ,subscriptionData})=>{
        const cachedData= client.readQuery({
          query:QUERY_PRODUCTS
        })
        client.writeQuery({
          query:QUERY_PRODUCTS,
          data: {getProducts:  [...cachedData.getProducts, subscriptionData.data.productAdded ]}
    //     })
        })
      }
    }
  )

  return (
    <>
    <div style={{background:'	#90a7d5', textAlign:'center', display:'flex', flexDirection:'column'}} className='p-2'> 
      <h1>Digital Store Inventory</h1>
      <section className="product-input">
        <AddProduct/>
      </section>
      <button
        className='add-product-btn'
        style={{display:'none',width:'auto', placeSelf:'center'}}
        onClick={()=>setDisplayModal(!displayModal)}
      >Add New Product</button>
    </div>
    { displayModal && <div className="modal">
          <div className="modal-content"
            >
              <span className="close" onClick={()=>setDisplayModal(!displayModal)} >
              &times;
            </span>
            <h2>Add New Product</h2>
            <AddProduct setDisplayModal={setDisplayModal}/>
          </div>
        </div>
}
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
