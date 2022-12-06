const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')
const loginController = require('./loginController')
const jwtConfig = require('../config/jwt')
const userService = require('../services/userService')
const authService = require('../services/authService')
const e = require('express')


exports.all_users_get = async (req,res, next) => {
    const userList = await userService.getUserList()
    res.json({userList})
}


exports.user_info_get = async function (req,res, next) { 
    const userData = await authService.findUserById(req.params.id)
    if(userData.status === 404) {
        res.status(404).send('No such user please register')
    } 
    if(userData.status === 200) {
                res.json( userData.user)
    }
}

// сделать мой профиль другим эндпоинтом 
// my profile will contain another info - my likes, my messages etc 
// overal profile will be same for all - details just for owner - need to modificate json data in info - get


//controller - get data from desc and send to service and send user id

exports.user_info_update = async (req,res,next) => {
    try{
        const user = await userService.updateUserDesc(req.params.id, req.body.description)
    res.json(user)
    } catch {
        res.send('user not found')
    }
}


exports.user_friends_list_get = async (req,res) => {
    try{
        const userData = await authService.findUserById(req.params.id)
        if(userData.status === 404) {
            res.status(404).send('No such user please register')
        } 
        if(userData.status === 200) {
                    res.json( userData.user.friends)
        }
    } 
    catch(err) {return next(err)}
}



exports.user_friend_request_send = async (req,res, next) => {
    try{
        const info = await userService.createFriendRequest(req.params.id, req.params.friendId)
    if (info === false) {
        res.status(400).send('cant add him')
    } else {
        res.json(info)
    }
    } catch{
        res.status(400).send('cant add')
    }
}


exports.user_friend_invite_accept = async(req,res) => {
    const infoUser = await userService.acceptFriendRequest(req.params.id, req.params.friendId)
    if (infoUser.status === true) {
        res.json({
        accepter: infoUser.accepter,
        sender: infoUser.sender
    })
    }
    else {
        res.send('Cant add')
    }
}



exports.user_friend_delete = async (req,res) => {
    const deletingUser = await User.findById(req.params.id)
    try{
        const inFriendsListCheck = deletingUser.friends.includes(req.params.friendId)
        if(inFriendsListCheck === true) {
            const newUserInfo = {
                $pull : {friends : req.params.friendId}
            }
            const updateFriendProfile = await User.findByIdAndUpdate(req.params.friendId, {$pull : {friends : req.params.id}})
            let updatedUser = await User.findByIdAndUpdate(req.params.id, {$pull : {friends : req.params.friendId}})
            updatedUser = await User.findById(req.params.id)
            res.json(updatedUser)
        }
    } catch {
        res.status(403)
        res.end()
    }
 }

exports.user_friend_delete2 = async (req,res) => {
    try{
        const usersFromDelete = await userService.deleteFriend(req.params.id, req.params.friendId)
    res.send(usersFromDelete)
    }
    catch{ 
        res.send('probably users not found')
    }
}