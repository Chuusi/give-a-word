import { useEffect, useState } from 'react'
import './App.css'
import { getMyDefinicion } from './services/palabra.service';
import { useRandomWordError } from './hooks/useRandomWordError';




function App() {
  const [palabra, setPalabra] = useState('subconjunto');
  const [definicion, setDefinicion] = useState("")
  const [tipo, setTipo] = useState([]);
  const [res, setRes] = useState({})
  const [words, setWords] = useState([]);
  const [randomWord, setRandomWord] = useState("")
  const [cargando, setCargando] = useState(false)
  const [respuesta, setRespuesta] = useState("");
  const [surrender, setSurrender] = useState(false)
  const [acepcion, setAcepcion] = useState(0);
  const [sinonimos, setSinonimos] = useState([]);
  const [verSin, setVerSin] = useState(false)
  const [verPrimera, setVerPrimera] = useState(false)

  //Fetch para crear el array con todas las palabras a partir del documento .txt
  useEffect(() => {
    fetch('/listado-general.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        setWords(lines);
      })
      .catch(error => console.log("Error en el fetching de las palabras", error))
  },[])

  //Función que pone todos los valores a 0 y busca una nueva palabra
  const resetGame = async() => {
    setRespuesta("");
    setSurrender(false)
    setAcepcion(0)
    setVerSin(false)
    setVerPrimera(false)
    const wordNumber = Math.floor(Math.random() * (80383 + 1));
    setRandomWord(words[wordNumber]);
    setCargando(true)
    setRes(await getMyDefinicion(randomWord));
    setCargando(false)
  }

  const handleEnter = async(e) => {
    if(e.key == 'Enter') {
      resetGame();
    }
  }

  const handleButtons = (btn) => {
    switch (btn.target.value){
      case "sinon":
        setVerSin(!verSin);
        break
      case "primer":
        setVerPrimera(!verPrimera)
        break
      case "acep":
        const acep = acepcion;
        if (acepcion < tipo.length - 1) setAcepcion(acep + 1);
        break
      case "surr":
        setSurrender(!surrender)
        break
      case "reset":
        resetGame();
        break;
    }
  }


  useEffect(() => {
    if(res && Object.keys(res).length > 0){
      useRandomWordError(res, setRes, setRespuesta, setSurrender, setPalabra, setDefinicion, setTipo, setSinonimos);
    }
  },[res])


  return (
    <>
    <div className='juego'>
      <h1 className='title'>PALAPASABRA</h1>
      <h2 className='game-def-word'>Definición de {palabra.toLowerCase().split(",")[0] == respuesta || surrender ? palabra : verPrimera ? palabra.split(",")[0][0]+".." : "..."}</h2>
      <div className="inner-game">
        {res && !cargando ? (
          <div className='all-def'>
                {tipo.map((elemento, index) => {
                  return index <= acepcion 
                  ? (<div key={index} className='every-def'>
                      <p>TIPO: {elemento}</p>
                      <p>DEFINICIÓN: {definicion[index]}</p>
                      {verSin && sinonimos[index]?.length - 1 > 1 ? <p>SINÓNIMOS: {sinonimos[index]}</p> : ""}
                      {verSin && sinonimos[index]?.length == 0 ? <p>No tiene sinónimos</p> : ""}
                    </div>)
                  : ""
                })}
                {tipo.length-1 == 0 ? <p className='acepciones'>Esta es la única acepción</p> : ""}
                {tipo.length-1 == acepcion && tipo.length-1 > 0 ? <p className='acepciones'>Estas son todas las acepciones</p> : ""}
                
          </div>
        ) : (<p className='loading-word'>Cargando siguiente palabra...</p>
        )}
        
        <div className='inputs-box'>
          <div className="letter-case">
            <h4 className={palabra.toLowerCase().split(",")[0] == respuesta ? 'letter correct-letter' : surrender ? 'letter surrender-letter' : 'letter'}>{surrender || verPrimera || palabra.toLowerCase().split(",")[0] == respuesta ? palabra.split(",")[0][0].toUpperCase() : "?"}</h4>
          </div>
          <button value="primer" onClick={handleButtons}>Ver primera letra</button>
          <button disabled={tipo.length-1 == acepcion} value="acep" onClick={handleButtons}>Siguiente acepción</button>
          <button value="sinon" onClick={handleButtons}>Ver sinónimos</button>
          <button disabled={surrender || palabra.toLowerCase().split(",")[0] == respuesta} value="surr" onClick={handleButtons}>Ver respuesta</button>
          <button value="reset" id="btn-change" onClick={handleButtons}>Siguiente</button>
          <div className="correct-case">
            <div className={palabra.toLowerCase().split(",")[0] == respuesta ? "correct-text-case" : ""}>
              <h3 className="correct-text">{palabra.toLowerCase().split(",")[0] == respuesta ? "CORRECTO" : ""}</h3>
            </div>
          </div>
        </div>
        <div className="input-game-case">
          <input 
            disabled={surrender || palabra.toLowerCase().split(",")[0] == respuesta}
            className='input-game'
            placeholder="Escribe aquí tu palabra..." 
            onKeyDown={handleEnter} 
            type="text" 
            value={respuesta} 
            onChange={event => {setRespuesta(event.target.value)}}
          />
        </div>
      </div>
      

    </div>
    </>
  )
}

export default App
