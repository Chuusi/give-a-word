import { useEffect, useState } from 'react'
import './App.css'
import { getMyDefinicion } from './services/palabra.service';
import { useRandomWordError } from './hooks/useRandomWordError';
import { saveAs } from 'file-saver'
import { useCreateTxt } from './hooks/useCreateTxt';
import { useCreateListError } from './hooks/useCreateListError';



function App() {
  const [palabra, setPalabra] = useState('abad');
  const [definicion, setDefinicion] = useState("")
  const [tipo, setTipo] = useState([]);
  const [res, setRes] = useState({})
  const [allWords, setAllWords] = useState([]);
  const [randomWord, setRandomWord] = useState("")
  const [words, setWords] = useState([]);
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
      resetGame();
  },[])




  //!PARA CUANDO TENGA EL TXT Y NO NECESITEMOS SERVIDOR
  /* const [allDef, setAllDef] = useState([])
  const [definicion, setDefinicion] = useState([])
  const [allTipos, setAllTipos] = useState([])
  const [tipo, setTipo] = useState([])
  const [allSinonimos, setAllSinonimos] = useState([]) */
  /* useEffect(() => {
    const palabrados = [];
    const definiciones = [];
    const tipos = [];
    const sins = [];
    fetch('/probando.txt')
      .then(res => res.text())
      .then(text => {
        console.log("FETCH", JSON.parse(text));
        const listado = JSON.parse(text)
        for (let element of listado){
          useCreateListError(sins, tipos, definiciones, palabrados, element)
          
          console.log(element.word);
        }
        setAllDef([...definiciones])
        setAllTipos([...tipos])
        setAllSinonimos([...sins])
        console.log("WORDS", palabrados,definiciones,sins);
      })
      .catch(error => console.log("ERROR DEL FETCHING DE PRUEBA", error))
  },[]) */



  //Función que pone todos los valores a 0 y busca una nueva palabra
  const resetGame = async() => {
    setRespuesta("");
    setSurrender(false)
    setAcepcion(0)
    setVerSin(false)
    setVerPrimera(false)
    const wordNumber = Math.floor(Math.random() * (80383 + 1));
    setCargando(true)

    //!PARA CUANDO TENGA EL TXT Y NO NECESITEMOS SERVIDOR
    /* setDefinicion(allDef[wordNumber])
    setTipo(allTipos[wordNumber])
    setPalabra(words[wordNumber]);
    setSinonimos(allSinonimos[wordNumber]) */

    setRes(await getMyDefinicion(words[wordNumber]));
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




  //! PARA CUANDO TENGA EL TXT Y NO NECESITEMOS SERVIDOR
  //! PARA CREAR EL TXT
  /* const [palabraTxt, setPalabraTxt] = useState({})
  const [listaDef, setListaDef] = useState([])

  const handleCrear = async() => {
    const array = [...allWords];
    console.log(words.slice(0, 20));
    setListaDef(() => []);
    for(let element of array){
      setRes(await getMyDefinicion(element));
    }

    const promises = array.map(async(element) => {
      return getMyDefinicion(element);
    })
    const results = await Promise.all(promises);
    setRes(results) 
  }

  useEffect(() => {
    console.log("RES",res);
    if(res && res.length > 0){
      const updatedList = [];
      res?.forEach(res => {
        useCreateTxt(res, setRes, setPalabraTxt, setListaDef, updatedList);
      })
      setListaDef([...updatedList])
    }
  },[res])

  useEffect(() => {
      console.log(listaDef);
      if(listaDef.length > 0){
        console.log("LISTADEF", typeof JSON.stringify(listaDef));
        const def = JSON.stringify(listaDef);
        console.log("DEF", typeof def);
        const blob = new Blob([def], {type:"text/plain;charset=utf-8"});
        saveAs(blob, "probando.txt")
      }
  },[listaDef]) */



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
                {tipo?.map((elemento, index) => {
                  return index <= acepcion 
                  ? (<div key={index} className='every-def'>
                      <p>TIPO: {elemento}</p>
                      <p>DEFINICIÓN: {definicion[index]}</p>
                      {verSin && sinonimos[index]?.length - 1 > 1 ? <p>SINÓNIMOS: {sinonimos[index]}</p> : ""}
                      {verSin && sinonimos[index]?.length == 0 ? <p>No tiene sinónimos</p> : ""}
                    </div>)
                  : ""
                })}
                {tipo?.length-1 == 0 ? <p className='acepciones'>Esta es la única acepción</p> : ""}
                {tipo?.length-1 == acepcion && tipo.length-1 > 0 ? <p className='acepciones'>Estas son todas las acepciones</p> : ""}
                
          </div>
        ) : (<p className='loading-word'>Cargando siguiente palabra...</p>
        )}
        
        <div className='inputs-box'>
          <div className="letter-case">
            <h4 className={palabra.toLowerCase().split(",")[0] == respuesta ? 'letter correct-letter' : surrender ? 'letter surrender-letter' : 'letter'}>{surrender || verPrimera || palabra.toLowerCase().split(",")[0] == respuesta ? palabra.split(",")[0][0].toUpperCase() : "?"}</h4>
          </div>
          <button value="primer" onClick={handleButtons}>Ver primera letra</button>
          <button disabled={tipo?.length-1 == acepcion} value="acep" onClick={handleButtons}>Siguiente acepción</button>
          <button value="sinon" onClick={handleButtons}>Ver sinónimos</button>
          <button disabled={surrender || palabra.toLowerCase().split(",")[0] == respuesta} value="surr" onClick={handleButtons}>Ver respuesta</button>
          <button value="reset" id="btn-change" onClick={handleButtons}>Siguiente</button>
          {/* <button onClick={handleCrear} className="crear-file">CREAR TXT</button> */}
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
