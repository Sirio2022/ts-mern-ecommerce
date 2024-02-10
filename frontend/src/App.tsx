
import './App.css'
import { formatoMoneda } from './utils/Utils'
import { sampleProducts } from './data'

function App() {


  return (
    <div>
      <header>
        TS Ecommerce
      </header>

      <main>
        <ul>
          {sampleProducts.map((product) => (
            <li
              key={product.slug}
            >
              <img src={product.image} alt={product.name} className='product-image' />
              <h2>{product.name}</h2>
              <p>{formatoMoneda(product.price)}</p>
            </li>
          ))}
        </ul>
      </main>

      <footer>
        All rights reserved &copy; Juan Manuel Alvarez &#128640; {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App
