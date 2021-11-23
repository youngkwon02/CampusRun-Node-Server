window.onload = () => {
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

const addUserEntry = (kakaoId) => {
  alert(kakaoId);
};
