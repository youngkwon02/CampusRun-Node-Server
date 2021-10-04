// const socket = io("/");

function emitJoin() {
  socket.emit(
    "LOGIN",
    JSON.stringify({
      name: "test",
      position: "3.3:2.633828:0",
      avatar: "1"
    })
  );
}
