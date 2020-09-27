const jwt = require('jsonwebtoken');
const ApiResponse = require('../ApiResponse');
const {User} = require('../modules/user');
const {tokenExpTime, tokenType, secretKey} = require("../utils/envs")


module.exports = async function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send(new ApiResponse('Access denied. No token provided.', false));

    if (!token.startsWith(tokenType + " ")) return res.status(400).send(new ApiResponse('Invalid token.', false));
    try {
        const pureToken = token.substring(tokenType.length + 1, token.length)
        const decoded = await jwt.verify(pureToken, secretKey, {header: {typ: "MY_JWT", kid: "MY_KID"}});
        // console.log(decoded)
        if (!decoded.exp) {
            return res.status(400).send(new ApiResponse('Token Expired.', false));
        }
        if ((decoded.exp - decoded.iat) !== parseInt(tokenExpTime)) {
            return res.status(400).send(new ApiResponse("Token isn't valid.", false));
        }

        const isUserHave = await User.findOne({uuid: decoded.uuid})
        if (!isUserHave) {
            return res.status(400).send(new ApiResponse('Token Expired.', false));
        }
        req.userToken = decoded;
        req.user = isUserHave;
        // console.log(req.userToken);
        // console.log(req.user);
        next();
    } catch (ex) {
        console.log(ex.name)
        if (ex.name === "TokenExpiredError") {
            res.status(400).send(new ApiResponse('Token Expired.', false));
        }
        res.status(400).send(new ApiResponse(ex.message, false));
    }
}
