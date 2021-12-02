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
        reject(new Error("err"));
      },
    });
  });
};

const speedyRanking = async () => {
  let res = await ajaxRequest(
    "GET",
    "http://3.35.114.72:8000/feed/api/speedy-ranking/2",
    { nothing: "" }
  );
  let speedyRanking = res["ranking_data"];
  for (let i = 0; i < speedyRanking.length; i++) {
    elem = speedyRanking[i];
    console.log(`${elem["rank"]} / ${elem["univ"]}  / ${elem["player"]} `);
    if (elem.player === null) {
      elem.player = "익명";
    }
    let row = `<div class=`;
  }
};
