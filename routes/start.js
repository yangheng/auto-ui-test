/**
 * Created by kukuchong on 2017/7/19.
 */
const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;
const path = require('path')
const fs = require('fs')
const config = require('../config.json')
const {getDevices} = require('../utils/tools');
const {serverBundle} = require('../utils/loader')
const reportPath = path.join(process.cwd(),config.reportPath)
var mocha
var mochaFinish= false,stdout
var reportName="";
var devices = new Map();
var loader = {
    type: '',
    files: []
}
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
function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
}
router.get('/check',(req, res, next)=>{
    res.json({mochaFinish,reportName:reportName+'.html',stdout})
})

router.get('/',(req,res,next)=>{
    res.render("start",{title:'启动案例测试'})
})
router.post('/mocha',function (req,res,next) {
    let file =serverBundle(Object.assign({},loader,{device:{platform:req.body.platform,udid:req.body.udid}}))

    if(file){
        reportName= file.split('.')[0] +"_report";
        startMocha(reportName,path.join(process.cwd(),'test',file));
        res.json({result:true});
    }else{
        res.json({result:false});
    }
})
router.post('/',(req, res, next)=>{
    loader.files = req.body.case;
    loader.type = req.body.type||"single";
    getDevices().then((devices)=>{
        //res.render("start",{title:'测试',devices:{ios:"623ef7ebc6d5e24f4a40059f82c9472ebd82f5ea"}})
        res.render("start",{title:'启动案例测试',devices:strMapToObj(devices)})
    })
 /*let tempName = Date.now()+'';
 let fileName = merge(JSON.parse(req.body.cases),tempName+'.js')
 reportName= tempName+'-'+'report'
 startMocha(reportName,fileName);
    res.json({result:true})*/
 //res.redirect("/start")
})



module.exports = router
