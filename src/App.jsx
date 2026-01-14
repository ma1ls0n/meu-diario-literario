import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  const buscarLivros = async () =>{
    if (!query) return; //retorna se a barra de pesquisa está vazia

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q="${query}"&orderBy=relevance&maxResults=20`); //busca os livros via API
      const data = await response.json();
    
      setBooks(data.items || []);
      
    } catch {
      setError("Erro ao Buscar Livros")
    }
    
  }

  return (
    <div>
      <h1>Meu Diario Literario</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        buscarLivros();
        }}>

        <input 
          type="text" 
          placeholder="Buscar livros ou autor"
          value={query}
          onChange={(e) => setQuery(e.target.value)} 
        />

        <button onClick={buscarLivros}>Buscar</button>

      </form>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              width="100"
            />
            <p>{book.volumeInfo.title}</p>
            <p>{book.volumeInfo.authors?.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
