const express = require('express');
const router = express.Router();
const {pullSync} = require('./git')
/* GET home page. */
router.post('/', function(req, res, next) {

    pullSync().then(data=>{
        if(data==true){
            res.json({result:true})
        }else{
            res.json({result:false,msg:data})
        }
    })

});

module.exports = router;
