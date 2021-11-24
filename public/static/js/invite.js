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
          if (isAlreadyAdd(dataList[i]["kakao_id"])) continue;
          if (dataList[i]["name"] == "") {
            dataList[i]["name"] = "비공개";
          }
          if (!dataList[i]["univ_name"]) {
            dataList[i]["univ_name"] = "대학교 미인증";
          }
          if (dataList[i]["email"] == "") {
            dataList[i]["email"] = "비공개";
          }
          htmlData = `<div class="search-result-row search-result-row-${dataList[i]["kakao_id"]}">
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
    document.querySelector(`.entry-body-row-${KAKAOID}`).style.cursor =
      "auto !important";
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
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
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
    // Away Add
    if (!isAwayAddPossible()) {
      alert(
        "Away Univ 명단에 여석이 없습니다.\n참가 인원을 변경하거나, 명단의 이름을 클릭하여 삭제하세요 !"
      );
      return;
    }
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
      ).innerHTML += `<div class="entry-body-row entry-body-row-${kakaoId}" onclick="popUserEntry(${kakaoId})">[${univName}] ${userName}</div>`;
    } else if (currentAway !== "" && currentAway !== univName) {
      // 상대학교 변경
      modifyAway = confirm("상대 대학을 재설정하시겠습니까?");
    } else if (currentAway === univName) {
      // 기존 상대학교 멤버 추가
      document.querySelector(
        ".away-entry-body"
      ).innerHTML += `<div class="entry-body-row entry-body-row-${kakaoId}" onclick="popUserEntry(${kakaoId})">[${univName}] ${userName}</div>`;
    } else if (currentAway === "") {
      // initial away select
      document.querySelector(
        ".away-entry .entry-univ .entry-univ-span"
      ).innerHTML = univName;
      document.querySelector(".away-entry-body").innerHTML = "";
      document.querySelector(
        ".away-entry-body"
      ).innerHTML += `<div class="entry-body-row entry-body-row-${kakaoId}" onclick="popUserEntry(${kakaoId})">[${univName}] ${userName}</div>`;
    }
    if (modifyAway) {
      document.querySelector(
        ".away-entry .entry-univ .entry-univ-span"
      ).innerHTML = univName;
      document.querySelector(".away-entry-body").innerHTML = "";
      document.querySelector(
        ".away-entry-body"
      ).innerHTML += `<div class="entry-body-row entry-body-row-${kakaoId}" onclick="popUserEntry(${kakaoId})">[${univName}] ${userName}</div>`;
    }
  } else {
    // Home Add
    if (!isHomeAddPossible()) {
      alert(
        "Home Univ 명단에 여석이 없습니다.\n참가 인원을 변경하거나, 명단의 이름을 클릭하여 삭제하세요 !"
      );
      return;
    }
    document.querySelector(
      ".home-entry-body"
    ).innerHTML += `<div class="entry-body-row entry-body-row-${kakaoId}" onclick="popUserEntry(${kakaoId})">[${univName}] ${userName}</div>`;
  }

  if (KAKAOID !== kakaoId) {
    // 추가하기 버튼 눌렀을 때, 검색 결과에서 삭제
    document.querySelector(`.search-result-row-${kakaoId}`).style.display =
      "none";
  }
};

const popUserEntry = (kakaoId) => {
  const KAKAOID = document.querySelector(".userKakaoId").innerHTML;
  if (parseInt(kakaoId) === parseInt(KAKAOID)) {
    return false;
  }
  let className = "entry-body-row-" + kakaoId;

  // Home team check
  let homeRows = document.querySelectorAll(".home-entry-body .entry-body-row");
  let htmlContent = "";
  for (let i = 0; i < homeRows.length; i++) {
    if (!homeRows[i].className.includes(className)) {
      htmlContent += homeRows[i].outerHTML;
    }
  }
  document.querySelector(".home-entry-body").innerHTML = htmlContent;

  // Away team check
  let awayRows = document.querySelectorAll(".away-entry-body .entry-body-row");
  htmlContent = "";
  for (let i = 0; i < awayRows.length; i++) {
    if (!awayRows[i].className.includes(className)) {
      htmlContent += awayRows[i].outerHTML;
    }
  }
  document.querySelector(".away-entry-body").innerHTML = htmlContent;

  if (htmlContent === "") {
    document.querySelector(".away-entry .entry-univ-span").innerHTML = "";
  }

  document.querySelector(".user-search").value = "";
  document.querySelector(".user-search-result").innerHTML = "";
};

const isAlreadyAdd = (kakaoId) => {
  let className = "entry-body-row-" + kakaoId;
  // Home team check
  let homeRows = document.querySelectorAll(".home-entry-body .entry-body-row");
  let htmlContent = "";
  for (let i = 0; i < homeRows.length; i++) {
    if (homeRows[i].className.includes(className)) {
      return true;
    }
  }
  // Away team check
  let awayRows = document.querySelectorAll(".away-entry-body .entry-body-row");
  for (let i = 0; i < awayRows.length; i++) {
    if (awayRows[i].className.includes(className)) {
      return true;
    }
  }
  return false;
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

const getNumberOfParty = () => {
  let mode = document.querySelector(".numOfParty").value;
  return parseInt(mode[0]);
};

const getNumberOfHome = () => {
  let homeRows = document.querySelectorAll(".home-entry-body .entry-body-row");
  return homeRows.length;
};

const getNumberOfAway = () => {
  let awayRows = document.querySelectorAll(".away-entry-body .entry-body-row");
  return awayRows.length;
};

const isHomeAddPossible = () => {
  let numOfParty = getNumberOfParty();
  let currentHome = getNumberOfHome();
  console.log(`HomeAddPossibleFunc: ${currentHome} / ${numOfParty}`);
  if (currentHome + 1 <= numOfParty) {
    return true;
  }
  return false;
};

const isAwayAddPossible = () => {
  let numOfParty = getNumberOfParty();
  let currentAway = getNumberOfAway();
  console.log(`AwayeAddPossibleFunc: ${currentAway} / ${numOfParty}`);
  if (currentAway + 1 <= numOfParty) {
    return true;
  }
  return false;
};
