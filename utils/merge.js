/**
 * Created by kukuchong on 2017/7/20.
 */
const fs = require('fs')
const path = require('path')
const config = require('../config.json')

module.exports = function (cases,fileName) {
    let platform = cases[0].platform, type = cases[0].type,text="";
    let caseAddress = {
        platform,
        cases

    }
    try{
        text = fs.readFileSync(path.join(process.cwd(),config.caseHooks.dir,config.caseHooks[type]),'utf8')
        if(Array.isArray(cases)){
            cases.forEach((c)=>{
                text = text + fs.readFileSync(c.filePath,'utf8');
            })
        }else {
            text = text + fs.readFileSync(cases.filePath,'utf8');
        }

        text = text + '});';

        let tempCaseFile = path.join(process.cwd(),fileName)

        fs.writeFileSync(path.join(process.cwd(),config.casePath),JSON.stringify(caseAddress))

        fs.writeFileSync(tempCaseFile,text);

        return tempCaseFile;

    }catch (err){
        throw err
    }

}