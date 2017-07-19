/**
 * Created by kukuchong on 2017/7/18.
 */
var fs = require('fs')
var path = require('path')
var casePath = require('./config.json').casePath

exports.getCase = function () {
    return new Promise((resolve,reject)=>{
        fs.readFile(path.join(__dirname,casePath,'ios-yiewd.js'),'utf8',(err, data)=>{
            if(err){
                throw err
            }else{
                resolve(data)
            }

        })
    })

}