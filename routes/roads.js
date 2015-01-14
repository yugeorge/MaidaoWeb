/**
 * Created by 延瑞 on 2015/1/4.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');


var AV = require('avoscloud-sdk').AV;
AV.initialize("qkln6010w7ln2xe26wtnb56m67qgzzzjxm1tyb7wh0xoktep", "davplp3j3jbrhngjm6edbnneoo99um9oc1yzhkkjmpsincgl");

router.get('/list', function (req, res) {

    var roads = new Array();

    var Road = AV.Object.extend("Road");
    var query = new AV.Query(Road);
    //query.equalTo("RoadId",req.params.id);
    query.find({
        success: function (results) {
            //alert("Successfully retrieved " + results.length + " scores.");
            // Do something with the returned AV.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                var road = new Object();
                road.id = object.id;
                road.title = object.get('Title');
                road.content = object.get('Content');
                roads.push(road);

            }
            res.render('roads/list', {roads: roads, layout: 'share/layout'});
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });


});


router.get('/index', function (req, res) {
    res.render('roads/index', {title: '路线', layout: 'share/layout'});
});
/* 线路明细 */
router.get('/details/:id', function (req, res) {
    var Road = AV.Object.extend("Road");
    var query = new AV.Query(Road);
    query.get(req.params.id, {
        success: function (road) {
            var title = road.get("Title");
            var content = road.get("Content");

            var points = new Array();

            var Point = AV.Object.extend("Point");
            var query = new AV.Query(Point);
            query.equalTo("RoadId", req.params.id);
            query.find({
                success: function (results) {
                    //alert("Successfully retrieved " + results.length + " scores.");
                    // Do something with the returned AV.Object values
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];

                        var point = new Object();
                        point.id = object.id;
                        point.title = object.get('Title');
                        point.content = object.get('Content');
                        points.push(point);
                        //console.log(points);


                    }
                    res.render('roads/details', {
                        title: title,
                        content: content,
                        roadid: req.params.id,
                        points: points,
                        layout: 'share/layout'
                    });
                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        },
        error: function (object, error) {
        }
    });
});
/* 线路中站点类别明细 */
router.get('/pointlistpart/:id', function (req, res) {
    var Road = AV.Object.extend("Road");
    var query = new AV.Query(Road);
    query.get(req.params.id, {
        success: function (road) {
            var title = road.get("Title");
            var content = road.get("Content");

            var points = new Array();

            var Point = AV.Object.extend("Point");
            var query = new AV.Query(Point);
            query.equalTo("RoadId", req.params.id);
            query.find({
                success: function (results) {
                    //alert("Successfully retrieved " + results.length + " scores.");
                    // Do something with the returned AV.Object values
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];

                        var point = new Object();
                        point.id = object.id;
                        point.title = object.get('Title');
                        point.content = object.get('Content');
                        points.push(point);
                        //console.log(points);


                    }
                    res.render('roads/pointlistpart', {
                        points: points,
                        layout: null
                    });
                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        },
        error: function (object, error) {
        }
    });
});


/* 路线标题增加 */
router.get('/roadtitleadd', function (req, res) {
    var Road = AV.Object.extend("Road");
    var road = new Road();
    road.set("RoadTitle", req.body.title);
    road.save(null, {
            success: function (road) {
                res.send('true');
            },
            error: function (road, error) {
                res.send('添加失败');
            }
        }
    );
});
/* 添加路线 */
router.post('/roadadd', function (req, res) {
    var Road = AV.Object.extend("Road");
    var road = new Road();
    road.set("Title", req.body.InputTitle);
    road.set("Content", req.body.InputContent);
    road.save(null, {
            success: function (road) {
                //res.send('true');
                res.redirect("/roads/list");
            },
            error: function (road, error) {
                res.send('添加失败');
            }
        }
    );
});


/* 修改站点标题 */
router.post('/editroadtitle', function (req, res) {

    var Road = AV.Object.extend("Road");
    var query = new AV.Query(Road);
    query.get(req.body.RoadID, {
        success: function (road) {
            // The object was retrieved successfully.
            road.set("Title", req.body.Title);
            road.save();
            res.send('true');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});

/* 修改站点内容 */
router.post('/editroadcontent', function (req, res) {

    var Road = AV.Object.extend("Road");
    var query = new AV.Query(Road);
    query.get(req.body.RoadID, {
        success: function (road) {
            // The object was retrieved successfully.
            road.set("Content", req.body.Content);
            road.save();
            res.send('true');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});

router.post('/uploadroadimage', function(req, res) {


    console.log(req.body.RoadID);

    var files = [].concat(req.files);

    // console.log(files[0].file.path);



    for(var i = 0; i < files.length; i++){
        var  file = files[i].file;

        var data=fs.readFileSync(file.path);
        // console.log(data);
        //var base64Data = data.toString('base64');
        //var theFile = new AV.File(file.originalFilename, {base64: base64Data});
        var theFile = new AV.File(file.originalFilename,data);




        theFile.save();

        var Road_Image = AV.Object.extend("Road_Image");
        var road_img=new Road_Image();
        road_img.set("RoadId",req.body.RoadID);
        road_img.set("Image",theFile);
        road_img.save();


    }

    //var data=fs.readFileSync(req.files.username.path);
    //console.log(data);
    res.send("true");
});
router.get('/getroadfirstimage/:id', function(req, res) {


    var Road_Image = AV.Object.extend("Road_Image");
    var queryimg = new AV.Query(Road_Image);
    queryimg.equalTo("RoadId",req.params.id);
    queryimg.first({
        success: function (queryimg) {
            //console.log(point.id)

            if (queryimg != null) {
                imgurl = queryimg.get('Image').url();
            }
            else {
                imgurl = "/images/img1.png";
            }

            res.redirect(imgurl);

            // Successfully retrieved the object.
            //var pointimage=queryimg.get('Image');
            //point.url= pointimage.url();


        },
        error: function (error) {
            //alert("Error: " + error.code + " " + error.message);
        }
    });

});

module.exports = router;
