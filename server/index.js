const express = require('express');
const path = require('path');
// const favicon = require('express-favicon');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 1000;
// const publicPath = path.join(__dirname, '..', 'public');
app.use(express.json());
app.use(cors());
app.use("/users", require('./routes/users'));
app.use("/vacations", require('./routes/vacations'));
app.use("/likes", require('./routes/likes'));

// app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`up and running on ${port}`));