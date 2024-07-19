export const useCreateListError = (sins,tipos, definiciones, palabrados, element) => {
    const defNoSin = [];
    const sin = [];
    for(let e of element.def){
        defNoSin.push(e.split("Sin.")[0]);
        sin.push(e.split("Sin.")[1] ? e.split("Sin.:")[1] : "");
    }
    sins.push(sin)
    tipos.push(element.type)
    definiciones.push(defNoSin)
    palabrados.push(element.word)
}
