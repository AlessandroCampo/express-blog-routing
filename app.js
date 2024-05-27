const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
const postRouter = require('./routers/postRouter.js');
const utils = require('./utils.js');


app.get('/', (req, res) => {
    const htmlContent = utils.readFile('index', 'html');
    res.send(htmlContent);
});

app.use('/posts', postRouter)

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});