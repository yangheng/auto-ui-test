/**
 * Created by kukuchong on 2017/7/19.
 */
const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;
const path = require('path')
const fs = require('fs')
const config = require('../config.json')
const merge = require('../utils/merge')
const reportPath = path.join(process.cwd(),config.reportPath)
var mocha
var mochaFinish= false,stdout
var reportName=""
function startMocha (reportName,fileName){
    mochaFinish= false;
    stdout = null;
    mocha = spawn('mocha', ['--harmony','-R', 'mochawesome','--reporter-options',"reportDir="+reportPath+",reportFilename="+reportName,fileName]);

    mocha.stdout.on('data', (data) => {
      console.log(data.toString())
     stdout = (stdout || "")+data
     });
    mocha.stderr.on('data', (data) => {
     console.error(data.toString());
     });
    mocha.on('exit',(code)=>{
        mochaFinish= true;
        fs.unlink(fileName)
     })
    
}

router.get('/check',(req, res, next)=>{
    res.json({mochaFinish,reportName:reportName+'.html',stdout})
})

router.get('/',(req,res,next)=>{
    res.render("start",{title:'启动案例测试'})
})

router.post('/',(req, res, next)=>{
 let tempName = Date.now()+'';
 let fileName = merge(JSON.parse(req.body.cases),tempName+'.js')
 reportName= tempName+'-'+'report'
 startMocha(reportName,fileName)
    res.json({result:true})
 //res.redirect("/start")
})



module.exports = router
