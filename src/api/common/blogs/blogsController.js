const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
var rimraf = require('rimraf')
const db = require('../../../models')
const multer = require('multer')
const router = express.Router();

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: false
}))

// file uploading
var Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var dir = './src/assets/public/blogs/' + req.body.id;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            }, (error) => {
                if (error)
                    console.log('ErrorMessage:' + error)
                else
                    console.log('directory successfully created..')
            })
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-')
        cb(null, filename)
    }
})

const upload = multer({
    storage: Storage
});


//adding data to database
router.post('/', (req, res) => {
    console.log("reached blog", req.body)
    var data= req.body.data;
    if (data.id == null || data.id == " " || data.id == undefined) {
        db.blogs.create({
            title:data.title,
            date_of_publishing:data.dateOfPublishing,
            author_name:data.authorName,
            reading_time:data.readingTime,
            summary:data.summary,
        }).then(function (data) {
            if (data) {
                res.json({
                    status: 200,
                    data: data.id
                })
            } else {
                res.json({
                    status: 400,
                    message: 'blog is not created..'
                })
            }
        }).catch(err => {
            console.log("ERROR:", err)
        })
    }else{
        db.blogs.findOne({
            where:{
                id:data.id
            }
        }).then(receivedBlog =>{
           if(receivedBlog){
            if(data.selectImage == true){
             var dir = './src/assets/public/blogs/' +data.id;
             rimraf(dir,()=>{console.log('done')})
            }
           }
           receivedBlog.update({
            title:data.title,
            date_of_publishing:data.dateOfPublishing,
            author_name:data.authorName,
            reading_time:data.readingTime,
            summary:data.summary,
           }).then(result=>{
            if(result){
                res.json({
                    status:200,
                    data:result.id,
                    message: "data updated successfully."
                })
            }else{
                res.json({
                    status:400,
                    message: "data not updated."
                })
            }
           
           })
        })}
})

router.post('/img', upload.single('avatar'), (req, res) => {

    console.log('image router')
    db.blogs.update({
        image: req.file.filename
    }, {
        where: {
            id: req.body.id
        }
    }).then(function (data) {
        res.status(200).json({
            message: 'file uploaded successfully..'
        })
    })
})


router.get('/getAllBlogs', (req, res) => {
    var blogId = req.query.blogId;

    if (blogId == "" || blogId == null || blogId == undefined) {
        db.blogs.findAll().then(result => {
            res.json({
                status: 200,
                data: result
            })
        })

    } else {
        db.blogs.findOne({
            where: {
                id: blogId
            }
        }).then(BlogData => {
            res.json({
                status: 200,
                data: BlogData
            })
        })
    }


})

router.get('/getdeleteBlogData', (req, res) => {
    db.blogs.destroy({
        where: {
            id: req.query.blogID
        }
    }).then(result => {
        if (result) {
            var dir = './src/assets/public/blogs/' + req.query.blogID;
            if (fs.existsSync(dir)) {
                rimraf(dir, () => {
                    console.log('done')
                })
            }
            res.json({
                status: 200,
                data: 'blog is deleted.'
            })
        } else {
            res.json({
                status: 400,
                data: 'blog is not deleted'
            })
        }

    })
})



module.exports = router;