const createPublicRoomAction = async () => {
  const roomTitle = document.querySelector("#public-recipient-name").value;
  let maxJoin =
    parseInt(document.querySelector(".public-numOfParty").value[0]) * 2;
  const createrKakaoId = document.querySelector(".userKakaoId").innerHTML;

  let createRoomRes = await ajaxRequest(
    "GET",
    "http://10.210.60.80:8000/game/api/create-room-public",
    { roomTitle, maxJoin, createrKakaoId }
  );
  if (createRoomRes["status"] === 200) {
    enterWaitRoom(createRoomRes["url"]);
  } else {
    alert("방 생성에 실패하였습니다.");
  }
};

const updatePublicList = async () => {
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  let univName = "";
  let userName = "";
  let userEmail = "";
  let userResponse = await ajaxRequest(
    "GET",
    "http://10.210.60.80:8000/api/user-by-kakaoid",
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
    "http://10.210.60.80:8000/game/api/public-room-list",
    { kakaoId: KAKAOID, univName: univName }
  );
  let roomList;
  if (publicRoomRes) {
    roomList = publicRoomRes.message.data;
  } else {
    alert("다시 시도하세요.");
    location.href = "/plaza";
  }

  if (roomList.length === 0) {
    document.querySelector(".room-list").innerHTML =
      "<div class='no-room'>입장 가능한 방이 없습니다.<br>잠시후 다시 시도하세요!</div>";
  } else {
    document.querySelector(".room-list").innerHTML = "";
  }
  for (let i = 0; i < roomList.length; i++) {
    let room = roomList[i];
    let htmlContent = `
      <div class="public-room-elem" onclick="enterWaitRoom('${
        room.waitingURL
      }')">
        <div class="public-room-title">${room.title}</div>
        <div class="public-room-body">
          <div class="public-room-info">${
            room.opponentUniv === ""
              ? `${room.homeUniv} 대기중..`
              : `${room.homeUniv} VS ${room.opponentUniv}`
          }</div>
          <div class="public-room-player-num">참가인원: [${room.currJoin} / ${
      room.maxJoin
    }]</div>
        </div>
      </div>
    `;
    document.querySelector(".room-list").innerHTML += htmlContent;
  }
};

const enterWaitRoom = async (waitingURL) => {
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  let enterWaitingRes = await ajaxRequest(
    "GET",
    "http://10.210.60.80:8000/game/api/enter-wait-room",
    {
      kakaoId: KAKAOID,
      waitingURL,
    }
  );
  if (enterWaitingRes["status"] === 200) {
    location.href = waitingURL;
  } else {
    alert(`${enterWaitingRes["message"]}`);
  }
};
