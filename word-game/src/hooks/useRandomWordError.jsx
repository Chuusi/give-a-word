export const useRandomWordError = (res, setRes, setRespuesta, setSurrender, setPalabra, setDefinicion, setTipo, setSinonimos) => {
    if(res?.status == 200){
        //setRes(() => {});
        setRespuesta(() => "");
        setPalabra(() => res?.data?.word);
        const defArray = [];
        const sinArray = [];
        res?.data?.def.map((elemento) => {
            let noSin = elemento.split("Sin.")[0];
            //Aquí se pueden añadir cambios en el string devuelto para facilitar la lectura
            if(noSin?.includes("Matambién") 
                || noSin?.includes("U. también c. s.")
                || noSin?.includes("u. t. c. prnl.")
                || noSin?.includes("U. también c. s. m.")
                || noSin?.includes("Antambién:")
            ){
                noSin = noSin.replace("Matambién","En matemáticas - ")
                noSin = noSin.replace("U. también c. s.", "U.t.c.s.")
                noSin = noSin.replace("u. t. c. prnl.","U.t.c.p.")
                noSin = noSin.replace("U. también c. s. m.","U.t.c.s.m.")
                noSin = noSin.replace("Antambién:", " Ant: ")
            }
            const sinonimos = elemento.split("Sin.")[1] ? elemento.split("Sin.:")[1] : "";
            defArray.push(noSin);
            sinArray.push(sinonimos);
        })
        /* setDefinicion(() => res?.data?.def) */
        setDefinicion(() => defArray);
        setSinonimos(() => sinArray);
        setTipo(() => res?.data?.type);
        setSurrender(() => false);
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
