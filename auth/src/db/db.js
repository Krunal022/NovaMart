const mongoose = require('mongoose');

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(() => {
            console.log("Connected to database ✅");
        });
    } catch (error) {
        console.log("Error connecting to database ⚠️:", error);
    }
}

module.exports = connectToDB;