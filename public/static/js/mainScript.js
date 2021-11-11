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
  if (window.scrollY > 50) {
    nav.style.backgroundColor = "rgba(255, 255, 255, .45)";
    for (let i = 0; i < navElem.length; i++) {
      navElem[i].style.color = "#101010";
    }
  } else {
    nav.style.backgroundColor = "rgba(0, 0, 0, 85)";
    for (let i = 0; i < navElem.length; i++) {
      navElem[i].style.color = "#efefef";
    }
  }
};

window.onload = () => {
  applyNavColor();
  window.addEventListener("scroll", function (e) {
    applyNavColor();
  });
};
