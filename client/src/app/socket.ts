import { io } from 'socket.io-client'


// export const socket = io("wss://minigis.in-arthurs-apps.space", {
export const socket = io("ws://10.152.183.45", {
        path: '/sio/workflow',
        transports: ["websocket"],
        auth: {
            token: localStorage.getItem("miniGISToken")
        },
    })