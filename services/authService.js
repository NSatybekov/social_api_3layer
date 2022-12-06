const mongoose = require('mongoose')
const userRepo = require('../repository/usersRepo')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

exports.findUser = async (params) => {
   const user = await userRepo.findUser(params)
   if(!user) {
    const response = {
        status: 404,
        message: 'there is no user with this data'
    }
    return response 
   }
   else{ 
    const response = {
        status: 200,
        message: 'We found user with this username',
        user: user
    }
    return response
   }
}

exports.findUserById = async (id) => {
    const user = await userRepo.findUserById(id)
    if(!user) {
     const response = {
         status: 404,
         message: 'there is no user with this data'
     }
     return response 
    }
    else{ 
     const response = {
         status: 200,
         message: 'We found user with this username',
         user: user
     }
     return response
    }
 } // return remake to new function that will throw info without func

exports.registerUser = async (username, password) => {
    try{
        const saltHash = hashPassword(password)
        const newUserData = {
            username: username,
            salt: saltHash.salt,
            hash: saltHash.hash
        }
        const registeredUser = await userRepo.registerUser(newUserData)
        const token = generateToken(registeredUser)
        return {
            user: registeredUser,
            token: token
        }
    } catch {
        // how to catch and handle errors
    }
}


exports.loginUser = async (username, password) => {
    try{
        const user = await userRepo.findUser(username)
        const userIsValid = validPassword(password, user.hash, user.salt)
            if(userIsValid) {
                const token = generateToken(user)
                return {
                    status: 200,
                    user: user, 
                    token: token
                }
            } else {
                return {
                    status: 403,
                    message: 'Password is not correct'
                }
            }
    } catch{
// what to catch??? how
    }
}

// FRIENDS ETC ROUTER



function generateToken(userInfo) {
      return  jwt.sign({userInfo}, process.env.SECRET_KEY, {expiresIn: '1h'})
}

function hashPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };

}

function validPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
