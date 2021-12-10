var socket = io() || {};
socket.isReady = false;

window.addEventListener("load", function() {
  var execInUnity = function(method) {
    if (!socket.isReady) return;

    var args = Array.prototype.slice.call(arguments, 1);

    f(unityInstance != null);
    {
      //fit formats the message to send to the Unity client game, take a look in NetworkManager.cs in Unity
      unityInstance.SendMessage("NetworkManager", method, args.join(":"));
    }
  }; //END_exe_In_Unity

  socket.on("PONG", function(socket_id, msg) {
    var currentUserAtr = socket_id + ":" + msg;

    if (unityInstance != null) {
      unityInstance.SendMessage(
        "NetworkManager",
        "OnPrintPongMsg",
        currentUserAtr
      );
    }
  }); //END_SOCKET.ON

  socket.on("LOGIN_SUCCESS", function(
    id,
    name,
    avatar,
    position,
    kakaoUniqueId
  ) {
    var currentUserAtr =
      id + ":" + name + ":" + avatar + ":" + position + ":" + kakaoUniqueId;

    if (unityInstance != null) {
      unityInstance.SendMessage("NetworkManager", "OnJoinGame", currentUserAtr);
    }
  }); //END_SOCKET.ON

  socket.on("SPAWN_PLAYER", function(
    id,
    name,
    avatar,
    position,
    kakaoUniqueId
  ) {
    var currentUserAtr =
      id + ":" + name + ":" + avatar + ":" + position + ":" + kakaoUniqueId;

    if (unityInstance != null) {
      // sends the package currentUserAtr to the method OnSpawnPlayer in the NetworkManager class on Unity
      unityInstance.SendMessage(
        "NetworkManager",
        "OnSpawnPlayer",
        currentUserAtr
      );
    }
  }); //END_SOCKET.ON

  socket.on("RESPAWN_PLAYER", function(
    id,
    name,
    avatar,
    position,
    kakaoUniqueId
  ) {
    var currentUserAtr =
      id + ":" + name + ":" + avatar + ":" + position + ":" + kakaoUniqueId;

    if (unityInstance != null) {
      unityInstance.SendMessage(
        "NetworkManager",
        "OnRespawPlayer",
        currentUserAtr
      );
    }
  }); //END_SOCKET.ON

  socket.on("UPDATE_MOVE_AND_ROTATE", function(id, position, rotation) {
    var currentUserAtr = id + ":" + position + ":" + rotation;

    if (unityInstance != null) {
      unityInstance.SendMessage(
        "NetworkManager",
        "OnUpdateMoveAndRotate",
        currentUserAtr
      );
    }
  }); //END_SOCKET.ON

  socket.on("UPDATE_PLAYER_ANIMATOR", function(id, animation) {
    var currentUserAtr = id + ":" + animation;

    if (unityInstance != null) {
      // sends the package currentUserAtr to the method OnUpdateAnim in the NetworkManager class on Unity
      unityInstance.SendMessage(
        "NetworkManager",
        "OnUpdateAnim",
        currentUserAtr
      );
    }
  }); //END_SOCKET.ON

  socket.on("UPDATE_ATTACK", function(currentUserId) {
    var currentUserAtr = currentUserId;

    if (unityInstance != null) {
      unityInstance.SendMessage(
        "NetworkManager",
        "OnUpdateAttack",
        currentUserAtr
      );
    }
  }); //END_SOCKET.ON

  socket.on("DEATH", function(targetId) {
    var currentUserAtr = targetId;
    if (unityInstance != null) {
      unityInstance.SendMessage(
        "NetworkManager",
        "OnPlayerDeath",
        currentUserAtr
      );
    }
  }); //END_SOCKET.ON

  socket.on("UPDATE_PHISICS_DAMAGE", function(targetId, targetHealth) {
    var currentUserAtr = targetId + ":" + targetHealth;

    if (unityInstance != null) {
      unityInstance.SendMessage(
        "NetworkManager",
        "OnUpdatePlayerPhisicsDamage",
        currentUserAtr
      );
    }
  }); //END_SOCKET.ON

  socket.on("USER_DISCONNECTED", function(id) {
    var currentUserAtr = id;

    if (unityInstance != null) {
      unityInstance.SendMessage(
        "NetworkManager",
        "OnUserDisconnected",
        currentUserAtr
      );
    }
  }); //END_SOCKET.ON
}); //END_window_addEventListener
