/**
 * Created by kukuchong on 2017/7/20.
 */
const fs = require('fs')
const path = require('path')
const config = require('../config.json')

module.exports = function (cases,platformName='case',fileName) {

    console.log(JSON.stringify(cases))
    let text="" ;
    try{
       /* text = fs.readFileSync(path.join(process.cwd(),config.caseHooks.dir,config.caseHooks[platformName]),'utf8')*/
        if(Array.isArray(cases)){
            cases.forEach((filePath)=>{
                text = text + fs.readFileSync(filePath,'utf8');
            })
        }else {
            text = text + fs.readFileSync(cases,'utf8');
        }

        //text = text + '});';

        let tempCaseFile = path.join(process.cwd(),config.tempCasePath,fileName)

        fs.writeFileSync(tempCaseFile,text);

        return tempCaseFile;

    }catch (err){
        throw err
    }

}