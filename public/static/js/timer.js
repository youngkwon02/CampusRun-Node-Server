const millisToMinutesAndSeconds = (millis) => {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  let remain = String((millis % 1000).toFixed(0));
  if (remain.length === 0 || remain.length === 1) {
    remain = "00";
  }
  remain = remain[0] + remain[1];
  return minutes + "분" + (seconds < 10 ? "0" : "") + seconds + "초" + remain;
};

const timer = () => {
  let time = 0;
  let timerInterv = setInterval(() => {
    time += 10;
    console.log(`${millisToMinutesAndSeconds(time)} `);
  }, 10);
  return timerInterv;
};
