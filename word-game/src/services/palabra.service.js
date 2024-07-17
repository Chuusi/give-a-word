import { axiosUtil } from "../utils/axios";
import { APIuser } from "./service.ApiUser";

export const getMyDefinicion = async(palabra) => {
    return APIuser.get(`/definir/${palabra}`)
        .then((res) => res)
        .catch((error) => error);
}

export const getDefinicion = async(palabra) => {
    const optionRequest = {
        method: "GET",
        url: `http://localhost:3001/rae/definir/${palabra}`,
    };
    return await axiosUtil(optionRequest)
}