const express = require("express");
const router = express.Router();
const app = express();

router.get("/kakaoLogin", (req, res) => {
  console.log(req.query.idToken);
  res.cookie('idToken', req.query.idToken);
  res.cookie('hasVisited', '1', {
    maxAge: 60*60*1000,
    httpOnly: true,
    path:'/'
  });
  console.log(req.cookies);
  res.send();
});


module.exports = router;