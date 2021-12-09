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
  const USERNAME = document.querySelector(".username").innerHTML;
  const currentURL = location.href;
  splittedURL = currentURL.split("/");
  url = splittedURL[3];
  // -65 , 122.63, 13.6
  socket.emit(
    "LOGIN",
    JSON.stringify({
      userName: USERNAME,
      name: KAKAOID,
      position: "-110:10.633828:2", // Not used coordinate
      avatar: "1",
      url: url,
    })
  );

  // Record insert
  let now = new Date().getTime() + 10000;
  let res = await ajaxRequest(
    "GET",
    "http://10.210.96.142:8000/game/api/new-record",
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
    "http://10.210.96.142:8000/game/api/room-status-by-url",
    {
      currentURL: currentURL,
    }
  );
  let remainPlayer = res["data"];
  if (remainPlayer === 0) {
    setTimeout(() => {
      if (!emitJoinCall[0]) {
        emitJoinCall[0] = true;
        setTimeout(() => {
          document.getElementById("webgl-id").style.display = "block";
        }, 100); // Sync때문에 처리한건데 의미없어보임..
        emitJoin();
      }
      clearInterval(checkInterv);
    }, 28000);
  } else {
    console.log("Not yet..");
  }
  return remainPlayer;
};

const checkGameEnd = async (currentURL, checkInterv) => {
  let res = await ajaxRequest(
    "GET",
    "http://10.210.96.142:8000/game/api/end-check",
    {
      gameURL: currentURL,
    }
  );
  console.log(res);

  if (res.status !== 200) {
    alert("비정상적인 접근입니다!\n메인화면으로 이동합니다.");
    location.href = "/home";
  }

  if (res.gameStatus === "end") {
    winnerPopUp(res.winner);
    endCountDown(currentURL);
    clearInterval(checkInterv);
  }
};

const winnerPopUp = (winnerName) => {
  document.querySelector(".winnerName").innerHTML = winnerName;
  document.querySelector(".winnerPopUp").style.top = "0";
};

const endCountDown = (currentURL) => {
  document.querySelector(".endCountDown").style.opacity = 1;
  let count = 10;
  let countDownInterv = setInterval(() => {
    document.querySelector(".endCountDown").innerHTML = count;
    count--;
    if (count === 0) {
      updateResultBoard(currentURL);
    }
    if (count === -1) {
      clearInterval(countDownInterv);
      document.querySelector(".winnerPopUp").style.top = "-200px";
      document.querySelector(".endCountDown").style.opacity = 0;
      $("#myModal").show();
    }
  }, 1000);
};

const updateResultBoard = async (currentURL) => {
  let res = await ajaxRequest(
    "GET",
    "http://10.210.96.142:8000/game/api/result-board",
    {
      gameURL: currentURL,
    }
  );

  let rankData = res.result;
  let resBody = document.querySelector(".resultTableBody");
  for (let i = 0; i < rankData[rankData.length - 1].rank; i++) {
    console.log("updateResultBoard FORLOOP!!!");
    let content = `
      <tr>
        <td>${rankData[i].rank}</td>
        <td>${rankData[i].name}</td>
        <td>${rankData[i].univ}</td>
        <td>${timeConvert(rankData[i].time)}</td>
      </tr>
    `;
    resBody.innerHTML += content;
  }
};

const timeConvert = (nanoSeconds) => {
  if (nanoSeconds === "Retire") {
    return "Retire";
  }
  const minPart = nanoSeconds - (nanoSeconds % 60000);
  const secPart = nanoSeconds - minPart - ((nanoSeconds - minPart) % 1000);
  const remain = nanoSeconds % 1000;

  const min = minPart / 60000;
  const sec = secPart / 1000;
  const rem = remain;

  return `${min}분 ${sec}초 ${rem}`;
};

function show() {
  document.querySelector(".background").className = "background show";
}

function close() {
  document.querySelector(".background").className = "background";
}

//팝업 Close 기능
function close_pop(flag) {
  document.querySelector(".univ-logo").style.display = "none";
  document.querySelector(".close-btn").innerHTML = "EXIT";
  document.querySelector(".close-btn").addEventListener("click", () => {
    location.href = "/plaza";
  });
}
window.onload = () => {
  let emitJoinCall = [false];
  let currentURL = window.location.href;
  let startCheckingInterv = setInterval(() => {
    checkGameStart(currentURL, startCheckingInterv, emitJoinCall);
  }, 200);

  setTimeout(() => {
    let endCheckingInterv = setInterval(() => {
      checkGameEnd(currentURL, endCheckingInterv);
      console.log("Game End Checking!!!");
    }, 200);
  }, 50000);

  // document.querySelector("#show").addEventListener("click", show);
  // document.querySelector("#close").addEventListener("click", close);
  // $('#myModal').show();
};
