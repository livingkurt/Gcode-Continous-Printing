
const mongoose = require('mongoose');
const { Schema } = mongoose;

const petSchema = new Schema({
  pet_name: {
    type: String,
  },
  species: String,
  breed: String,
  sex: String,
  weight: Number,
  age: Number,
  location: String,
  fee: Number,
  image: Object
});

const Pet = mongoose.model('Pet', petSchema);


module.exports = Pet;