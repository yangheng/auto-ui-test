const express = require('express');
const router = express.Router();
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const file = require('../utils/fileReader')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+'-'+file.originalname)
    }
})
const upload = multer({storage})
/* GET home page. */
router.get('/', function(req, res, next) {
    
    res.render('add', { title: '新增案例'});

});


router.post('/',upload.array('case'), function (req, res, next) {

    file.getFile(path.join(process.cwd(),'db.json')).then((data)=>{
        let database = JSON.parse(data);
        req.files.map((item)=>{
            database.push({
                name: req.body.name,
                project_url: req.body.project_url,
                filePath: path.join(process.cwd(),'uploads',item.filename) 
            })
        })
        fs.writeFile(path.join(process.cwd(),'db.json'),JSON.stringify(database),(err)=>{
            if(err) throw err;
            res.set("Refresh","1;url=/")
            res.render('success')
        })
    })


    


})

module.exports = router;
