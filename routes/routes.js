// import other routes
const bookingRoutes = require('./bookings');

const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    // // other routes
    bookingRoutes(app, fs);

};

module.exports = appRouter;