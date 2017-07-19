/**
 * Created by kukuchong on 2017/7/19.
 */
const spawn = require('child_process').spawn;
const path = require('path')
const bat = spawn('mocha', ['-R', 'mochawesome','--reporter-options',"reportDir=./public/mochawesome,reportFilename=1111",'./tests/index.js']);
//const Mocha = require('mocha')

let stdout ;
bat.stdout.on('data', (data) => {
    stdout = (stdout || "")+data
});
bat.stderr.on('data', (data) => {
    console.error(data.toString());
});
bat.on('exit',(code)=>{
    console.log(stdout);
})