// Onze lokale 'in memory database'. Later gaan we deze naar een
// aparte module (= apart bestand) verplaatsen.
let database = {
  users: [
    {
      id: 0,
      firstName: 'Hendrik',
      lastName: 'van Dam',
      emailAddress: 'hvd@server.nl',
      street: 'Lovensdijkstraat',
      city: 'Breda',
      isActive: true,
      password: 'Hendrik123',
      phoneNumber: '06873589325'

    },
    {
      id: 1,
      firstName: 'Stijn',
      lastName: 'Robben',
      emailAddress: 's.robben@server.nl',
      street: 'Hogeschoollaan',
      city: 'Breda',
      isActive: false,
      password: 'Wachtwoord123',
      phoneNumber: '06942126952'
    }
  ],
  meals: [
    {
      id: 0,
      name: 'Spaghetti',
      description: 'Geweldige italiaanse spaghetti',
      isActive: true,
      isVega: false,
      isVegan: false,
      isToTakeHome: false,
      dateTime: '2023-04-06T10:27:15.849Z',
      maxAmountOfParticipants: 6,
      price: 6.75,
      imageUrl: 'https://www.dekeukenvanlidl.be/var/site/storage/images/_aliases/960x960/0/8/2/7/757280-6-dut-BE/Spaghetti.jpg',
      allergenes: ['gluten', 'noten', 'lactose'],
      cook: [1],
      participants: [0]
    }
  ],

  // Ieder nieuw item in db krijgt 'autoincrement' index.
  // Je moet die wel zelf toevoegen!
  index: 2
};

module.exports = database;
// module.exports = database.index;
