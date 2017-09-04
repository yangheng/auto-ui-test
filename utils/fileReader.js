/**
 * Created by kukuchong on 2017/7/18.
 */
const fs = require('fs')
const path = require('path')

const getFile = function(filePath) {
    return new Promise((resolve,reject)=>{
        fs.readFile(filePath,'utf8',(err, data)=>{
            if(err){
                reject(err)
            }else{
                resolve(data)
            }

        })
    })
}


exports.getCase = async function () {

    let cases =[];
    let files =fs.readdirSync(path.join(process.cwd(),'cases')).filter(m=>/.*\.js$/.test(m));

    try{
        for(let i =0;i<files.length;i++){
            let code= await getFile(path.join(process.cwd(),'cases',files[i]))
            cases.push({fileName:files[i],code})
        }
        return cases
    }catch (err){
        console.log(err.message)
        return []
    }


}

exports.writeDevices = function (data) {
    return fs.writeFileSync(path.join(process.cwd(),'utils','devices.json'),data,{encoding:'utf8'})
}

exports.getFile = getFile