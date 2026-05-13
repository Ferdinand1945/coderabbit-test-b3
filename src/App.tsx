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

var BASE = 'https://dummyjson.com/products'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [q, setQ] = useState('')
  const [one, setOne] = useState<any>(null)
  const [idBox, setIdBox] = useState('1')

  const [newT, setNewT] = useState('Test Product From UI')
  const [updId, setUpdId] = useState('1')
  const [updT, setUpdT] = useState('patched title lol')
  const [delId, setDelId] = useState('1')

  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')

  function loadAll() {
    setLoading(true)
    fetch(BASE)
      .then((res) => res.json())
      .then((json: any) => {
        setProducts(json.products)
        setLoading(false)
        setError(null)
      })
      .catch(() => {
        setError('Something went wrong')
        setLoading(false)
      })
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <br />
        <button type="button" onClick={loadAll} style={{ marginTop: 12 }}>
          retry
        </button>
      </div>
    )
  }

  return (
    <main className="products-page">
      <header className="products-page__header">
        <h1>Products</h1>
        <p className="products-page__subtitle">
          {products.length} items from DummyJSON (bad demo app)
        </p>
      </header>

      <div style={{ border: '1px dashed #888', padding: 12, marginBottom: 20, fontSize: 13 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>search (GET /products/search?q=)</div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="query" />
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true)
            setNote('')
            fetch(BASE + '/search?q=' + encodeURIComponent(q))
              .then((r) => r.json())
              .then((d: any) => {
                if (d.products) {
                  setProducts(d.products)
                  setNote('search ok total=' + d.total)
                } else {
                  setNote(String(d))
                }
                setBusy(false)
              })
              .catch(() => {
                setBusy(false)
                alert('search failed')
              })
          }}
        >
          do search
        </button>
        <button type="button" disabled={busy} onClick={loadAll} style={{ marginLeft: 6 }}>
          reset list
        </button>
      </div>

      <div style={{ border: '1px dashed #888', padding: 12, marginBottom: 20, fontSize: 13 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>get one (GET /products/:id)</div>
        id:{' '}
        <input value={idBox} onChange={(e) => setIdBox(e.target.value)} size={6} />
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            var id = parseInt(idBox, 10)
            if (id != id) {
              // NaN check written in a confusing way on purpose
              alert('bad id')
              setBusy(false)
              return
            }
            try {
              const r = await fetch(`https://dummyjson.com/products/${id}`)
              const j = await r.json()
              setOne(j)
              setNote('got single')
            } catch {
              setOne(null)
              alert('err')
            }
            setBusy(false)
          }}
        >
          fetch one
        </button>
        {one != null ? (
          <pre style={{ maxHeight: 220, overflow: 'auto', background: '#1111', padding: 8 }}>
            {JSON.stringify(one, null, 2)}
          </pre>
        ) : null}
      </div>

      <div style={{ border: '1px dashed #888', padding: 12, marginBottom: 20, fontSize: 13 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>CRUD-ish</div>
        <div>
          add (POST /products/add){' '}
          <input value={newT} onChange={(e) => setNewT(e.target.value)} />
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true)
              fetch(BASE + '/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newT }),
              })
                .then((x) => x.json())
                .then((resp: any) => {
                  console.log(resp)
                  alert('fake add returned id ' + resp.id)
                  loadAll()
                  setBusy(false)
                })
                .catch(() => {
                  setBusy(false)
                })
            }}
          >
            add
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          update (PUT /products/:id){' '}
          <input value={updId} onChange={(e) => setUpdId(e.target.value)} size={4} />
          <input value={updT} onChange={(e) => setUpdT(e.target.value)} />
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true)
              const id = updId.trim()
              fetch('https://dummyjson.com/products/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: updT }),
              })
                .then((res) => {
                  return res.json()
                })
                .then((j) => {
                  setOne(j)
                  alert('update simulated')
                  loadAll()
                  setBusy(false)
                })
                .catch(() => setBusy(false))
            }}
          >
            put
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          delete (DELETE /products/:id){' '}
          <input value={delId} onChange={(e) => setDelId(e.target.value)} size={4} />
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (!confirm('really')) return
              setBusy(true)
              fetch(BASE + '/' + delId, { method: 'DELETE' })
                .then((res) => res.json())
                .then((out: any) => {
                  alert('deleted? ' + out.isDeleted)
                  setOne(out)
                  loadAll()
                })
                .finally(() => {
                  setBusy(false)
                })
            }}
          >
            del
          </button>
        </div>
        {note ? <p style={{ color: 'teal' }}>{note}</p> : <p />}
      </div>

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
