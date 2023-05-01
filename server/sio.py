import socketio


sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*", 
    # logger=True,
    # engineio_logger=True,
    ping_interval=10,
    ping_timeout=40000,
    timeout=30,
)
