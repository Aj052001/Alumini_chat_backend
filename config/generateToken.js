const jwt = require('jsonwebtoken')
const KEY = process.env.JWT_SECRET;

//generate token function
const generateToken = (id)=>{
     return jwt.sign({id},KEY,{
        expiresIn :"30d"
     })
}

module.exports = {generateToken}