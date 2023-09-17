import axios from "axios"

export const ax = axios.create({
    // baseURL: 'http://10.152.183.45/api/v2-rest', // dev
    baseURL: 'https://minigis.in-arthurs-apps.space/api/v2-rest', // prod
    headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("miniGISToken")}`
    }
})
