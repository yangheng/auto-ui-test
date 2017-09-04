/**
 * Created by kukuchong on 2017/8/31.
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const {platform,xcodeOrg} = require('./capabilities')
const {hooks} = require('../mocha.config')
class Tests {
    constructor(type="all"){
        this.type = type;
        this.children=[];
        //this.root = path.join()
        this.hooks = ['before','after','beforeEach','afterEach']
    }
    addTail(){
        this.children.push("\n })");
        return this;
    }
    addWrapper(){
        this.children.push("const webdriverio = require('webdriverio');\nconst chai = require('chai')\nconst fs = require('fs');\nvar {config,platform} = require('../utils/capabilities');\nvar devices = require('../utils/devices.json')\nchai.should();\nvar device, client;")
        return this;
    }
    addDriverInit(device){
        if(device.platform=="ios"){
            let xcodeConfig = {};
            if(fs.existsSync("xcode.org.json")){
                xcodeConfig= require("../xcode.org.json");
                console.log(xcodeConfig)
            }else{
                xcodeConfig= Object.assign({},xcodeOrg);
            }
            this.children.push(`config.desiredCapabilities = Object.assign({},platform["${device.platform}"],devices["${device.platform}"]["${device.udid}"],{xcodeOrgId:"${xcodeConfig.xcodeOrgId}",xcodeSigningId:"${xcodeConfig.xcodeSigningId}"})`);
        }else{
            this.children.push(`config.desiredCapabilities = Object.assign({},platform["${device.platform}"],devices["${device.platform}"]["${device.udid}"])`);
        }

        this.children.push("client=webdriverio.remote(config)");
        return this;
    }
    addHooks(device){

        this.children.push(`describe('${device.platform} webview',function () {`);
        this.children.push('try {\nvar casesAddress = JSON.parse(fs.readFileSync("./utils/casesAddress.json"));\nvar cases = casesAddress.cases;\nvar currentTest = -1;\nconsole.log(cases);\n} catch (e) {\nconsole.log(e);\n}\nthis.timeout(514229);')
        this.hooks.map(val=>{
            this.children.push(`${val}(${hooks[device.platform][val]})`);
        })
        return this;
    }
    
    mergeFile(file){
        try{
            if(this.type == 'single'){
                if(Array.isArray(file)){
                    for(let i=0;i<file.length;i++){
                        let child = require(`../cases/${file[i]}`).toString();
                        this.children.push(child.substring(child.indexOf("{")+1,child.lastIndexOf("}")));
                    }
                }else{
                    let child = require(`../cases/${file}`).toString();
                    this.children.push(child.substring(child.indexOf("{")+1,child.lastIndexOf("}")))
                }


            }else{
                let p = path.join(__dirname,'../cases')
                let dirs =fs.readdirSync(p).filter(m=>/.*\.js$/.test(m));
                dirs.map(dir=>{
                    let child = require(`../cases/${dir}`).toString();
                    this.children.push(child.substring(child.indexOf("{")+1,child.lastIndexOf("}")));
                })
            }
        }catch(err){
            console.log(err.message)
        }

        return this;
    }
    
}

module.exports = Tests;


