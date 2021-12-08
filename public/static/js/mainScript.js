const drawSection1 = () => {
  const mainImg = document.querySelector("#first-img");
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  var canvas = document.querySelector("#my-canvas-01");
  canvas.width = WIDTH;
  canvas.height = HEIGHT - 80;
  var ctx = canvas.getContext("2d"); // 변수선언

  var tempCanvas = document.createElement("canvas"),
    tCtx = tempCanvas.getContext("2d");
  tempCanvas.width = WIDTH;
  tempCanvas.height = HEIGHT;
  tCtx.drawImage(
    mainImg,
    0,
    0,
    mainImg.width,
    mainImg.height,
    0,
    0,
    WIDTH,
    HEIGHT
  );

  ctx.beginPath(); //스따뚜
  ctx.moveTo(0, 0); //x,y좌표 각각 0에서 출발. 단위는 픽셀
  ctx.lineTo(0, HEIGHT - 280);
  ctx.lineTo(WIDTH / 2, HEIGHT - 120);
  ctx.lineTo(WIDTH, HEIGHT - 280);
  ctx.lineTo(WIDTH, 0);

  ctx.closePath(); //출발지점으로 마지막 직선을 그림

  var mainPattern = ctx.createPattern(tempCanvas, "no-repeat");
  ctx.fillStyle = mainPattern;
  ctx.fill();
};

const drawSection3 = () => {
  const mainImg = document.querySelector("#third-img");
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight + 270;
  var canvas = document.querySelector("#my-canvas-03");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  var ctx = canvas.getContext("2d"); // 변수선언

  var tempCanvas = document.createElement("canvas"),
    tCtx = tempCanvas.getContext("2d");
  tempCanvas.width = WIDTH;
  tempCanvas.height = HEIGHT;
  tCtx.drawImage(
    mainImg,
    0,
    0,
    mainImg.width,
    mainImg.height,
    0,
    0,
    WIDTH,
    HEIGHT
  );

  ctx.beginPath(); //스따뚜
  ctx.moveTo(WIDTH, 100); //x,y좌표 각각 0에서 출발. 단위는 픽셀
  ctx.lineTo(0, HEIGHT / 4);
  ctx.lineTo(0, (3 * HEIGHT) / 4);
  ctx.lineTo(WIDTH, HEIGHT - 100); //x값 60지점을 향해 직선으로 선을 그음
  ctx.lineTo(WIDTH, 0); //x값 60지점을 향해 직선으로 선을 그음

  ctx.closePath(); //출발지점으로 마지막 직선을 그림

  var mainPattern = ctx.createPattern(tempCanvas, "no-repeat");
  ctx.fillStyle = mainPattern;
  ctx.fill();
};

const bodyRearrange = () => {
  const BODY = document.querySelector("body");
  const VH = window.innerHeight;
  let newHeight = BODY.offsetHeight - 2 * VH;
  BODY.style.height = newHeight + "px";
};

const applyNavColor = () => {
  const nav = document.querySelector("nav");
  const navElem = document.querySelectorAll("nav *");
  const invitationBoard = document.querySelector(".invitation-board");
  if (window.scrollY > 50) {
    nav.style.backgroundColor = "rgba(255, 255, 255, .45)";
    invitationBoard.style.backgroundColor = "rgba(255, 255, 255, .45)";
    invitationBoard.style.color = "#101010";
    for (let i = 0; i < navElem.length; i++) {
      navElem[i].style.color = "#101010";
      document.querySelector("#nav-title").style.backgroundImage =
        'url("../Assets/image/logo-long-black.png")';
    }
  } else {
    nav.style.backgroundColor = "rgba(0, 0, 0, 85)";
    invitationBoard.style.backgroundColor = "rgba(0, 0, 0, 85)";
    invitationBoard.style.color = "#efefef";
    for (let i = 0; i < navElem.length; i++) {
      navElem[i].style.color = "#efefef";
      document.querySelector("#nav-title").style.backgroundImage =
        'url("../Assets/image/logo-long-white.png")';
    }
  }
};

const timeoutSec01 = (t) => {
  setTimeout(() => {
    drawSection1();
  }, t);
};

const timeoutSec03 = (t) => {
  setTimeout(() => {
    drawSection3();
  }, t);
};

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

const invitationToggle = () => {
  const invBoard = document.querySelector(".invitation-board");
  if (invBoard.style.display === "none" || invBoard.style.display === "") {
    invBoard.style.display = "block";
    return true;
  }
  invBoard.style.display = "none";
  return true;
};

const applyInvitationAnimation = () => {
  document.querySelector(".invitation").style.animationName = "rainbow";
};

const acceptInvitation = async (invId, url) => {
  let kakaoId = document.querySelector(".KAKAOID").innerHTML;
  let roomUrl = url;
  await ajaxRequest("GET", "http://localhost:8000/game/api/room-enter", {
    roomUrl,
    kakaoId,
  });
  let res = await ajaxRequest(
    "GET",
    "http://localhost:8000/game/api/invitation-read",
    { invId: invId }
  );
  location.href = url;
};

const rejectInvitation = async (invId) => {
  let res = await ajaxRequest(
    "GET",
    "http://localhost:8000/game/api/invitation-reject",
    { invId: invId }
  );
  if (res.status !== 200)
    alert("초대 거절에 실패하였습니다\n잠시후 다시 시도하세요.");
  else alert("초대를 거절하였습니다.");
};

const invitationManager = async (kakaoId) => {
  const invBoard = document.querySelector(".invitation-board");
  let res = await ajaxRequest(
    "GET",
    "http://localhost:8000/game/api/invitation-by-id",
    { kakaoId: kakaoId }
  );
  let isThereNew = false;
  let invList = res.data;
  for (let i = 0; i < invList.length; i++) {
    let inv = invList[i];
    if (!inv.isRead && !isThereNew) {
      applyInvitationAnimation();
      isThereNew = true;
    }
    if (inv.creater === null) {
      inv.creater = "익명의 사용자";
    }
    let row = `<div class="invitation-row">
      <div class="inv-univ">${inv.homeUniv}(Home) vs ${inv.awayUniv}(Away) [ ${
      inv.maxJoin / 2
    }:${inv.maxJoin / 2} ]</div>
      <div class="inv-title">방 제목: ${
        inv.title === "" ? "제목 없음" : inv.title
      }</div>
      <div class="inv-content">${
        inv.creater
      }님이 귀하에게 초대장을 전송하였습니다.</div>
      <div class="inv-selection"><a href="javascript:acceptInvitation(${
        inv.invId
      },'${inv.url}')">수락</a> | <a href="javascript:rejectInvitation(${
      inv.invId
    })">거절</a></div>
    </div>`;
    invBoard.innerHTML += row;
  }
};

const nicknameCreate = async (kakaoId) => {
  const nickname = document.getElementById("nickname").value;
  isSuccess = false;
  let createNickName = await ajaxRequest(
    "GET",
    "http://localhost:8000/api/create-nickname",
    { kakaoId: kakaoId, nickname }
  );
  if (createNickName.status === 200) {
    if (createNickName["data"]["nicknamestatus"] === "none") {
      isSuccess = true;
      $();
      $("#nicknameModal").hide();
    }
    if (
      createNickName["data"]["nicknamestatus"] === "exist" ||
      createNickName["data"]["nicknamestatus"] === "condition"
    ) {
      console.log(createNickName["message"]);
      const errorMessage = document.querySelector(".errorMessage");
      errorMessage.innerText = createNickName["message"];
    }
  }
};

const nicknameCheck = async (kakaoId) => {
  console.log("닉네임 확인");
  let verifyNickName = await ajaxRequest(
    "GET",
    "http://localhost:8000/api/check-nickname",
    { kakaoId }
  );
  isExist = verifyNickName["data"]["nicknamestatus"];
  if (verifyNickName["status"] === 200) {
    if (isExist === "none") {
      // 없으면 모달 띄움
      document.getElementById("nicknameModal").style.display = "block";
      const saveBtn = document.querySelector(".save-btn");
      saveBtn.addEventListener("click", () => {
        nicknameCreate(kakaoId);
      });
    } else {
      // 있으면 모달 안띄움
      document.getElementById("nicknameModal").style.display = "none";
    }
  } else {
    alert("잘못된 데이터를 입력하셨습니다.");
  }
};

window.onload = () => {
  const KAKAOID = document.querySelector(".KAKAOID").innerHTML;
  nicknameCheck(KAKAOID);
  timeoutSec01(100);
  timeoutSec03(10);
  bodyRearrange();
  applyNavColor();
  window.addEventListener("scroll", function (e) {
    applyNavColor();
  });

  verifyBtnAct();
  invitationManager(KAKAOID);
};
