import { useEffect, useState } from 'react'
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

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((res) => res.json())
      .then((json: any) => {
        setProducts(json.products)
        setLoading(false)
      })
      .catch(() => {
        setError('Something went wrong')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="products-state" role="status">
        Loading products…
      </div>
    )
  }

  if (error) {
    return (
      <div className="products-state products-state--error" role="alert">
        {error}
      </div>
    )
  }

  return (
    <main className="products-page">
      <header className="products-page__header">
        <h1>Products</h1>
        <p className="products-page__subtitle">
          {products.length} items from DummyJSON
        </p>
      </header>
      <ul className="products-grid">
        {products.map((product) => (
          <li key={product.id} className="product-card">
            <div className="product-card__media">
              <img
                className="product-card__thumb"
                src={product.thumbnail}
                alt={
                  product.title.trim() ||
                  product.description.trim() ||
                  'Product image'
                }
                loading="lazy"
              />
            </div>
            <div className="product-card__body">
              <p className="product-card__brand">{product.brand}</p>
              <h2 className="product-card__title">{product.title}</h2>
              <p className="product-card__category">{product.category}</p>
              <p className="product-card__desc">{product.description}</p>
              <div className="product-card__meta">
                <span className="product-card__price">{product.price}</span>
                {product.discountPercentage > 0 ? (
                  <span className="product-card__discount">
                    −{Math.round(product.discountPercentage)}%
                  </span>
                ) : null}
                <span className="product-card__rating">
                  <strong>{product.rating}</strong> / 5
                </span>
                <span className="product-card__stock">{product.stock} in stock</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
