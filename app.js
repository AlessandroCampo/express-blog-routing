const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
const multer = require('multer');
const port = process.env.PORT || 3000;
const post_cotroller = require('./controllers/posts.js')
const utils = require('./utils.js')


const upload = multer({ storage: utils.storage });



app.get('/', (req, res) => {
    const htmlContent = utils.readFile('index', 'html');
    res.send(htmlContent);
});

app.get('/posts', post_cotroller.index);
app.post('/posts', upload.single('image'), post_cotroller.create);

app.listen(port, () => {
    console.log('Server running on port ' + port);
});