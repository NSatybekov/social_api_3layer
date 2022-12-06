var express = require('express');
var router = express.Router();
const userController = require('../controllers/usersController')
const loginController = require('../controllers/loginController')
const jwtConfig = require('../config/jwt')

/* GET users listing. */
router.get('/', userController.all_users_get ); //done 


// jwtConfig.profileOwner
router.get('/:id',userController.user_info_get) 

router.put('/:id',jwtConfig.verifyToken, jwtConfig.profileOwner, userController.user_info_update) 

router.get('/:id/friend',userController.user_friends_list_get) 

//  jwtConfig.verifyToken, jwtConfig.profileOwner,
router.post('/:id/friend/:friendId', userController.user_friend_request_send)

router.put('/:id/friend/:friendId', userController.user_friend_invite_accept)

router.delete('/:id/friend/:friendId', userController.user_friend_delete2)


// profile owner NOT WORKING WITHOUT VERIFY TOKEN

module.exports = router;
