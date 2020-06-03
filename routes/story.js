var	express = require("express"),
	router = express.Router({mergeParams:true}),
	User = require("../models/user"),
	Campaign = require("../models/campaign"),
	Character = require("../models/character"),
	Weapon = require("../models/weapon"),
	middleware = require("../middleware/index"),
	multer = require("multer"),
	multerS3 = require("multer-s3"),
	aws = require("aws-sdk")

	var s3 = new aws.S3({aws_access_key_id:process.env.AWS_ACCESS_KEY_ID, aws_secret_access_key:process.env.AWS_SECRET_ACCESS_KEY});

var upload = multer({
  storage: multerS3({
	s3:s3,
	bucket:"dndforyouandme",
	acl:"public-read-write",
	metadata: function (req, file, cb) {
	  cb(null, {fieldName: file.fieldname});
	},
	key: function (req, file, cb) {
	  cb(null, (Date.now()+file.fieldname+file.originalname)) 
	}
  })
})

module.exports = router;