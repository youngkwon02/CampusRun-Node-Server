const drawSection1 = () => {
  const mainImg = document.querySelector("#first-img");
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  var canvas = document.querySelector("#my-canvas-01");
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
  ctx.moveTo(0, 0); //x,y좌표 각각 0에서 출발. 단위는 픽셀
  ctx.lineTo(0, HEIGHT - 200);
  ctx.lineTo(WIDTH / 2, HEIGHT - 40);
  ctx.lineTo(WIDTH, HEIGHT - 200);
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
  ctx.moveTo(WIDTH, 0); //x,y좌표 각각 0에서 출발. 단위는 픽셀
  ctx.lineTo(0, HEIGHT / 5);
  ctx.lineTo(0, (4 * HEIGHT) / 5);
  ctx.lineTo(WIDTH, HEIGHT); //x값 60지점을 향해 직선으로 선을 그음
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
