const verifyModalOn = () => {
  const modal = document.querySelector(".verify-modal");
  modal.style.display = "block";
  modal.style.top = window.scrollY + "px";
  disableScroll();
};

const verifyModalOff = () => {
  document.querySelector(".verify-modal").style.display = "none";
  enableScroll();
};

const univEmailVerify = () => {
  let address = document.querySelector(".email-address").value;
  const IDTOKEN = document.querySelector("#idToken").innerHTML;
  $.ajax({
    url: "http://localhost:8000/verifyUnivAction/",
    type: "GET",
    async: false,
    data: {
      token: IDTOKEN,
      email: address,
    },
    success: function (data) {
      console.log(data);
      if (data === "success") {
        alert(`${address}로 전송된 이메일을 통해 대학 인증을 완료하세요!`);
      } else {
        alert(`인증메일 전송에 실패하였습니다\n잠시후 다시 시도하세요.`);
      }
    },
  });
};
