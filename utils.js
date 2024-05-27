const path = require('path');
const fs = require('fs');
const multer = require('multer');
let posts = require('./postsDb.json')



const readFile = (fileName, extension) => {
    const namePlusExtension = fileName + '.' + extension
    const filePath = extension == 'html' ? path.join(__dirname, 'views', namePlusExtension) : path.join(__dirname, namePlusExtension);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (extension == 'json') return JSON.parse(fileContent);
    return fileContent
};

const getPath = (fileName) => {
    return path.join(__dirname, fileName)
}

const writeInFile = function (fileName, extension, data) {
    const filePath = path.join(__dirname, fileName + '.' + extension);
    fs.writeFileSync(filePath, data);
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/assets');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const createSlug = (title) => {
    currentPosts = JSON.parse(fs.readFileSync(__dirname + '/postsDb.json'))
    const postSlugs = currentPosts.map(p => p.slug);
    console.log(postSlugs)
    let baseSlug = title ? title.replaceAll(' ', '-').toLowerCase() : 'no-title-post';
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (postSlugs.includes(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}






module.exports = {
    readFile,
    getPath,
    writeInFile,
    storage,
    createSlug,
}
