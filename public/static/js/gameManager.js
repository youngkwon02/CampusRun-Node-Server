const ajaxRequest = (type, url, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: type,
      data: data,
      dataType: "json",
      success: function (response) {
        console.log(response);
        resolve(response);
      },
      error: function () {
        console.log("error");
        return "사용자를 찾을 수 없습니다.";
      },
    });
  });
};

const emitJoin = async () => {
  const KAKAOID = document.querySelector(".KAKAOID").innerHTML;
  const currentURL = location.href;
  splittedURL = currentURL.split("/");
  url = splittedURL[3];
  socket.emit(
    "LOGIN",
    JSON.stringify({
      name: KAKAOID,
      position: "-50:124.633828:2",
      avatar: "1",
      url: url,
    })
  );

  // Record insert
  let now = new Date().getTime() + 10000;
  let res = await ajaxRequest(
    "GET",
    "http://localhost:8000/game/api/new-record",
    {
      kakaoId: KAKAOID,
      currentURL: currentURL,
      start: now,
    }
  );
};

const checkGameStart = async (currentURL, checkInterv, emitJoinCall) => {
  let res = await ajaxRequest(
    "GET",
    "http://localhost:8000/game/api/room-status-by-url",
    {
      currentURL: currentURL,
    }
  );
  let remainPlayer = res["data"];
  if (remainPlayer === 0) {
    console.log("TIMEOUT CALL");
    setTimeout(() => {
      if (!emitJoinCall[0]) {
        emitJoinCall[0] = true;
        emitJoin();
      }
      clearInterval(checkInterv);
    }, 18000);
  } else {
    console.log("Not yet..");
  }
  return remainPlayer;
};

function show() {
  document.querySelector(".background").className = "background show";
}

function close() {
  document.querySelector(".background").className = "background";
}

//팝업 Close 기능
function close_pop(flag) {
  $("#myModal").hide();
}
window.onload = () => {
  document.getElementById("btn_id").style.display = "none";
  let emitJoinCall = [false];
  let currentURL = window.location.href;
  let checkInterv = setInterval(() => {
    checkGameStart(currentURL, checkInterv, emitJoinCall);
  }, 330);

  // document.querySelector("#show").addEventListener("click", show);
  // document.querySelector("#close").addEventListener("click", close);
  // $('#myModal').show();
};
