const express = require('express');
const router = express.Router();
const fileData = require('../config.json')
const caseFile = require('../fileReader')
/* GET home page. */
router.get('/', function(req, res, next) {
  caseFile.getCase().then((data)=>{
    console.log(data)
    res.render('index', { title: 'nima' , files: fileData.file ,code: data });
  })

});

module.exports = router;
