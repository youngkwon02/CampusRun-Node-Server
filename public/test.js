// const socket = io("/");

function emitJoin() {
  socket.emit(
    "LOGIN",
    JSON.stringify({
      name: "test2",
      position: "3.3:2.633828:0",
      avatar: "1"
    })
  );
  document.getElementById("btn_id").style.display = "none";
}
