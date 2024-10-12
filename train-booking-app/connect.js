// const mongoose = require('./DB');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// const usersSchema = new mongoose.Schema({
//     id: { type: Number, unique: true },
//     name: String, 
//     content: String
// });

// let usersModel;
// if (mongoose.models.users) {
//     usersModel = mongoose.model('users');
// } else {
//     usersSchema.plugin(AutoIncrement, { inc_field: 'id' });
//     usersModel = mongoose.model('users', usersSchema);
// }

// async function getUser(id) {
//     try {
//         const result = await usersModel.find({ id: id });
//         console.log(result);
//         if (!result || result.length == 0) throw new Error("cannot find slide");
//         return result[0];
//     } catch (error) {
//         console.error("Error:", error);
//         throw error;
//     }
// }

// module.exports = { getUser };


const mongoose = require('mongoose'); // או import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String,
    content: String,
});

let usersModel;
console.log(mongoose.models);
if (mongoose.models) {
    if (mongoose.models.users)
        usersModel = mongoose.models.users;
} else {
    usersModel = mongoose.model('users', usersSchema);
}

module.exports = usersModel;
