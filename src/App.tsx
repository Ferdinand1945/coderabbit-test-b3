import { useState, useEffect } from 'react'
import './App.css'

interface Products {
  products: {
 title: string;
 description: string;
  }

}
function App() {
  const [products, setProducts] = useState<Products>()
  
  useEffect(()=> {
    fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => {
      console.log("there was an error fetching", err);
    });
  },[])

console.log(products)
  return (
    <>
      <div className=''>
      {products?.products.description}
      </div>
    </>
  )
}

export default App
