require('dotenv').config();
const mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI'];
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

let Person;
const Schema = mongoose.Schema;
const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  let johnConstantine = new Person({name: 'John Constantine', age: 40, favoriteFoods: ["alcohol", "turkey"]});

  johnConstantine.save(function(err, data) {
    if (err)
      return console.error(err);
    done(null, data);
  });
};

let arrayOfPeople = [
    {name: 'John Constantine', age: 40, favoriteFoods: ["alcohol", "turkey", "Red Thai Curry"]},
    {name: 'Mariah Carey', age: 51, favoriteFoods: ["cookies", "soup", "wine"]},
    {name: 'Gary Green', age: 36, favoriteFoods: ["candy", "magic", "corndogs"]}
  ];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, people) {
    if (err)
      return console.error(err);
    done(null, people);
  });
};

let personName = 'Gary Green';

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, function(err, name) {
    if (err)
      return console.error(err);
    done(null, name);
  });
};

let food = 'cookies';

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, function(err, food) {
    if (err)
      return console.error(err);
    done(null, food);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, function(err, id) {
    if (err)
      return console.error(err);
    done(null, id);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, function(err, id) {
    if (err)
      return console.error(err);
    id.favoriteFoods.push(foodToAdd);

    id.save(function(err, newPerson) {
      if (err)
        return console.error(err);
      done(null, newPerson);
    })
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({ name: personName }, { age: ageToSet }, { new: true }, function(err, name) {
    if (err)
      return console.error(err);
    done(null, name);
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function(err, name) {
    if (err)
      return console.error(err);
    done(null, name);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, function(err, name) {
    if (err)
      return console.error(err);
    done(null, name);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({ favoriteFoods: foodToSearch })
  .sort({ name: 1 })
  .limit(2)
  .select({ age: 0 })
  .exec(function(err, data) {
    if (err)
      return console.error(err);
    done(null, data);
  });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
