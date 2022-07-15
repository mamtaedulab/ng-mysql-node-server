/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('config');
const swaggerUi = require('swagger-ui-express');
const UserService = require('../src/api/common/user/userService');
const swaggerDocument = require('./swagger.json');
const logger = require('./utils/logger');
const br = require('../src/db/baseRepository')




require('./passport');

// common controllers
const authController = require('./api/common/auth/authController');
const userController = require('./api/common/user/userController');
const userPhotoController = require('./api/common/user/userPhotoController');
const settingsController = require('./api/common/settings/settingsController');
const myDataController=require('./api/common/myData/myDataController')
const blogsController=require('./api/common/blogs/blogsController')

const SeedService = require('./api/seedService');
const seedService = new SeedService();
const app = express();
const { port, root } = config.get('api');
const db = require("./models");
db.sequelize.sync();
const models = require( './models/index');

const FILE_LOCATION= 'D:/demoProject/ng-mysql-node-server/';
app.use('/api/upload/',express.static(FILE_LOCATION + "src/assets/public/upload/"));
app.use('/api/blogs/',express.static(FILE_LOCATION + "src/assets/public/blogs/"));

function logErrors(err, req, res, next) {
  logger.error(err);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something went wrong.' });
  } else {
    next(err);
  }
}

app.use(cors());
app.use(bodyParser.json());

const auth = passport.authenticate('jwt', { session: false });

const customSwaggerOptions = {
  showExplorer: true,
  swaggerOptions: {
    authAction: {
      JWT: {
        name: 'JWT',
        schema: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Bearer <my own JWT token>',
        },
        value: 'Bearer <my own JWT token>',
      },
    },
  },
};

app.use(`${root}/swagger`, (req, res, next) => {
  swaggerDocument.host = req.get('host');
  req.swaggerDoc = swaggerDocument;
  next();
}, swaggerUi.serve, swaggerUi.setup(null, customSwaggerOptions));

// seed data in case of empty data base
setTimeout(() => {
  seedService.checkAndSeed()
}, 500);

// routes for common controllers
app.use(`${root}/auth`, authController);
// TODO: fix photo, it temporary solution
app.use(`${root}/users/:userId/photo`, userPhotoController);

app.use(`${root}/users`, auth, userController);
app.use(`${root}/settings`, auth, settingsController);
app.use(`${root}/myData`,myDataController)
app.use(`${root}/blogs`,blogsController)

app.use(logErrors);
app.use(clientErrorHandler);
const userService = new UserService();
app.get("/add",(req,res)=>{
  console.log('reached.......');
})
app.get('/', (req, res) => {
 //console.log("count "+ models.user.count());
//  models.users.findAndCountAll({
// }).then(entries => {
// console.log(entries.count)
// }).catch(err => {console.log(console.error("error in count"))
// })

var b=new br();
// b.addMany([{ 'name': 'Shra1',
// 'email': 'tejas@edulab.in',
// 'password': '$2y$10$E1yiVhWx6YKf5KxDh.U0pufk8f.9jKJKEmh9Pq7cOBregqOJ20oBi',
// 'type': 'SE',
// 'lang': 'En',
//  'created_by': '1'},{ 'name': 'Shra1',
//  'email': 'amit@edulab.in',
//  'password': '$2y$10$E1yiVhWx6YKf5KxDh.U0pufk8f.9jKJKEmh9Pq7cOBregqOJ20oBi',
//  'type': 'SE',
//  'lang': 'En',
//   'created_by': '1'}]).then((data)=>{
//   console.log(data)
// })

// b.edit(4,{ 'name': 'francis',
//  'email': 'francis@edulab.in'})

//b.delete(3);


b.list().then((data )=> {
  console.log(data);
})

 models.users.findAll().then( userResponse => {
  res.status( 200 ).json( userResponse )
})
.catch( error => {
  res.status( 400 ).send( error )
})

  //console.log("count is : "+userService.getCount());
 // res.send('Hello World!');
});

app.listen(port);

logger.info(`Server start listening port: ${port}`);
