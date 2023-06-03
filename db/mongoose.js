const mongoose = require("mongoose");
const config = require('config');
(async () => {
try {
    await mongoose.connect(config.get('db'))
    console.log(config.get('db'));
} catch (err) {
    console.log(err.message);
}
})()