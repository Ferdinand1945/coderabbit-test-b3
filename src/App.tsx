import { useState, useEffect } from 'react'
import './App.css'

interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
}

interface ProductsResponse {
  products: Product
}

function App() {
  const [products, setProducts] = useState<Product[]>()

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((data: ProductsResponse) => setProducts(data.products))
    
  }, [])

  return (
    <>
      <div className=''>
      {products?.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>{product.price}</p>
          <p>{product.discountPercentage}</p>
          <p>{product.rating}</p>
        </div>
      ))}
      </div>
    </>
  )
}

export default App
