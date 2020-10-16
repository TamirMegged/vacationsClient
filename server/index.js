const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 1000;
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.use(express.json());
app.use(cors());
app.use("/users", require('./routes/users'));
app.use("/vacations", require('./routes/vacations'));
app.use("/likes", require('./routes/likes'));

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
 });

app.listen(port, () => console.log(`up and running on ${port}`));