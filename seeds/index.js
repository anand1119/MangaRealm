const mongoose = require('mongoose');
const Manga = require('../models/manga');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers'); 

mongoose.connect('mongodb://localhost:27017/manga-realm', {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Manga.deleteMany({}); 
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const manga = new Manga({
            author: '64955005c14d1ca9a66bcf0d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iste rerum repellendus quae alias non aut et voluptatibus autem magni obcaecati, id dolores exercitationem. Expedita deserunt aliquid eum non delectus!',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dzgnogwur/image/upload/v1687574481/MangaRealm/wu5ts0f6bu3az9sikt4a.png',
                  filename: 'MangaRealm/wu5ts0f6bu3az9sikt4a'
                },
                {
                  url: 'https://res.cloudinary.com/dzgnogwur/image/upload/v1687574481/MangaRealm/rr0li4dotqfxuojzbvd2.png',
                  filename: 'MangaRealm/rr0li4dotqfxuojzbvd2'
                }
              ]
        })
        await manga.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
