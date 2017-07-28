/**
 * Created by kukuchong on 2017/7/25.
 */

const os = require('os')
const fs = require('fs')
const path = require('path')
const {spawn,exec,execFile} = require('child_process')
const execFile = require('')

const devDependence= {
    'common': [
        {
            'command': 'npm', args:['install','gulp','-g']
        },
        {
            'command': 'npm', args:['install','appium-gulp-plugins','-g']
        },
        {
            'command': 'npm',args:['install','appium','-g']
        },
        {
            'command': 'npm',args:['install','appium-doctor','-g'] //check appium envirment
        },
        {
            'command': 'npm',args:['install','mocha','-g']
        }
    ],
    'darwin': [
        {
            'command': 'npm' ,args:['install','ios-deploy','-g']
        },

        {
            'command': 'npm',args:['install','authorize-ios','-g'] // use of ios simulator
        },
        ,
        {
            'command':'brew',args:['install','libimobiledevice','--HEAD'] //iphone Communication
        },
        {
            'command':'brew',args:['install','mobiledevice'] //get ios information
        },
        {
            'command':'brew',args:['install' ,'carthage']
        }
    ],
    'win32':[

    ]
}

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
                let msg = ('Command \'' + dev.command+" " +dev.args.join(" ")+ '\' exited with code ' + code);
                process.stderr.write(msg);
                resolve(false)
            }
        })
        command.stdout.on('data',data=>{
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


class autoMate {
    constructor(type){
        this.platform = type;
        this.env= Object.assign(process.env)
    }
    async init(){}
    async installDependence(){
        const devs= devDependence[this.platform];
        for(let i=0;i<devs.length;i++){

            let result= await subProcess(devs[i])
            if(!result) return false
        }
        return true
    }

}
class autoMateMac extends autoMate{
    async init(){
        //安装IOS相关依赖
        let result = await this.checkIosEnv()
        if(result){
        //安装成功可安装安卓相关依赖
            let android= await this.checkAndroidEnv()
            if(android){
                await this.checkAndroidPath();
            }
        }else{
            process.exit()
        }
    }
    async modifyWebDriver(){
        let module_pwd= await subProcess({'command':'npm',args:['root','-g']})
        if(module_pwd){
            let file= await subProcess({'command': 'find',args:[path.join(module_pwd.stdout,'appium'),'-name','UITestingUITests.m']})

            if(file&&file.stdout){
                await subProcess({'command':'cp',args:['-f','./override/UITestingUITests.m',file.stdout]})
            }
        }

        let file= await subProcess({'command': 'find'})
    }
    async checkIosEnv(){
        //检测 xcode
        await this.checkXcode()
        //检测 brew 是否按装
        let isBrew=await this.checkBrew()
        if(isBrew){
            //安装依赖
            let isDep= await this.installDependence()

            if(isDep){
                process.stdout.write("IOS 相关依赖已经安装完毕")
                return true
            }else {
                process.stderr.write("依赖包安装失败")
                return false
            }

        }else{
            process.stderr.write("brew install 失败了")
            precess.exit()
        }

    }
    async checkAndroidEnv(){
        let isSdk= await this.checkSDK();
        let isAnt= await this.checkAnt()
        if(isSdk&&isAnt) return true

        return false;
    }
    async checkAndroidPath(){
        let sdkPath= await subProcess({'command':'echo','args':['$JAVA_HOME']})
        let androidPath= await subProcess({'command':'echo','args':['$ANDROID_HOME']})
        if(sdkPath===false){
            process.chdir('~/')
            if(!fs.existsSync('.bash_profile')){
                fs.writeFileSync('.bash_profile')
            }
            fs.appendFileSync('.bash_profile',"\n export JAVA_HOME="+sdkPath.stdout+"\n export PATH=$JAVA_HOME/bin:$PATH",'utf8')
        }
        if(androidPath===false){
            fs.appendFileSync('.bash_profile',"\n export ANDROID_HOME="+androidPath.stdout,'utf8')
        }

    }
    async checkSDK(){
        let dev= {
            'command': "java",
            'args': ['-version']
        }
        try {
            let result= await subProcess(dev,true)
            return result;
        }catch(err){
            if(err.errno === 'ENOENT'){
                let dev= {
                    'command': "brew",
                    'args': ['tap','install','java']
                }
                let res= await subProcess(dev)
                return res
            }
        }
    }

    async checkAnt(){
        let dev= {
            'command': "android",
            'args': ['-h']
        }
        try{
            await subProcess(dev,true)
        }catch (err){
            if(err.errno === 'ENOENT'){
                let dev= {
                    'command': "brew",
                    'args': ['tap','install','android-sdk']
                }
                await subProcess(dev)
            }
        }
    }

    async checkXcode(){
        let dev = {
            'command': 'xcode-select',
            'args': ['-p']
        }
        try {
            let result= await subProcess(dev)
            if(result.stdout== "/Applications/Xcode.app/Contents/Developer")
                return true;
            else
                return false
        }catch(err){
            process.stderr.write(err.message)
            return false;
        }
    }

    async checkBrew(){
        let dev={
            'command': 'brew',
            'args': []
        }
        try{
            let result= await subProcess(dev,true)
            return result;
        }catch (err){
            if(err.errno==='ENOENT'){
                let dev = {
                        'command': 'ruby',
                        'args': ['-e','"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"']
                    }
                let result= await subProcess(dev);
                if(!result) return false

                return true;
            }
        }
    }

}

class autoMateWin extends autoMate{
    constructor(type){
        super(type)
        this.SDKEnable=false;
    }
    async init(){}
    async checkAndroidPath(){

    }
    async checkSDk(){
        let dev= {
            'command': "java",
            'args': ['-version']
        }
        try {
            let result= await subProcess(dev,true)
            return result;
        }catch(err){
            if(err.errno === 'ENOENT'){
                let dev= {
                    'command': "brew",
                    'args': ['tap','install','java']
                }
                let res= await subProcess(dev)
                return res
            }
        }
    }

}

function main() {
    const platform = os.platform()
}
