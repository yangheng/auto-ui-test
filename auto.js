/**
 * Created by kukuchong on 2017/7/25.
 */

const os = require('os')
const fs = require('fs')
const path = require('path')
const {spawn,exec,execFile} = require('child_process')
const {writeXcodeOrg} = require('./utils/tools')
const win32Url= {
    'maven': 'http://mirror.bit.edu.cn/apache/maven/maven-3/3.5.0/binaries/apache-maven-3.5.0-bin.zip',
    'ant': 'https://mirrors.tuna.tsinghua.edu.cn/apache//ant/binaries/apache-ant-1.10.1-bin.zip',
    'jdk': '',
    'sdk': ''
}
const util = {
    error: function (msg) {
        console.log('\x1b[31m%s\x1b[31m\r',`XXX ${msg}`)
    },
    success:function (msg) {
        console.log('\x1b[32m%s\x1b[32m\r',`√√√ ${msg}`)
    },
    info: function (msg) {
        console.log('\x1b[33m%s\x1b[33m\r',`!!! ${msg}`)
    }
}

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
        {
            'command':'brew',args:['install','libimobiledevice','--HEAD'] //iphone Communication
        },
        {
            'command':'brew',args:['install','mobiledevice'] //get ios information
        },
        {
            'command':'brew',args:['install','carthage']
        },
        {
            'command':'brew',args:['install','ios-webkit-debug-proxy']
        }
    ],
    'win32':[

    ]
}

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


class autoMate {
    constructor(type){
        this.platform = type;
        this.env= Object.assign(process.env)
        this.logFile= path.join(this.env.PWD||__dirname,'log.json');
        this.devLog= this.getLog();
    }
    async init(){
        //自定义测试案例文件
        writeXcodeOrg();
        
        return true;

    }
    async installDependence(){
        const devs = devDependence.common.concat(devDependence[this.platform]);
        for(let i=0;i<devs.length;i++){
            if(!this.devLog[devs[i].args[1]]){
                console.log(devs[i].command +" "+ devs[i].args.join(" "));
                let result= await subProcess(devs[i],true)
                if(result.code&&result.code ==0){
                    this.devLog[devs[i].args[1]] = true;
                }else{
                    this.devLog[devs[i].args[1]] = false;
                }
            }

        }
        return true
    }
    getLog(){
        if(fs.existsSync(this.logFile)){
            return  JSON.parse(fs.readFileSync(this.logFile,{encoding:'utf8'}))
        }else{
            return {}
        }
    }
    setLog(){
        fs.writeFileSync(this.logFile,JSON.stringify(this.devLog),{encoding:'utf8'})
    }

}
class autoMateMac extends autoMate{
    async init(){
        await super.init()
        //安装IOS相关依赖
        let result = await this.checkIosEnv()
        if(result){
            //替换个编译的文件
            try{
                //覆盖一个文件
                await this.modifyWebDriver()
                //安装成功可安装安卓相关依赖
                let android= await this.checkAndroidEnv()
                console.log(android)
                if(android){

                    await this.checkAndroidPath();

                }

                //安装当前环境下的依赖包

                let _npm=await subProcess({'command':'npm',args:['install']});
                console.log(_npm)
            }catch (err){
                util.error(err.message);
                process.exit()
            }


            //启动服务

            //await subProcess({'command':'appium',args:[]})

        }else{
            process.exit()
        }
    }
    async autoXcode(globalPath) {
        let file= await subProcess({'command': 'find',args:[path.join(globalPath,'appium'),'-name','UITestingUITests.m']})
        if(file&&file.stdout){
            await subProcess({'command':'cp',args:['-f','./override/UITestingUITests.m',file.stdout.match(/./g).join('')]})
    }
        let WebDriverAgentPath = path.join(globalPath,'appium','node_modules','appium-xcuitest-driver','WebDriverAgent')
    process.chdir(WebDriverAgentPath)
        await subProcess({'command':'mkdir','args':['-p','Resources/WebDriverAgent.bundle']})
        await subProcess({'command':'./Scripts/bootstrap.sh','args':['-d']})
        await subProcess({'command':'open','args':['WebDriverAgent.xcodeproj']})
        process.chdir(this.env.PWD);
        return true;
    }
    async modifyWebDriver(){
        

        //判断下node安装途径 nvm
        try{
            await subProcess({'command':'nvm',args:['ls']},true)
            let _path = await subProcess({'command':'echo',args:['$PATH']});
            try{
                let nvmPath = _path.match(/./g).split(":").filter((path)=>path.indexOf(".nvm")!=-1)[0];
                nvmPath = nvmPath.split('bin')[0];
                let xcode =await this.autoXcode(path.join(nvmPath,'lib','node_modules'))
                return xcode
            }catch (err){
                util.error(err.message);
                util.error("!!! 请将 override/UITestingUITests.m 替换 appium/node_modules/_appium-xcuitest-driver@2.43.2@appium-xcuitest-driver/WebDriverAgent/WebDriverAgentRunner/UITestingUITests.m")

            }
        }catch (err){
            if(err.errno === 'ENOENT'){
                let module_pwd= await subProcess({'command':'npm',args:['root','-g']})
                if(module_pwd.stdout){
                    let globalPath = module_pwd.stdout.match(/./g).join('')
                    let xcode = await this.autoXcode(globalPath)
                    console.log(xcode);
                    return xcode
                }else{
                    util.error("XXX 没有找得到npm root path")

                }
            }
        }

    }
    async checkIosEnv(){
        //检测 xcode

        let xcodeEnable= await this.checkXcode()
        if(!xcodeEnable){
            util.error("请先安装Xcode")
            return false;
        }

        //检测 brew 是否按装
        let isBrew=await this.checkBrew()
        if(isBrew){
            //安装依赖
            let isDep= await this.installDependence()

            this.setLog();

            if(isDep){
                util.success("IOS 相关依赖已经安装完毕")

                return true
            }else {
                util.error("依赖包安装失败")
                return false
            }

        }else{
            util.error("brew install 失败了")
            return false
        }

    }
    async checkAndroidEnv(){

        let JDK = await this.checkJDK();
        console.log(JDK)
        if(JDK){
            let isSdk= await this.checkSDK();
            console.log(isSdk)
            return isSdk;
        }else{
            return false;
        }

        //let isAnt= await this.checkAnt()
        //if(isSdk&&isAnt) return true


    }
    async checkAndroidPath(){

        if(this.env.JAVA_HOME===undefined){
            process.chdir(this.env.HOME)
            if(!fs.existsSync('.bash_profile')){
                fs.writeFileSync('.bash_profile')
            }
            let jdkPath = await subProcess({'command':'/usr/libexec/java_home','args':['-V']})
            //console.log(jdkPath)
            fs.appendFileSync('.bash_profile',"\n export JAVA_HOME="+jdkPath.stdout.match(/./g).join('')+"\n export PATH=$JAVA_HOME/bin:$PATH",'utf8')
        }
        if(this.env.ANDROID_HOME===undefined){
            fs.appendFileSync('.bash_profile',"\n export ANDROID_HOME="+path.join(this.env.HOME,'Library/Android/sdk/'),'utf8')
        }
        if(this.env.JAVA_HOME===undefined ||this.env.ANDROID_HOME===undefined ){

            let sourceCommand= await subProcess({'command':'source','args':[path.join(this.env.HOME,'.bash_profile') ]})

            if(!sourceCommand){
                // 环境变量设置失败
                util.error('Android 环境变量设置失败')
                return false
            }
        }

        console.log(this.env.PWD)
        process.chdir(this.env.PWD);

        return true;

    }
    async checkSDK(){
        let dev= {
            'command': "android",
            'args': ['list','target']
        }
        try {
            let result= await subProcess(dev,true)
            return result;
        }catch(err){
            if(err.errno === 'ENOENT'){
                let tmpFile= path.join(process.env.HOME,'android-studio.dmg')
                let dev= {
                    'command': "curl",
                    'args': ['https://dl.google.com/dl/android/studio/install/2.3.3.0/android-studio-ide-162.4069837-mac.dmg','-o', tmpFile]
                }
                let res= await subProcess(dev)

                if(res){

                    util.success(`android studio 已经下载到 ${tmpFile}`)
                    util.info('安装 android-studio 过程中不要修改SDK的安装路径')
                    let mount= await subProcess({
                        'command': "hdiutil",
                        'args': ['mount',tmpFile]
                    })
                    util.error(`如果studio 没有自动安装成功!!,请手动安装,文件路径: ${tmpFile}`)

                    return mount
                }


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
                let res=await subProcess(dev)

                return res;
            }
        }
    }
    async checkJDK(){
        try{
            let _JDK = await subProcess({command:'java',args:['-version']},true)
            return _JDK;
        }catch (err){

            if(err.errno === 'ENOENT'){
                return false
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
            console.log("result is" + result.stdout)
            
            if(result.stdout== "/Applications/Xcode.app/Contents/Developer\n")
                return true;
            else
                return false
        }catch(err){
            util.error(err.message)
            return false;
        }
    }

    async checkBrew(){
        let dev={
            'command': 'brew',
            'args': ['-v']
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
            }else{

            }

        }
    }

}

class autoMateWin extends autoMate{
    constructor(type){
        super(type)
        this.SDKEnable= false;
        this.envCheck= [];

    }
    async init(){
        await super.init();
        let isDep= await this.installDependence()
        this.setLog()
        if(!isDep) {
            util.error("依赖包安装失败")
            process.exit()
        }

        await this.checkJDK()

        await this.checkAnt()

        await this.checkMaven()

        await this.checkSDk()

        if(this.envCheck.some(elem=>!elem.exist)){
            process.exit()
        }
        await subProcess({'command':'appium',args:[]})

    }
    async checkJDK(){
        let dev= {
            'command': 'java',
            'args': ['-version']
        }

        try {
            let t= await subProcess(dev,true)
            this.envCheck.push({
                'env':'JDK',
                'exist': true
            })
        }catch (err){
            if(err.errno==='ENOENT'){
                this.envCheck.push({
                    'env':'JDK',
                    'exist': false
                })

            }
        }


    }

    async checkAnt(){

        if(this.env.Path.indexOf('ant')== -1){
            util.error("系统未检测到Ant,请下载ant 并添加到path 环境变量")
            this.envCheck.push({
                'env':'ant',
                'exist': false
            })
        }else{
            this.envCheck.push({
                'env':'ant',
                'exist': true
            })
        }
    }

    async checkMaven(){
        let dev= {
            'command': 'mvn',
            'args': ['-version']
        }

        try {
            let t= await subProcess(dev,true)

            this.envCheck.push({
                'env':'Maven',
                'exist': true
            })
        }catch (err){
            if(err.errno==='ENOENT'){
                this.envCheck.push({
                    'env':'Maven',
                    'exist': false
                })

                util.error('系统未检测到maven,请下载maven 并设置M2HOME 和 M2 环境变量')

            }
        }
    }
    async checkSDk(){
        let dev= {
            'command': "adb",
            'args': ['version']
        }
        try {
            let result= await subProcess(dev,true)

            this.envCheck.push({
                'env':'SDK',
                'exist': true
            })

        }catch(err){
            if(err.errno === 'ENOENT'){
                this.envCheck.push({
                    'env':'SDK',
                    'exist': false
                })
                util.error('系统未检测到Android SDK,请下载并安装Android Studio 并设置ANDROID_HOME 环境变量 并将 platform-tools 和 tools 添加到 path 环境变量中 ')
            }
        }
    }

}

function main() {
    const platform = os.platform()
    util.info(platform)
    var pc ;
    if(platform == 'darwin'){
        pc= new autoMateMac(platform)
    }else{
        pc= new autoMateWin(platform)
    }

    pc.init()

}

main()
