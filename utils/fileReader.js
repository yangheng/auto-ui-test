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

    try{
        let db =  await getFile(path.join(process.cwd(),'db.json'))
        console.log(typeof db)
        database = JSON.parse(db)
        for(let i =0;i<database.length;i++){
            let code= await getFile(database[i].filePath)
            console.log(code)
            cases.push(Object.assign({},database[i],{code}))
        }
        console.log(cases)
        return cases
    }catch (err){
        console.log(err.message)
        return []
    }


}

exports.getFile = getFile