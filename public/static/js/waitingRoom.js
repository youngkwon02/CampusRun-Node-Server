window.onload = () => {
  const currentURL = window.location.href;
  entranceArrangement(currentURL);
  syncData(currentURL);
  setInterval(() => {
    syncData(currentURL);
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
    "http://localhost:8000/game/api/ent-arrangement",
    { kakaoId: KAKAOID, waitURL }
  );
  if (arranRes.status === 200) {
    console.log(arranRes.message);
  } else {
    location.href = "http://localhost:3000/plaza";
  }
};

const syncData = async (waitURL) => {
  let currentIdList = "";
  currentIdList = document.querySelector(".idList").innerHTML;

  let syncRes = await ajaxRequest(
    "GET",
    "http://localhost:8000/game/api/sync-wait-room-status",
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

    console.log(syncRes.message);
  } else if (
    syncRes.status === 200 &&
    syncRes.message === "Nothing to sync.."
  ) {
  } else {
    let confirmRes = confirm("네트워크 에러가 발생하였습니다.\n재접속합니다.");
    location.href = waitURL;
  }
};

const quitWaitRoom = async (waitURL) => {
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  let quitRes = await ajaxRequest(
    "GET",
    "http://localhost:8000/game/api/quit-wait-room",
    { kakaoId: KAKAOID, waitURL }
  );
  if (quitRes.status === 200) {
    location.href = "http://localhost:3000/plaza";
  } else {
    alert("잠시후 다시 시도하세요.");
  }
};
