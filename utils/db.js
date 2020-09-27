const mongoose = require('mongoose');
const {database} = require("./envs")

module.exports = function() {
    mongoose.connect(database,{useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log(`MongoBD Connected`))
        .catch(err => console.log(err));
}
