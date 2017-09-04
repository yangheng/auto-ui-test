/**
 * Created by kukuchong on 2017/9/2.
 */
const express = require('express');
const router = express.Router();
const {writeDevices} = require('../utils/fileReader')
router.get('/',function(req, res, next){
    let devices = require('../utils/devices.json');
    console.log(devices.ios)
    res.render('devices',{title: '设备管理',android:devices.android,ios:devices.ios})
})
router.post('/',function (req, res, next) {
    debugger;
    let devices = require('../utils/devices.json');
    console.log(JSON.stringify(req.body))
    devices[req.body.platform][req.body.udid]={
        "platformVersion": req.body.platformVersion,
        "deviceName": req.body.deviceName,
        "udid":req.body.udid,
    }
    writeDevices(JSON.stringify(devices));
    res.redirect('/devices');
})
module.exports = router;