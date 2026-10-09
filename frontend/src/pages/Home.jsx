import { useEffect, useState } from 'react'
import api from '../api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [cats, setCats] = useState([]); const [data, setData] = useState({ content: [], totalPages: 0 })
  const [q, setQ] = useState(''); const [cat, setCat] = useState(''); const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(0); const [loading, setLoading] = useState(true)

  useEffect(() => { api.get('/categories').then(r => setCats(r.data)) }, [])
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      api.get('/products', { params: { q, categoryId: cat || undefined, sort, page, size: 8 } })
        .then(r => setData(r.data)).finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(t)
  }, [q, cat, sort, page])

  return (
    <>
      <div className="filters">
        <input placeholder="Search products..." value={q} onChange={e => { setQ(e.target.value); setPage(0) }} />
        <select value={cat} onChange={e => { setCat(e.target.value); setPage(0) }}>
          <option value="">All categories</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={sort} onChange={e => { setSort(e.target.value); setPage(0) }}>
          <option value="newest">Newest</option><option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option><option value="rating">Top rated</option>
        </select>
      </div>
      {loading ? <p>Loading...</p> : !data.content.length ? <p>No products found.</p> :
        <div className="grid">{data.content.map(p => <ProductCard key={p.id} p={p} />)}</div>}
      {data.totalPages > 1 && (
        <div className="pager">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page + 1} of {data.totalPages}</span>
          <button disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>)}
    </>
  )
}
