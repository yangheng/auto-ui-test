var fs= require('fs')
var path= require('path')
var {spawn}= require('child_process')
function subProcess(dev,cb=false) {
    var stdout;
    let pro = new Promise((resolve,reject)=>{

        const command= spawn(dev.command,[...dev.args])

        command.on('error',err=>{

            if(cb){
                reject(err)
            }else{
                let msg = 'Command \'' + dev.command +" "+ dev.args.join(" ") + '\' errored out: ' + err.stack;
                if (err.errno === 'ENOENT') {
                    msg = 'Command \'' + dev.command + '\' not found. Is it installed?';
                }
                process.stderr.write(msg);
                resolve(false);
            }

        })

        command.on('close',code=>{
            if(code===0){
                resolve({stdout,code})
            }else{
                let msg = ('Command \'' + dev.command +" "+dev.args.join(" ")+ '\' exited with code ' + code);
                process.stderr.write(msg);
                resolve(false)
            }
        })
        command.stdout.on('data',data=>{
            console.log('data is .....')
            stdout = (stdout||"") + data
        })
        command.stdout.pipe(process.stdout)
        command.stderr.pipe(process.stderr)
        command.stderr.on('error',err=>{
            let msg= 'Standard error \'' + err.syscall + '\' error: ' + err.stack;
            process.stderr.write(msg);
            resolve(false);
        })

    })
    return pro
}

async function main() {
    /*try{
        let res= await subProcess({'command':'brew',args:['cask']},true)
    }catch (err){
        console.log("err is :"+err.errno)
    }*/


    let result= await subProcess({'command':'cp',args:['-f','package.json',path.join('/Users','kukuchong','Desktop')]})
    console.log('result is '+result.code)
}
main()