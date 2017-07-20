const express = require('express');
const router = express.Router();
const caseFile = require('../utils/fileReader')
/* GET home page. */
router.get('/', function(req, res, next) {
  let files = caseFile.getCase().then(files=>{
    res.render('index', { title: '自动化测试平台' , files });
  })
});

module.exports = router;
