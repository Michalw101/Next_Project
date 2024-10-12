const mongoose = require('./DB');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const usersSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String, 
    content: String
})

usersSchema.plugin(AutoIncrement, { inc_field: 'id' });
const usersModel = mongoose.model("slides", usersSchema);



async function getUser(id) {
    try {
        const result = await usersModel.find({ id: id });
        console.log(result);
        if (!result || result.length == 0)
            throw new Error("cannot find slide");
        return result[0];
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
module.export = { getUser }