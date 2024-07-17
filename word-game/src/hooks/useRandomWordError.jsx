export const useRandomWordError = (res, setRes, setRespuesta, setSurrender, setPalabra, setDefinicion, setTipo) => {
    if(res?.status == 200){
        //setRes(() => {});
        setRespuesta(() => "");
        setPalabra(() => res?.data?.word);
        setDefinicion(() => res?.data?.def)
        setTipo(() => res?.data?.type);
        setSurrender(() => false);
        console.log("USE", res);
    }
    if(res?.response?.status == 404){
        setRes(() => {});
        alert("Palabra no encontrada")
    }
    if(res?.response?.status == 500){
        setRes(() => {});
        setRandomWord("palabra no encontrada")
    }
}
