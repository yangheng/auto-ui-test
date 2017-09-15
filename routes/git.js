/**
 * Created by kukuchong on 2017/9/7.
 */
const subProcess = require('../utils/tools')

async function pullSync() {
    try{
        await subProcess({command:'git',args:['pull']},true)
        return true;
    }catch (err){
        return err.message
    }

}

async function pushSync() {
    try{
        await subProcess({command:'git',args:['commit','-a','-m']},true)
        await subProcess({command:'git',args:['push']},true)
        return true;
    }catch (err){
        return err.message;
    }

}

exports.pullSync = pullSync;
exports.pushSync = pushSync