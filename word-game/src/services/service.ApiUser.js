import axios from 'axios'

const APIHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
};

export const APIuser = axios.create({
    baseURL: `http://localhost:8181/rae`,
    headers: APIHeaders,
    timeout: 6000,
});