const authService = require('../services/authService')

exports.index = (req,res) => {
    res.send('Main info not implemented yet')
}
// it needs only to spawn method that first - will check if user exist - if it returns false (user not in base ) - will invoke 
// registration function that will use salt hash etc from repository module

exports.registration_post = async (req,res,next) => {
    const userData = await authService.findUser(req.body.username)
    if(userData.status === 404) {
        const registrationData = await authService.registerUser(req.body.username, req.body.password)
        res.json({
            user: registrationData.user,
            token: registrationData.token
        })
    } 
    if(userData.status === 200) {
        res.status(400).send('Cannot register already in base please login')
    }

}


exports.login_post = async function (req,res) {
    const userData = await authService.findUser(req.body.username)
    if(userData.status === 404) {
        res.status(404).send('No such user please register')
    } 
    if(userData.status === 200) {
        const userData = await authService.loginUser(req.body.username, req.body.password)
            if(userData.status === 200) {
                res.json({
                    token: userData.token,
                    user: userData.user
                })
            }
            else {
                res.status(401).send('incorrect login info')
            }
    }
}
