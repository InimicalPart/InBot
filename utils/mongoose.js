const mongoose = require('mongoose');
// const mongoCurrency = require('discord-mongo-currency')

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };

        mongoose.connect(process.env.MONGODB_SRV, dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to database');
        });

        mongoose.connection.on('error', (err) => {
            console.error(err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });

        // mongoCurrency.connect(process.env.MONGODB_SRV) | before i do this i want to try making the models myself
    }

}
