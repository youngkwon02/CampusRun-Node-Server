window.onload = () => {
  const currentURL = window.location.href;
  entranceArrangement(currentURL);
  const quitBtn = document.querySelector(".btn-quit");
  quitBtn.addEventListener("click", () => {
    quitWaitRoom(currentURL);
  });
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

window.onunload = () => {
  const URL = window.location.href;
  quitWaitRoom(URL);
};
