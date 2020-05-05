const express = require('express');
const app = express();
const libre = require('libreoffice-convert');
const bodyParser = require('body-parser');
const port = 8080;

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: './assets/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('document');
app.set('view engine', 'ejs');
app.use(express.static('assets'));
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.get('/', (req, res) => {
    res.render('index');
})

app.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            const extend = '.pdf';
            const enterPath2 = path.join(`${__dirname}/assets/uploads`, req.file.filename);
            const outputPath = path.join(`${__dirname}/assets/convert`, `${req.file.filename}-convert${extend}`);
            const enterPath = fs.readFileSync(enterPath2);
            libre.convert(enterPath, extend, undefined, (err, done) => {
                if (err) {
                    console.log(`Error converting file: ${err}`);
                }
                fs.writeFileSync(outputPath, done);
                res.render('index', {
                    msg: 'File Berhasil diconvert!'
                });
            });
        }
    })
})

app.listen(port, () => console.log(`You started in port ${port}`));