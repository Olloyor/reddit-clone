// GENERATES UNIQUE ID
// V1 FOR TIME
const {v1 , v5} = require('uuid')

module.exports = function (pwdOrEmail) {

    return v5(pwdOrEmail, v1())
}
