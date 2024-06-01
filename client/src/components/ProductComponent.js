import React, {useEffect, useState} from 'react';
import {useSubscription} from '@apollo/client'
import ProductList from './ProductList'
import AddProduct from './AddProduct'
import { QUERY_PRODUCTS,PRODUCTS_SUBSCRIPTION } from '../utils/queries';
import { useQuery } from '@apollo/client';
import {useMutation} from '@apollo/client'
import { CREATE_PRODUCT } from '../utils/mutations';


export default function ProductComponent() {

  const [displayModal, setDisplayModal] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);
  const [loginSignIn, setLoginSignIn] = useState('login');
  // const {data, loading:queryLoading, error:queryError }  = useQuery(QUERY_PRODUCTS)

  const { data, loading: queryLoading, error: queryError } = useQuery(QUERY_PRODUCTS, {
    // Provide initial data here
    initialData: {
      products: [
        {
          _id: '1',
          name: 'Initial Product',
          quantity: 10,
          type: 'Initial Type',
          onHold: false,
        },
        // Add more initial products as needed
      ],
    },
  });
  const [addUser,{error: addUserError}] = useMutation(CREATE_PRODUCT)

  const [user, setUser]= useState(null)

  // const handleSignUp = ()=>{
  //   console.log(user)
  // }

  const updateUser= (e)=>{
    const {value, name} = e.target
    setUser({...user, [name]:value})
  }

  const handleAddUser = () =>{
    try {
      addUser({
        variables:{userInput:{ 
          name:user.name.toString(),
          email:user.email.toString(),
          password:user.password.toString(),
        }
      },
    });
} catch  {
  console.error(addUserError);
}
    setUser(null)
    setDisplayModal(false)
}

  useSubscription(
    PRODUCTS_SUBSCRIPTION,
    {
      onData:({client ,data})=>{
        const cachedData= client.readQuery({
          query:QUERY_PRODUCTS
        })
        client.writeQuery({ 
          query:QUERY_PRODUCTS,
          data: {products:  [...cachedData.products, data.data.productAdded ]}
        })
      }
    }
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  return (
    <>
    <div style={{background:'	#90a7d5', textAlign:'center', display:'flex', flexDirection:'column'}} className='p-2'> 
      <h1>Anne's Antiques</h1>
      <section className="product-input">
        <AddProduct setDisplayModal={setDisplayModal}/>
      </section>
      <div style={{display:'flex',width:"100%", gap:'2rem',flexDirection:'row', justifyContent:'center', position:'relative'}}>

      <button
        className='add-product-btn'
        style={{display:'none',width:'auto'}}
        onClick={()=>setDisplayModal(!displayModal)}
      >Add New Product</button>
       <button style={(windowWidth<649?{position:'initial'}:{position:'fixed', top:0, right: 0, margin:'1rem'})}onClick={()=>setShowModal(true)} >Login / Sign-up</button>
      </div>
      
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
      queryLoading?<div style={{textAlign:'center'}}>
        <h3>Please wait...</h3>
        <br/>
        <sub>
          Due to low traffic, the database may need some time to connect
        </sub>
      </div>:(queryError? <div style={{textAlign:'center'}}>Error with fetching data...</div>:(
        <ProductList 
          products={data?.products} 
        />
      ))
    }
   { showModal  && (<div className="modal">
          <div className="modal-content">
              <span className="close" onClick={()=>{
                setShowModal(false)
                setLoginSignIn('login')
                }} >
              &times;
            </span>
            {loginSignIn==='login'?(<>
            <h2>Login</h2>
            <div  style={{ gap:'1rem', width:'75%', display:'flex', flexDirection:'column'}}>
  <label  style={{display:'flex', justifyContent:'start',}}>Email: &nbsp;
  <input placeholder='Example@password.com' style={{textAlign:'center', width:'auto', marginLeft:'auto'}} type="text" id="email" name="email" required/>
  </label>
  <label  style={{display:'flex', justifyContent:'start',}}>Password: &nbsp;
  <input style={{textAlign:'center', width:'auto', marginLeft:'auto'}} type="text" id="password" name="password" required/>
  </label>
  <button type="submit" style={{cursor:'pointer'}}>Login</button>
  <button onClick={()=>setLoginSignIn('signUp')} style={{color:'blue', backgroundColor:'transparent', textAlign:'center', cursor:'pointer'}}>Don't have an account? Sign-up here!</button>
</div>
</>):(<>
            <h2>Sign-Up</h2>
            <div action="/submit" method="post" style={{ gap:'1rem', width:'75%', display:'flex', flexDirection:'column'}}>
  <label for="username" style={{display:'flex', justifyContent:'start',}}>Name: &nbsp;
  <input onChange={updateUser} style={{textAlign:'center', width:'auto', marginLeft:'auto'}} type="text" id="username" name="username" required/>
  </label>
  <label for="email" style={{display:'flex', justifyContent:'start',}}>Email: &nbsp;
  <input onChange={updateUser} placeholder='Example@email.com' style={{textAlign:'center', width:'auto', marginLeft:'auto'}} type="email" id="email" name="email" required/>
  </label>
  <label for="password" style={{display:'flex', justifyContent:'start',}}>Password: &nbsp;
  <input onChange={updateUser} style={{textAlign:'center', width:'auto', marginLeft:'auto'}} type="password" id="password" name="password" required/>
  </label>
  <label for="confirmPassword" style={{display:'flex', justifyContent:'start',}}>Confirm Password: &nbsp;
  <input onChange={updateUser} style={{textAlign:'center', width:'auto', marginLeft:'auto'}} type="password" id="confirmPassword" name="confirmPassword" required/>
  </label>
  <button onClick={handleAddUser}style={{cursor:'pointer'}}>SignUp</button>
  <button onClick={()=>setLoginSignIn('login')} style={{color:'blue', backgroundColor:'transparent', textAlign:'center', cursor:'pointer'}}>Have an account? login here!</button>
</div>
</>)} 

          </div>
        </div>)
}
    </>
  );
}
