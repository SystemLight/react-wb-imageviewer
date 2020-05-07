import axios from 'axios';


const httpProxy = axios.create({
    baseURL: "/proxy",
    timeout: 20000,
    withCredentials: true
});

const httpCommon = axios.create({
    baseURL: "/",
    timeout: 20000
});


export const http = httpProxy;