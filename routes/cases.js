/**
 * Created by kukuchong on 2017/7/20.
 */

const express = require('express');
const router = express.Router();
const path = require('path')
const fs = require('fs')
const config = require('../config.json')
/* GET home page. */
router.get('/', function(req, res, next) {
    let dirs =fs.readdirSync(path.join(process.cwd(),config.reportPath))
    let files = dirs.filter(file=>(/.+\.html$/.test(file)))
    console.log(files)
    res.render('case', { title: '测试报告归档' ,path:config.reportPath, files });

});

module.exports = router;
