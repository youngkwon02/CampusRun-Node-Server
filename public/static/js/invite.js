window.onload = async () => {
  // User-search Keyup Ajax request
  document.addEventListener("keydown", KeyCheck); //or however you are calling your method
  document
    .querySelector(".user-search")
    .addEventListener("keyup", async function (e) {
      let text = document.querySelector(".user-search").value;
      let resultBoard = document.querySelector(".user-search-result");
      let result = await ajaxRequest(
        "GET",
        "http://localhost:8000/api/user-search",
        { keyword: text }
      );
      if (result) {
        dataList = result.message.data;
        resultBoard.innerHTML = "";

        if (dataList.length === 0) {
          htmlData = `<div class="search-result-row">일치하는 사용자를 찾을 수 없습니다.</div>`;
          resultBoard.innerHTML = resultBoard.innerHTML + htmlData;
        }
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i]["name"] == "") {
            dataList[i]["name"] = "비공개";
          }
          if (!dataList[i]["univ_name"]) {
            dataList[i]["univ_name"] = "대학교 미인증";
          }
          if (dataList[i]["email"] == "") {
            dataList[i]["email"] = "비공개";
          }
          htmlData = `<div class="search-result-row">
            <div>이름 : ${dataList[i]["name"]}</div>
            <div>소속 : ${dataList[i]["univ_name"]}</div>
            <div>이메일 : ${dataList[i]["email"]}</div>
            <div class="add-user-entry" onclick="addUserEntry(${dataList[i]["kakao_id"]})">추가하기</div>
          </div>`;
          resultBoard.innerHTML = resultBoard.innerHTML + htmlData;
        }
      } else {
        alert("다시 시도하세요.");
        location.href = "/plaza";
      }
    });

  // Home-Entry univ name set
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  let univName = document.querySelector(".userUniv").innerHTML;
  let userName = document.querySelector(".userName").innerHTML;
  let userEmail = document.querySelector(".userEmail").innerHTML;
  if (univName === "") {
    document.querySelector(".room-create-action").style.display = "none";
    document.querySelector(
      ".modal-body-tail"
    ).innerHTML = `<div class="modal-notice">대학 인증을 완료한 후 방을 생성할 수 있습니다!</div>`;
  } else {
    document.querySelector(".home-entry .entry-univ-span").innerHTML = univName;
    addUserEntry(KAKAOID);
  }
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

const addUserEntry = async (kakaoId) => {
  let ownerUniv = document.querySelector(".userUniv").innerHTML;

  let univName = "";
  let userName = "";
  let userEmail = "";
  let userResponse = await ajaxRequest(
    "GET",
    "http://localhost:8000/api/user-by-kakaoid",
    { kakaoId: kakaoId }
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
  if (univName !== ownerUniv) {
    // Away
    if (univName === null) {
      univName = "미소속";
    }
    let modifyAway = false;
    let currentAway = document.querySelector(
      ".away-entry .entry-univ .entry-univ-span"
    ).innerHTML;
    if (univName === "미소속") {
      // 용병
      document.querySelector(
        ".away-entry-body"
      ).innerHTML += `<div class="entry-body-row">[${univName}] ${userName}</div>`;
    } else if (currentAway !== "" && currentAway !== univName) {
      // 상대학교 변경
      modifyAway = confirm("상대 대학을 재설정하시겠습니까?");
    } else if (currentAway === univName) {
      // 기존 상대학교 멤버 추가
      document.querySelector(
        ".away-entry-body"
      ).innerHTML += `<div class="entry-body-row">[${univName}] ${userName}</div>`;
    } else if (currentAway === "") {
      // initial away select
      document.querySelector(
        ".away-entry .entry-univ .entry-univ-span"
      ).innerHTML = univName;
      document.querySelector(".away-entry-body").innerHTML = "";
      document.querySelector(
        ".away-entry-body"
      ).innerHTML += `<div class="entry-body-row">[${univName}] ${userName}</div>`;
    }
    if (modifyAway) {
      document.querySelector(
        ".away-entry .entry-univ .entry-univ-span"
      ).innerHTML = univName;
      document.querySelector(".away-entry-body").innerHTML = "";
      document.querySelector(
        ".away-entry-body"
      ).innerHTML += `<div class="entry-body-row">[${univName}] ${userName}</div>`;
    }
  } else {
    document.querySelector(
      ".home-entry-body"
    ).innerHTML += `<div class="entry-body-row">[${univName}] ${userName}</div>`;
  }
};

function KeyCheck(event) {
  var KeyID = event.keyCode;
  switch (KeyID) {
    case 8:
      document.querySelector(".user-search").value = "";
      break;
    case 46:
      document.querySelector(".user-search").value = "";
      break;
    default:
      break;
  }
}
