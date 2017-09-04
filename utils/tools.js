/**
 * Created by kukuchong on 2017/9/1.
 */
const path = require('path');
const fs = require('fs');
const os = require('os');
const {spawn} = require('child_process')
const util = require('util')

function subProcess(dev,cb=false) {
    var stdout;
    let pro = new Promise((resolve,reject)=>{

        const command= os.platform()==='win32'?spawn(dev.command,[...dev.args],{shell:true}):spawn(dev.command,[...dev.args]);

        command.on('error',err=>{

            if(cb){
                reject(err)
            }else{
                let msg = 'Command \'' + dev.command +" "+ dev.args.join(" ") + '\' errored out: ' + err.stack;
                if (err.errno === 'ENOENT') {
                    msg = 'Command \'' + dev.command + '\' not found. Is it installed?';
                }
                util.error(msg);
                resolve(false);
            }

        })

        command.on('close',code=>{
            if(code===0){
                resolve({stdout,code})
            }else{
                let msg = ('Command \'' + dev.command+" " +dev.args.join(" ")+ '\' exited with code ' + code);
                util.error(msg);
                resolve(false)
            }
        })
        command.stdout.on('data',data=>{
            stdout = (stdout||"") + data;
            console.log(data.toString());
        })
        //command.stdout.pipe(process.stdout)
        command.stderr.pipe(process.stdout)
        command.stderr.on('error',err=>{
            let msg= 'Standard error \'' + err.syscall + '\' error: ' + err.stack;
            util.error(msg);
            resolve(false);
        })

    })
    return pro
}
async function getDevices() {
    let deviceList=new Map();
    if(os.platform()=='darwin'){
        let result=await subProcess({'command':'mobiledevice','args':['list_devices']})
        if(result.stdout) {
            deviceList.set('ios', result.stdout.split('\n')[0])
        }
    }
    let result=await subProcess({'command':'adb','args':['devices']})
    if(result.stdout&&result.stdout.split('\n')[1].split('\t')[0]){
        deviceList.set('android',result.stdout.split('\n')[1].split('\t')[0])

    }
    
    return deviceList;
}
function fileExits(name) {
    let p = path.join(__dirname,'../cases',name);
    return fs.existsSync(p);
}
function bundleFile(fileName,body) {
    
    fs.writeFileSync(path.join(__dirname,'../test',fileName),body,{encoding:'utf8'});
}
function mocha(file) {
    subProcess({'command':'mocha',args:[`./test/${file}`]})
}
exports.subProcess = subProcess;
exports.getDevices = getDevices;
exports.fileExits = fileExits;
exports.bundleFile = bundleFile;
exports.mocha = mocha;
