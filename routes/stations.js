/**
 * Created by 延瑞 on 2015/1/4.
 */
var express = require('express');
var router = express.Router();


var AV = require('avoscloud-sdk').AV;
AV.initialize("qkln6010w7ln2xe26wtnb56m67qgzzzjxm1tyb7wh0xoktep", "davplp3j3jbrhngjm6edbnneoo99um9oc1yzhkkjmpsincgl");





/* 添加路线 */
router.post('/stationadd', function(req, res) {

    var Road = AV.Object.extend("Point");
    var road=new Road();
    road.set("Title",req.body.InputTitle);
    road.set("Content",req.body.InputContent);
    road.save(null, {
            success: function(road) {
                res.send('true');
            },
            error: function(road, error) {
                res.send('添加失败');
            }}
    );


});

module.exports = router;
