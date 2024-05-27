const utils = require('../utils.js');
const dbFileName = 'postsDb';
const path = require('path');
let posts = require('../postsDb.json');

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
        image: req.file ? `/uploads/${req.file.filename}` : 'https://picsum.photos/400/1200?random=4',
        image_url: `http://${req.headers.hostname}:${port}${req.file.filename}`,
        creation_date: new Date(),
        tags: arrayOfTags || [],
        slug: utils.createSlug(data.title),
        comments: []
    }
    const newData = [...existingPosts, newObject];
    const stringifiedData = JSON.stringify(newData);
    utils.writeInFile(dbFileName, 'json', stringifiedData);


    return res.redirect("/posts");

}

const show = (req, res) => {
    const slug = req.params.slug;
    res.format({
        "html": () => {
            const htmlPath = path.join(__dirname, '..', 'views', 'show.html');
            return res.type("html").sendFile(htmlPath);
        },
        "json": () => {
            const selectedPost = posts.find(p => slug === p.slug);
            if (!selectedPost) {
                return res.status(404).json({
                    success: false,
                    error: `Could not find a file with following slug: ${slug}`
                });
            }
            return res.type("json").json({ ...selectedPost, image_url: `${req.protocol}://${req.headers.host}${selectedPost.image}` });

        }
    })
};

const download = (req, res) => {
    const slug = req.params.slug;
    const selectedPost = posts.find(p => slug === p.slug);
    if (selectedPost) {
        return res.download(`${__dirname}/../public${selectedPost.image}`);
    }
    return res.status(404).send('File not found');
};

const comment = (req, res) => {
    const data = req.body;
    const slug = req.params.slug;
    const existingPosts = utils.readFile(dbFileName, 'json')
    const selectedPost = existingPosts.find(p => slug === p.slug);
    selectedPost.comments = [...selectedPost.comments, data.comment];
    const newData = [...existingPosts];
    const stringifiedData = JSON.stringify(newData);
    utils.writeInFile(dbFileName, 'json', stringifiedData);
    return res.redirect("/posts");
}

module.exports = {
    index,
    create,
    show,
    download,
    comment
}