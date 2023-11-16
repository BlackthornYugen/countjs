const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  let params = { title: "Websocket Counter" };

  if (req.headers["host"].startsWith("trick")) {
    params.title = "Trick or Treater Counter"
    params.subdomain = "trick"
  }

  res.render('index', params);
});

module.exports = router;
