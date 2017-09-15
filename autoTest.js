/**
 * Created by kukuchong on 2017/9/11.
 */
import {subProcess} from 'utils/tools';

class Test {
    constructor(){
        this.env= Object.assign(process.env)
    }
    async checkPWd(){
        await subProcess({command:''})
    }
}