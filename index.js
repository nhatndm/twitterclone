const express = require('express');
const app = express();
const port = 5000;

app.use(express.static('./twitterclone_fe/build'));

app.listen(port, (err) => {
  if (err) {
    console.log(err)
  };

  console.log(`Front-end is started at port ${port}`);
})