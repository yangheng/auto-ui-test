var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    
    res.render('add', { title: '新增案例'});

});

module.exports = router;
