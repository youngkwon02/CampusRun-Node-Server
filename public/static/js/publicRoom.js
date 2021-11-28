const createPublicRoomAction = async () => {
  const roomTitle = document.querySelector("#public-recipient-name").value;
  let maxJoin =
    parseInt(document.querySelector(".public-numOfParty").value[0]) * 2;
  const createrKakaoId = document.querySelector(".userKakaoId").innerHTML;

  let createRoomRes = await ajaxRequest(
    "GET",
    "http://localhost:8000/game/api/create-room-public",
    { roomTitle, maxJoin, createrKakaoId }
  );
  if (createRoomRes["status"] !== 200) {
    alert("방 생성에 실패하였습니다.");
  } else {
    alert("성공적으로 방을 생성하였습니다.");
  }
};

const updatePublicList = async () => {
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  let univName = "";
  let userName = "";
  let userEmail = "";
  let userResponse = await ajaxRequest(
    "GET",
    "http://localhost:8000/api/user-by-kakaoid",
    { kakaoId: KAKAOID }
  );
  if (userResponse) {
    data = userResponse.message.data[0];
    univName = data["univ_name"];
    userName = data["name"];
    userEmail = data["email"];
  } else {
    alert("다시 시도하세요.");
    location.href = "/plaza";
  }
  if (univName === "") {
    alert(
      "대학교 인증을 하지 않은 사용자는 초대를 받아야만 게임에 참여 가능합니다!\n"
    );
    location.href = "/plaza";
  }

  let publicRoomRes = await ajaxRequest(
    "GET",
    "http://localhost:8000/game/api/public-room-list",
    { kakaoId: KAKAOID, univName: univName }
  );
  let roomList;
  if (publicRoomRes) {
    roomList = publicRoomRes.message.data;
  } else {
    alert("다시 시도하세요.");
    location.href = "/plaza";
  }
  console.log(roomList);
};
