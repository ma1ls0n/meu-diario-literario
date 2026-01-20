import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [query, setQuery] = useState(""); //termo para busca dos livros
  const [books, setBooks] = useState([]); //lista de livros buscados
  const [listaLeitura, setListaLeitura] = useState([]); //livros escolhidos pelo usuário
  const [selectedBook, setSelectedBook] = useState(null);
  const [date, setDate] = useState("");
  const [pages, setPages] = useState("");
  const [feeling, setFeeling] = useState("");
  const [notes, setNotes] = useState("");
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

  const handleAddRegistro = (e) => {
    e.preventDefault();

    const newRegistro = {
      date,
      pages,
      feeling,
      notes
    };

    const updatedList = listaLeitura.map((book) =>
      book.id === selectedBook.id
        ? { ...book, registros: [...book.registros, newRegistro] }
        : book
    );

    setListaLeitura(updatedList);
    localStorage.setItem("books", JSON.stringify(updatedList));

    const updatedSelectedBook = updatedList.find(
      (book) => book.id === selectedBook.id
    );

    setSelectedBook(updatedSelectedBook);
    setDate("");
    setPages("");
    setFeeling("");
    setNotes("");
  };

  const formatDateBR = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
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
              
              <button onClick={() => setSelectedBook(book)}>Registrar Leitura</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {selectedBook && (
          <><form onSubmit={handleAddRegistro}>
            <h3>Registo de Leitura</h3>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)} />

            <input
              type="number"
              placeholder="Páginas lidas"
              required
              value={pages}
              onChange={(e) => setPages(e.target.value)} />

            <input
              type="text"
              placeholder="Como me senti ao terminar"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)} />

            <textarea
              placeholder='Anotações'
              value={notes}
              onChange={(e) => setNotes(e.target.value)} />

            <button type='submit'>Salvar Registro</button>
          </form>
          
          <h4>Histórico</h4>

          {selectedBook.registros.length === 0 && (
            <p>Nenhum registro ainda.</p>
          )}

          <ul>
            {selectedBook.registros.map((reg, index) => (
              <li key={index}>
                <p>📅 {formatDateBR(reg.date)}</p>
                <p>📖 {reg.pages} páginas</p>
                <p>🙂 {reg.feeling}</p>
                <p>📝 {reg.notes}</p>
              </li>
            ))}
          </ul>
          
          </>
        )}
      </div>

    </div>
  )
}

export default App
