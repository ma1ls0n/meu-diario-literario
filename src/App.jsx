import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [query, setQuery] = useState(""); //termo para busca dos livros
  const [books, setBooks] = useState([]); //lista de livros buscados
  const [listaLeitura, setListaLeitura] = useState([]); //livros escolhidos pelo usuário
  const [error, setError] = useState(""); 

  useEffect( () => {
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    setListaLeitura(storedBooks);
  }, []);

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

  const saveBook = (book) => {
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];

    const newBook = {
      id: book.id,
      titulo: book.volumeInfo.title,
      autores: book.volumeInfo.authors,
      capa: book.volumeInfo.imageLinks?.thumbnail,
      totalPaginas: book.volumeInfo.pageCount,
      status: "lendo",
      registros: [],
      resenhaFinal: "",
      notaFinal: null
    };

    const updatedBooks = [...storedBooks, newBook]; // todos os livros salvos anteriormente + o livro a ser salvo

    localStorage.setItem("books", JSON.stringify(updatedBooks)); // updatedBooks se torna a nova lista de livros
    setListaLeitura(updatedBooks); // atualiza a lista de leitura na UI
  };

  return (
    <div>
      <h1>Meu Diario Literario</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        buscarLivros();
        }}>

        <input
          type="text" 
          placeholder="Buscar livro ou autor"
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
            <button onClick={() => saveBook(book)}>Adicionar</button>
          </li>
        ))}
      </ul>
      
      <div>
        <h2>Lista de Leitura</h2>
        
        {listaLeitura === 0 && <p>Nenhum livro adicionado.</p>}

        <ul>
          {listaLeitura.map((book) => (
            <li key={book.id}>
              <img src={book.capa} alt={book.titulo} width="80" />
              <p>{book.titulo}</p>
              <p>{book.autores?.join(", ")}</p>
            </li>
          ))}
        </ul>

      </div>

    </div>
  )
}

export default App
