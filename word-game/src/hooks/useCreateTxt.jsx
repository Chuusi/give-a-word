export const useCreateTxt = (res, setRes, setPalabraTxt,setListaDef, updatedList) => {
    console.log(res);
    if(res?.status == 200){
        const objeto = {
            word: res?.data?.word,
            type: res?.data?.type,
            def: res?.data?.def,
        }
        setPalabraTxt(() => objeto)
        updatedList.push(objeto)
    }
    if(res?.response?.status == 404 || res?.response?.status==500){
        console.log("Palabra fail");
    }
}
