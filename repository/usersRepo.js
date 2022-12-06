
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { update } = require('../models/userSchema')
const User = require('../models/userSchema')


exports.findUser = async (username) => { // how to make it better? get param like _id or username and key : param ???
    const user = await User.findOne({username: username})
    return user
} // if user will not be found response will be null

exports.findUserById = async (id) => {
    const user = await User.findById(id)
    return user
} 


exports.registerUser = async (userObject) => {
    const newUser = new User(userObject)
    const user = await newUser.save()
    return user
}

exports.getUserList = async () => {
    const userList = await User.find({})
    return userList
}

exports.updateUserDesc = async (userId, description) => {
    const newUserDesc = {
        description: description
    }
    const updatedUser = await User.findByIdAndUpdate(userId, newUserDesc)
}

// id from this method need to be without name sender or receiver - user 1 and 2 to be more correct in future implemetations
exports.newSentFriendRequest = async (senderId, receiverId) => {
    const sendedFriendRequest = {
        $push : {sent_friend_requests: receiverId}
    }
    let updatedSender = await User.findByIdAndUpdate(senderId,sendedFriendRequest)
    updatedSender = await User.findById(senderId)
    return updatedSender
}

exports.newReceivedFriendRequest = async (senderId, receiverId) => {
    const receivedFriendRequest = {
        $push : {received_friend_requests: senderId}
    }
    let updatedReceiver = await User.findByIdAndUpdate(receiverId, receivedFriendRequest)
    updatedReceiver = await User.findById(receiverId)
    return updatedReceiver
}

exports.checkInFriendList = async (firstUserId, secondUserId) => {
    const checkingUser = await User.findById(firstUserId) // need to remake all functions in normal one and then use exports
    const friendStatus = checkingUser.friends.includes(secondUserId)
    return friendStatus
}

exports.checkAlreadySentRequest = async (senderId, receiverId) => {
    const senderUser = await User.findById(senderId) 
    const requestStatus = senderUser.sent_friend_requests.includes(receiverId)
    return requestStatus
}

exports.checkAlreadyReceived = async (senderId, receiverId) => {
    const senderUser = await User.findById(senderId)
    const requestStatus = senderUser.received_friend_requests.includes(receiverId)
    return requestStatus
}

exports.deleteFromSentRequest = async (accepterId, senderId) => {
    const updateInfo = {
        $pull : {sent_friend_requests: accepterId}
    }
    let updatedSender = await User.findByIdAndUpdate(senderId, updateInfo)
    updatedSender = await User.findById(senderId)
    return updatedSender

}

exports.deleteFromReceivedRequest = async (accepterId, senderId) => {
    const updateInfo = {
        $pull : {received_friend_requests: senderId}
    }
    let updatedAccepter = await User.findByIdAndUpdate(accepterId, updateInfo)
    updatedAccepter = await User.findById(accepterId)
    return updatedAccepter
}

exports.addToAcceptersFriendList= async (accepterId, senderId) => {
    const updateInfo = {
        $push : {friends: senderId}
    }
    let updatedAccepter = await User.findByIdAndUpdate(accepterId, updateInfo)
    updatedAccepter = await User.findById(accepterId)
    return updatedAccepter

}

exports.addToSendersFriendList = async (accepterId, senderId) => {
    const updateInfo = {
        $push : {friends: accepterId}
    }
    let updatedSender = await User.findByIdAndUpdate(senderId, updateInfo)
    updatedSender = await User.findById(senderId)
    return updatedSender
}

exports.deleteFriends = async (deleterId, userToDeleteId) => {
    let updatedDeleter = await User.findByIdAndUpdate(deleterId, {$pull : {friends: userToDeleteId}})
    updatedDeleter = await User.findById(deleterId)
    let updateSecondUser = await User.findByIdAndUpdate(userToDeleteId, {$pull: {friends: deleterId}})
    updateSecondUser = await User.findById(userToDeleteId)
    return {
        initiator : updatedDeleter,
        deletedUser : updateSecondUser
    }
}