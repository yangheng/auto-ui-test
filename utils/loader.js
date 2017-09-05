/**
 * Created by kukuchong on 2017/8/29.
 */

const repl = require('repl')
const args = process.argv.slice(2);
const compile = require('./compile');
const colors = require('colors')
const devices = require('./devices.json')
const {bundleFile,getDevices,fileExits,mocha,writeXcodeOrg} = require('./tools');
var config = {
    type:'',
    file:new Date().getTime()+'.js',
    device:{},
    devices:new Map(),
}
function myEval(type) {
   if(['ios','android'].indexOf(type)!==-1){
       config.device.platform = type ;
       if(config.devices.get(type)){
           config.device.udid = config.devices[type];
           start();
       }else{
           _exit(`您要测试的是 ${type},但是没有找到相关设备,请检查下参数是否有问题和设备`);
       }
       
   }else{
       process.break;
       return '请输入ios或者android';
   }
}
async function checkUSB() {
    let current_devices = await getDevices(config.device.platform);
    console.log(current_devices)
    if(current_devices.size==0){
        _exit("没有检测到任何设备啊 ... \n重新检查一下设备吧")
    }
    if(current_devices.size==2){
        config.devices = current_devices ;
        repl.start({
            prompt:"输入要测试的设备系统(ios/android)>",
            eval:function (cmd,context,filename,callback) {
                callback(null,myEval(cmd.match(/.*/g)[0]))
            }
        })
    }
    
    if(current_devices.size==1){
        console.log(current_devices.platform)
        if(config.device.platform){
            if(current_devices.get(config.device.platform)){
                config.device.udid = current_devices.get(config.device.platform);
                start();
            }else{
                _exit(`您要测试的是 ${config.device.platform},但是没有找到相关设备,请检查下参数是否有问题和设备`);
            }
        }else{
            config.device.platform = current_devices.keys().next().value;
            config.device.udid = current_devices.get(config.device.platform);
            start();
        }
    }
}
function start() {
    writeXcodeOrg();
    if(devices[config.device.platform][config.device.udid]){
        let builder= new compile(config.type);
        builder
            .addWrapper()
            .addDriverInit(config.device)
            .addHooks(config.device)
            .mergeFile(config.file)
            .addTail();

        bundleFile(config.file,builder.children.join('\n'));
        mocha(config.file);
    }else{
        _exit("要测试的设备还没有在配置文件里注册过\n快联系管理员来注册吧")
    }

}
function _exit(msg) {
    console.error(`********\n${msg}\n********`.red);
    process.exit()
}

async function loader() {

    switch (args.length){
        case 0 :
            config.type='all';
            checkUSB();
            break;
        case 1 :
            if(['ios','android'].indexOf(args[0])!=-1){
                config.type='all';
                config.device.platform = args[0];
                checkUSB()
            }else{
                if(fileExits(args[0])){
                    config.type = 'single';
                    config.file = args[0];
                    checkUSB()
                }else{
                    _exit("要测试的案例文件不存在啊,重新看下文件名是否正确");

                }
            }


            break;
        case 2 :
            if(fileExits(args[0])){
                if(['ios','android'].indexOf(args[1])!=-1){
                    config.type = 'single';
                    config.file = args[0];
                    config.device.platform = args[1];
                    checkUSB()
                }else{
                    _exit("要测试的案例文件不存在啊,重新看下文件名是否正确");
                }
            }else{
                _exit("要测试的案例文件不存在啊,重新看下文件名是否正确");
            }
            break;
        default:
            _exit("创建的命令参数不对啊 ... \n试试 npm run mocha [案例文件名] [ios/android]");
    }

}

exports.loader = loader;
exports.serverBundle=function (data) {
    let builder= new compile(data.type);
    let file =new Date().getTime()+'-'+(Array.isArray(data.files)?data.files[0]:data.files)+".js";
    try{
        builder
            .addWrapper()
            .addDriverInit(data.device)
            .addHooks(data.device)
            .mergeFile(data.files)
            .addTail();
        bundleFile(file,builder.children.join('\n'));
        return file ;
    }catch (err){
        return false;
        console.log(err.message)
    }



}
