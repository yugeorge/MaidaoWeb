/**
 * Created by 延瑞 on 2015/1/4.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');


var AV = require('avoscloud-sdk').AV;
AV.initialize("qkln6010w7ln2xe26wtnb56m67qgzzzjxm1tyb7wh0xoktep", "davplp3j3jbrhngjm6edbnneoo99um9oc1yzhkkjmpsincgl");
/* 添加路线 */
router.post('/pointadd', function(req, res) {
    var Point = AV.Object.extend("Point");
    var point=new Point();
    point.set("RoadId",req.body.RoadId);
    point.set("Title",req.body.InputTitle);
    point.set("Content",req.body.InputContent);
    point.save(null, {
            success: function(point) {
                //res.send('true');
                res.redirect("/roads/details/"+req.body.RoadId);
            },
            error: function(point, error) {
                res.send('添加失败');
            }}
    );
});

/* 修改站点标题 */
router.post('/editpointtitle', function(req, res) {

    var Point = AV.Object.extend("Point");
    var query = new AV.Query(Point);
    query.get(req.body.PointID, {
        success: function(point) {
            // The object was retrieved successfully.
            point.set("Title", req.body.Title);
            point.save();
            res.send('true');
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});

/* 修改站点内容 */
router.post('/editpointcontent', function(req, res) {

    var Point = AV.Object.extend("Point");
    var query = new AV.Query(Point);
    query.get(req.body.PointID, {
        success: function(point) {
            // The object was retrieved successfully.
            point.set("Content", req.body.Content);
            point.save();
            res.send('true');
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});
router.post('/uploadpointimage', function(req, res) {
  console.log(req.body.PointID);
    var files = [].concat(req.files);
    for(var i = 0; i < files.length; i++){
      var  file = files[i].file;
        var data=fs.readFileSync(file.path);
       // console.log(data);
        //var base64Data = data.toString('base64');
        //var theFile = new AV.File(file.originalFilename, {base64: base64Data});
        var theFile = new AV.File(file.originalFilename,data);
        theFile.save();
        var Point_Image = AV.Object.extend("Point_Image");
        var point_img=new Point_Image();
        point_img.set("PointId",req.body.PointID);
        point_img.set("Image",theFile);
        point_img.save();
    }
    //res.send("true");
    res.jsonp({status:'cheng gong by liuyanrui'});
});


router.get('/getpointimage/:id', function(req, res) {


    //var imgid=req.params.id;
    var pointimgs=new Array();
    var Point_Image = AV.Object.extend("Point_Image");
    var query = new AV.Query(Point_Image);
    query.equalTo("PointId",req.params.id);
    query.find({
        success: function(results) {
            //alert("Successfully retrieved " + results.length + " scores.");
            // Do something with the returned AV.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                var pointimage=new Object();
                pointimage.id=object.id;
                pointimage.image=object.get('Image');
                pointimgs.push(pointimage);


              //  console.log(pointimage.image.url())

            }

        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

});
router.get('/getpointfirstimage/:id', function(req, res) {


    var Point_Image = AV.Object.extend("Point_Image");
    var queryimg = new AV.Query(Point_Image);
    queryimg.equalTo("PointId",req.params.id);
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



/* 修改站点标题 */
router.post('/setpositon', function(req, res) {

    console.log(req.body.pointpositionpointid);
    console.log(req.body.pointpositionlongitude);
    console.log(req.body.pointpositionlatitude);
    console.log(req.body.pointpositioninput);

    var Point = AV.Object.extend("Point");
    var query = new AV.Query(Point);
    query.get(req.body.pointpositionpointid, {
        success: function(point) {
            // The object was retrieved successfully.
            console.log(point)
            point.set("Longitude", req.body.pointpositionlongitude);
            point.set("Latitude", req.body.pointpositionlatitude);
            point.set("Address", req.body.pointpositioninput);
            point.save();
            res.send('true');
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a AV.Error with an error code and description.
            res.send('false');
        }
    });
});


module.exports = router;
