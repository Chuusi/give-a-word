import { useEffect, useState } from 'react'
import './App.css'
import { getDefinicion, getMyDefinicion } from './services/palabra.service';
import { useRandomWordError } from './hooks/useRandomWordError';




function App() {
  const [palabra, setPalabra] = useState('ajo');
  const [definicion, setDefinicion] = useState("")
  const [tipo, setTipo] = useState("");
  const [res, setRes] = useState({})
  const [words, setWords] = useState([]);
  const [randomWord, setRandomWord] = useState("")
  const [respuesta, setRespuesta] = useState("");
  const [surrender, setSurrender] = useState(false)


  useEffect(() => {
    fetch('/listado-general.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        setWords(lines);
      })
      .catch(error => console.log("Error en el fetching de las palabras", error))
  },[])

  const handleEnter = async(e) => {
    if(e.key == 'Enter') {
      const wordNumber = Math.floor(Math.random() * (80383 + 1));
      setRandomWord(words[wordNumber]);
      setRes(await getMyDefinicion(randomWord));
      setRespuesta("");
      setSurrender(false)
    }
  }

  const handleWord = async() => {
    const wordNumber = Math.floor(Math.random() * (80383 + 1));
    setRandomWord(words[wordNumber]);
    setRes(await getMyDefinicion(randomWord));
    setRespuesta("");
    setSurrender(false)
  }

  useEffect(() => {
    if(res && Object.keys(res).length > 0){
      useRandomWordError(res, setRes, setRespuesta, setSurrender, setPalabra, setDefinicion, setTipo);
    }
  },[res])

  const handleSurrender = () => {
    setSurrender(!surrender);
  }


  return (
    <>
    <div className='juego'>
      <h1>Definición de {palabra.toLowerCase().split(",")[0] == respuesta ? palabra : "..."}</h1>
      {res ? (
        <div>
            <div>
              <p>Tipo: {res?.data?.type}</p>
              <p>Definición: {definicion}</p>
            </div>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
      
      <div className='inputs-box'>
        <input placeholder="Escribe aquí tu palabra..." onKeyDown={handleEnter} type="text" value={respuesta} onChange={event => {setRespuesta(event.target.value)}}/>
        <button onClick={handleSurrender}>Ver respuesta</button>
        <button id="btn-change" onClick={handleWord} >Siguiente</button>
      </div>
      <h3>{palabra.toLowerCase().split(",")[0] == respuesta ? "CORRECTO" : ""}</h3>
      <h4>{surrender ? "La palabra era "+ palabra : ""}</h4>
    </div>
    </>
  )
}

export default App
