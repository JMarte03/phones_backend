/* const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://jmars2003:${password}@fso.zih511p.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fso`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
} 
else if (process.argv.length > 3) {
  const name = process.argv[3];
  const phone = process.argv[4];

  // Add person
  const person = new Person({
    name: name,
    phone: phone,
  });
  person.save().then((result) => {
    console.log(`added ${person.name} ${person.phone} to phonebook`);
    mongoose.connection.close();
  });
}
else {
    // Read people
    Person.find({}).then((result) => {
      console.log('Phonebook:')
      result.forEach((person) => {
        console.log(`${person.name} ${person.phone}`);
      });
      mongoose.connection.close();
    });
} */