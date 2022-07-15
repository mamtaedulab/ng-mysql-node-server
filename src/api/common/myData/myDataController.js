/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const express = require('express');
const bodyParser = require('body-parser');
const db = require('../../../models')
const multer = require('multer');
const path = require('path');
var rimraf = require('rimraf')
var fs = require('fs');
var constant = require('../../../../config/constant')
const router = express.Router();
router.use(bodyParser.json());
router.use(express.urlencoded())
router.use(bodyParser.urlencoded({extended: true}));


//Inserting Data 
router.post('/', (req, res) => {
    console.log('reached')
    console.log(req.body)
    console.log(req.body.name)
    const year = req.body.yearOfpassing; 
    db.mydata.create({
        name: req.body.name,
        aboutMe: req.body.about,
        institution: req.body.institution,
        university: req.body.university,
        year: year,
        program: req.body.programName,
        stream: req.body.stream,
        location: req.body.location,

    }).then(function (data) {
        if (data) {
            res.json({
                status: 200,
                data: data.id
            })
        } else {
            res.json({
                status: 400,
                message: 'Data is not created.'
            })
        }
    })
});





var Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var dir;
        var upload_option = req.body.upload_option;
        if (upload_option == 'vdo') {
            dir = './src/assets/public/upload/' + req.body.id +'/video' ;
        } else {
            dir = './src/assets/public/upload/' + req.body.id +'/image';
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir,{recursive:true},(error)=>{
                if(error)
                    console.log('ErrorMessage:'+error)
                else
                    console.log('directory successfully created')
            });
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        console.log("id", file)
        const fileName = file.originalname.toLowerCase().split(' ').join('-')
        console.log(fileName)
        cb(null, fileName)
    }
})
const upload = multer({storage: Storage});

//For uploding Image
router.post('/img', upload.single('avatar'), (req, res) => {
    var id = req.body.id;
    console.log('id', id)
    db.mydata.update({
        image: req.file.filename
    }, {
        where: {
            id: id
        }
    }).then(function (data) {
        res.status(200).json({
            message: 'file upload successfully!',
            // avatar: url + '/public/' + req.file.filename,
        })
    })

    // if(req.file == undefined){
    //     res.status(201).json({
    //         message: 'No changes to file!',
    //        })
    // }else{
    //     //console.log("req.file.path===>"+req.file.path);
    //     //var minusPublic = req.file.path.replace(/public\//g, "")
    //     var minusPublic = req.file.path.split('public')
    //     // console.log("minusPublic===>"+minusPublic)
    //     // console.log("minusPublic[1]===>"+minusPublic[1])
    //     var url = serverUrl + minusPublic[1]
    //     //console.log("url===>"+url)

    // models.companies.update({ logo: url }, {
    //     where: {
    //         id: id
    //     }
    // }).then(function (data) {
    //     res.status(200).json({
    //         message: 'file upload successfully!',
    //         //  avatar: url + '/public/' + req.file.filename,
    //     })
    // })
    // }


})


//For video upload
router.post('/video', upload.single("avatar"), (req, res) => {
    console.log("video")
    console.log(req.file)

    var id = req.body.id;
    console.log('id', id)

    db.mydata.update({
        video: req.file.filename
    }, {
        where: {
            id: id
        }
    }).then(function (data) {
        res.status(200).json({
            message: 'file upload successfully!',

        })
    })

})


//fetching all data 
router.get('/getAllData', (req, res) => {
    console.log('--------------------------------------------------------------')

    // console.log(__dirname)
    //console.log("getProgramData getProgramData getProgramData==>"+req.query.college_id);
    // var condition = {};
    // if(req.query.role == 'company'){
    //     condition = {
    //         company_id : req.query.college_id
    //     }
    // }else{
    //     condition = {
    //         status:'active'
    //     }
    // }
    // db.mydata.findAll().then(notes => res.json(notes));
    db.mydata.findAll().then(function (alldata) {
        res.json({
            status: 200,
            data: alldata
        })
    })
})

//fetching single value 
router.get('/getValue', (req, res) => {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++')
    console.log(req.query.data_id)
    db.mydata.findOne({
        where: {
            id: req.query.data_id,
        }
    }).then(function (progarm_data) {
        res.json({
            status: 200,
            data: progarm_data
        })
    })
})

//Deleting Data
router.get('/getDeleteValue', (req, res) => {
    console.log("###############")
    console.log(req.query.data_id);
    db.mydata.destroy({
        where: {
            id: req.query.data_id
        }
    }).then(function (afterDeleteValue) {
        if (afterDeleteValue) {
            var dir = './src/assets/public/upload/' + req.query.data_id ;
            if (fs.existsSync(dir)) {
                rimraf(dir, () => {
                    console.log('done')
                })
                res.json({
                    status: 200,
                    message: 'Data is deleted'
                })
            }
        } else {
            res.json({
                status: 400,
                message: 'Data is not deleted.'
            })
        }
    })
})

//Update Data
router.post('/getUpdateValue', (req, res) => {
    console.log(req.body)
    Individualdata = req.body.updateData;
    // const year=req.body.updateData.yearOfpassing.split('-')
    // if(Individualdata.id==null||Individualdata.id==''||Individualdata.id== undefined){
    //     db.mydata.create({
    //         name:Individualdata.name,
    //         aboutMe:Individualdata.about,
    //         institution:Individualdata.institution,
    //         university:Individualdata.university,
    //         year:year[0],
    //         program:Individualdata.programName,
    //         stream:Individualdata.stream,
    //         location:Individualdata.location
    //       }).then(function(data){
    //         if(data){
    //             res.json({
    //                 status : 200,
    //                 data : companyprogram.id
    //             })
    //         }else{
    //             res.json({
    //                 status : 400,
    //                 message : 'Data is not created.'
    //             })
    //         }
    //     })
    // }else{
    db.mydata.findOne({
        where: {
            id: Individualdata.id
        }
    }).then(function (received) {
        if (received) {
            if(Individualdata.selectImg===true){
                const dir='./src/assets/public/upload/' +Individualdata.id+'/image';
                rimraf(dir, () => {console.log('Image done')})
            }
            if(Individualdata.selectVid===true){
                const dir='./src/assets/public/upload/' +Individualdata.id+'/video';
                rimraf(dir, () => {console.log('Video done')})
            }
            received.update({
                name: Individualdata.name,
                aboutMe: Individualdata.about,
                institution: Individualdata.institution,
                university: Individualdata.university,
                year: Individualdata.yearOfpassing,
                program: Individualdata.programName,
                stream: Individualdata.stream,
                location: Individualdata.location
            }).then(function (updated) {
                if (updated) {
                    res.json({
                        data: updated.id,
                        status: 200,
                        message: "data updated successfully."
                    })
                } else {
                    res.json({
                        status: 400,
                        message: "data not updated."
                    })
                }
            })
        } else {
            res.json({
                status: 400,
                message: "Data not found."
            })
        }
    })
  
})



module.exports = router;