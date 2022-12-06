const { use } = require('passport')
const userRepo = require('../repository/usersRepo')
const async = require('async')

exports.getUserList = async () => {
    const userList = await userRepo.getUserList()
    return userList
}

exports.updateUserDesc = async (userId, description) => {
    let updateUser = await userRepo.updateUserDesc(userId, description)
    updateUser = await userRepo.findUserById(userId)
    return updateUser
}

exports.createFriendRequest = async(senderId, receiverId) => {
    try{
        const statusCheck = await checkAllFriendLists(senderId, receiverId)
        if(statusCheck === false) { 
            const sender = await addToSentFriendRequests(senderId,receiverId) 
            const receiver = await addToReceivedFriendRequests(senderId,receiverId)
            return {
                sender: sender,
                receiver : receiver
            }
        } 
        if (statusCheck === true) {
            return false // because you cant add him 
        }
    } catch{
        return false
    }
}


async function checkAllFriendLists(senderId, receiverId) {
    const isFriend = await checkInFriendList(senderId, receiverId) // without promises  its not working
    const sentReq = await checkAlreadySentRequest(senderId, receiverId) // but all functions return promises why its not working?
    const receivedReq = await checkAlreadyReceived(senderId, receiverId)
    if(isFriend === true || sentReq === true || receivedReq === true) {
        return true
    } else {
        return false
    }
}

async function checkInFriendList(firstUserId, secondUserId) {
    const isInList = await userRepo.checkInFriendList(firstUserId, secondUserId)
    return isInList
}

async function checkAlreadySentRequest(senderId, receiverId){
    const isInList = await userRepo.checkAlreadySentRequest(senderId, receiverId)
    return isInList
}

async function checkAlreadyReceived(senderId, receiverId) {
    const isInList = await userRepo.checkAlreadyReceived(senderId, receiverId)
    return isInList
}

async function addToSentFriendRequests(senderId, receiverId) {
    const updateSender = await userRepo.newSentFriendRequest(senderId, receiverId)
    return updateSender
}

async function addToReceivedFriendRequests(senderId, receiverId) {
    const updateReceiver = await userRepo.newReceivedFriendRequest(senderId, receiverId)
    return updateReceiver
}


exports.acceptFriendRequest = async (accepterId, senderId) => {
    const requestIsMade = await checkAlreadyReceived(accepterId, senderId) 
    if (requestIsMade === true) { 
        await deleteFromReceivedRequest(accepterId, senderId)
        await deleteFromSentRequest(accepterId, senderId)
        const accepter = await addToAcceptersFriendList(accepterId, senderId)
        const sender = await addToSendersFriendList(accepterId, senderId) // need to check if you invoke it after deleting async series??
        return {
            accepter: accepter,
            sender: sender,
            status: true
        }
    } else {
        return {
            status: false
        }
    }
}


async function deleteFromSentRequest(accepterId, senderId) {
    await userRepo.deleteFromSentRequest(accepterId, senderId)
}

async function deleteFromReceivedRequest(accepterId, senderId) {
    await userRepo.deleteFromReceivedRequest(accepterId, senderId)
}

async function addToAcceptersFriendList(accepterId, senderId) {
    const accepter = await userRepo.addToAcceptersFriendList(accepterId, senderId)
    return accepter
}

async function addToSendersFriendList(accepterId, senderId) {
    const sender = await userRepo.addToSendersFriendList(accepterId, senderId)
    return sender
}


exports.deleteFriend = async (deleterId, userToDeleteId) => {
    try{
        const isFriend = await checkInFriendList(deleterId, userToDeleteId)
        if(isFriend === true) {
            const users = await deleteFromFriendList(deleterId, userToDeleteId)
            return users
        }
        else{
            return false
        }
    }
    catch {
        return false
    }
}

async function deleteFromFriendList(deleterId, userToDeleteId) {
    const users = await userRepo.deleteFriends(deleterId, userToDeleteId) 
    return users
}