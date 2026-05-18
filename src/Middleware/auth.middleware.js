const jwt = require('jsonwebtoken');

const authArtist = async(req, res, next)=> {

    const token = req.cookies.token

    if (!token){
        return res.status(401).json({message:"Unauthorize"});
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        if(decode.role !== "artist"){
            return res.status(403).json({message:"You don't have access"})
        }

        req.user = decode 
        next()
    }
    catch(err){
        console.log(err)
        return res.status(401).json({message:"Unauthorize"})
    }
}

module.exports = {authArtist}