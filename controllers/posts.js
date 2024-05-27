const utils = require('../utils.js');
const dbFileName = 'postsDb'

const index = (req, res) => {
    res.format({
        "html": () => {
            const htmlContent = utils.readFile('posts', 'html');
            // const htmlPath = utils.getPath('index.html');
            return res.type("html").send(htmlContent);
            // return res.type("json").send(utils.readFile(dbFileName, 'json'));
        },
        "json": () => {
            return res.type("json").send(utils.readFile(dbFileName, 'json'));
        }
    })
}

const create = (req, res) => {
    const data = req.body;
    const existingPosts = utils.readFile(dbFileName, 'json')

    const arrayOfTags = data.content.split(" ").reduce((acc, word) => {
        if (word.startsWith('#')) {
            return [...acc, word.slice(1)];
        }
        return acc;
    }, []);
    const newObject = {
        title: data.title || 'No title for this post',
        author: data.author || 'Author of this post is unkown',
        content: data.content || '',
        image: req.file ? `/uploads/${req.file.filename}` : 'https://picsum.photos/200/300?random=4',
        creation_date: new Date(),
        tags: arrayOfTags || []
    }
    const newData = [...existingPosts, newObject];
    const stringifiedData = JSON.stringify(newData);
    utils.writeInFile(dbFileName, 'json', stringifiedData);


    return res.redirect("/posts");

}

module.exports = {
    index,
    create
}