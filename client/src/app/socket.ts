import { io } from 'socket.io-client'


export const socket = io("wss://minigis.in-arthurs-apps.space", {
        path: '/sio/workflow',
        transports: ["websocket"],
        auth: {
            token: localStorage.getItem("miniGISToken")
        },
    })