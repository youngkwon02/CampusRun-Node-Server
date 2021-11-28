window.onload = () => {
  const currentURL = window.location.href;
  const quitBtn = document.querySelector(".btn-quit");
  quitBtn.addEventListener("click", () => {
    quitWaitRoom(currentURL);
  });
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
