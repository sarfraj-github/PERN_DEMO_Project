const jwt = require("jsonwebtoken");
const Auth = require("../models/user.model");

const fetchUser = async (req , res , next) => {

    const token = req.headers.authorization;
    console.log(`token ====>>> ${token}`);
    // ager token nhi he to  ye error show hoga.
    if(!token){
        return res.status(401).send({ errors : "Please Authenticate..!!"});
    }
    
    try {
        const user = jwt.verify(token , process.env.JWT_SECRET_KEY);
        console.log(`fetch--user----> ${JSON.stringify(user)}`);
        
        if (user) {
            let userRec = null;
            userRec = await Auth.findUserById(user.user_id);     // --> ye function user search krega by user id
            console.log(`useRec =====> ${JSON.stringify(userRec)}`);
            
            if(!userRec) {
                return res.status(400).json({ errors: "Invalid User" });
            }

            req["userinfo"] = user;
            next();

        } else {
            return res.status(400).json({ errors: "Invalid User" });
        }

    } catch (error) {
        return res.status(401).send({ errors : "Please Authenticate..!!"});
    }
}

module.exports = { fetchUser }
