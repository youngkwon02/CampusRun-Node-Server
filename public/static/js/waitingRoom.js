window.onload = () => {
  const currentURL = window.location.href;
  entranceArrangement(currentURL);
  syncData(currentURL);
  let syncInterv = setInterval(() => {
    syncData(currentURL, syncInterv);
  }, 400);
  const quitBtn = document.querySelector(".btn-quit");
  quitBtn.addEventListener("click", () => {
    quitWaitRoom(currentURL);
  });
};

window.onunload = () => {
  const URL = window.location.href;
  quitWaitRoom(URL);
};

const entranceArrangement = async (waitURL) => {
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  let arranRes = await ajaxRequest(
    "GET",
    "http://10.210.60.80:8000/game/api/ent-arrangement",
    { kakaoId: KAKAOID, waitURL }
  );
  if (arranRes.status === 200) {
    console.log(arranRes.message);
  } else {
    location.href = "http://10.210.60.80:3000/plaza";
  }
};

const syncData = async (waitURL, syncInterv) => {
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  let currentIdList = "";
  currentIdList = document.querySelector(".idList").innerHTML;

  let syncRes = await ajaxRequest(
    "GET",
    "http://10.210.60.80:8000/game/api/sync-wait-room-status",
    { waitURL, currentIdList }
  );
  if (syncRes.status === 200 && syncRes.message === "Data sync complete..") {
    document.querySelector(".idList").innerHTML = syncRes.data.idList;
    document.querySelector(
      ".room-title"
    ).innerHTML = `방 제목: [${syncRes.data.roomTitle}]`;
    let homeEnt = syncRes.data.homeEntry;
    let awayEnt = syncRes.data.awayEntry;

    document.querySelector(".home-space").innerHTML = "";
    for (let i = 0; i < homeEnt.length; i++) {
      let entry = "";
      if (syncRes.data.creater.kakaoId === homeEnt[i].kakaoId) {
        entry = `
          <div class="entry creater-entry">
            <img class="creater-icon" src="../../Assets/image/creater.png">
            <div class="nickname">${homeEnt[i].name}</div>
            <div class="univ">${homeEnt[i].univ}</div>
            <div class="profileImg"></div>
          </div>
        `;
      } else {
        entry = `
          <div class="entry">
            <div class="nickname">${homeEnt[i].name}</div>
            <div class="univ">${homeEnt[i].univ}</div>
            <div class="profileImg"></div>
          </div>
        `;
      }
      document.querySelector(".home-space").innerHTML += entry;
    }

    document.querySelector(".away-space").innerHTML = "";
    for (let i = 0; i < awayEnt.length; i++) {
      let entry = `
        <div class="entry">
          <div class="nickname">${awayEnt[i].name}</div>
          <div class="univ">${awayEnt[i].univ}</div>
          <div class="profileImg"></div>
        </div>
      `;
      document.querySelector(".away-space").innerHTML += entry;
    }

    if (syncRes.data.creater.kakaoId === KAKAOID && syncRes.data.isFull) {
      const startBtn = document.querySelector(".btn-game-start");
      startBtn.style.backgroundColor = "royalblue";
      startBtn.addEventListener("click", (e) => {
        requestGameStart(waitURL);
      });
    }
    if (syncRes.data.isFull) {
      let startCheckingProm = startChecking(waitURL, syncRes.data.roomTitle);
      startCheckingProm.then((result) => {
        if (result) {
          clearInterval(syncInterv);
        }
      });
    }
    if (syncRes.data.creater.kakaoId === KAKAOID) {
      document.querySelector(
        "body > div.main-board > div.right-side > div.btn-container > div.btn.btn-game-start"
      ).style.display = "inline-block";
    } else {
      document.querySelector(
        "body > div.main-board > div.right-side > div.btn-container > div.btn.btn-game-start"
      ).style.display = "none";
    }
  } else if (
    syncRes.status === 200 &&
    syncRes.message === "Nothing to sync.."
  ) {
    if (syncRes.data.isFull) {
      let startCheckingProm = startChecking(waitURL, syncRes.data.roomTitle);
      startCheckingProm.then((result) => {
        if (result) {
          clearInterval(syncInterv);
        }
      });
    }
    console.log(`${syncRes.data.creater.kakaoId === KAKAOID}`);
    if (syncRes.data.creater.kakaoId === KAKAOID) {
      document.querySelector(
        "body > div.main-board > div.right-side > div.btn-container > div.btn.btn-game-start"
      ).style.display = "inline-block";
    } else {
      document.querySelector(
        "body > div.main-board > div.right-side > div.btn-container > div.btn.btn-game-start"
      ).style.display = "none";
    }
  } else {
    let confirmRes = confirm("네트워크 에러가 발생하였습니다.\n재접속합니다.");
    location.href = waitURL;
  }
};

const quitWaitRoom = async (waitURL) => {
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  let quitRes = await ajaxRequest(
    "GET",
    "http://10.210.60.80:8000/game/api/quit-wait-room",
    { kakaoId: KAKAOID, waitURL }
  );
  if (quitRes.status === 200) {
    location.href = "http://10.210.60.80:3000/plaza";
  } else {
    alert("잠시후 다시 시도하세요.");
  }
};

const requestGameStart = async (waitURL) => {
  const startRes = await ajaxRequest(
    "GET",
    "http://10.210.60.80:8000/game/api/room-to-start-status",
    { waitURL }
  );

  if (startRes.status === 200) {
    if (startRes.data.roomStatus === "playing") {
      console.log(startRes.message);
    } else {
      alert(startRes.message);
    }
  } else {
    alert("잠시후 다시 시도하세요.");
    location.href = "/plaza";
  }
};

const startChecking = async (waitURL, roomTitle) => {
  let checkingRes = await ajaxRequest(
    "GET",
    "http://10.210.60.80:8000/game/api/room-status",
    { waitURL }
  );

  if (checkingRes.status === 200) {
    if (checkingRes.data.roomStatus === "playing") {
      document.querySelector(".starting-modal").style.opacity = 1;
      let timeCount = 5;
      let startModalInterv = setInterval(() => {
        document.querySelector(".modal-room-title").innerHTML = roomTitle;
        document.querySelector(".starting-modal .time-count").innerHTML =
          timeCount;
        timeCount--;
        if (timeCount <= 0) {
          clearInterval(startModalInterv);
          enterGame(checkingRes.data.gameURL);
        }
      }, 1000);
      return true;
    }
  } else {
    alert("잠시후 다시 시도하세요.");
    location.href = "/plaza";
  }
  return false;
};

const enterGame = async (gameURL) => {
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  let entRes = await ajaxRequest(
    "GET",
    "http://10.210.60.80:8000/game/api/game-enter",
    {
      gameURL,
      kakaoId: KAKAOID,
    }
  );

  if (entRes.message === "방에 입장합니다!") {
    location.href = gameURL;
  }
};
