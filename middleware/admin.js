const ApiResponse = require('../ApiResponse');
const {User} = require('../modules/user');

module.exports = async function (req, res, next) {
    // 401 Unauthorized
    // 403 Forbidden
    // const user = await User.findOne({_id: req.user._id})
    console.log(req.user)
    if (!req.user) return res.status(401).send(new ApiResponse('Unauthorized', false));

    if (!req.user.isAdmin) return res.status(403).send(new ApiResponse('Access denied.', false));

    next();
}
