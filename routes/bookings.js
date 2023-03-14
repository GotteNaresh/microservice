
const bookingRoutes = (app, fs) => {

    // variables
    const dataPath = './data/bookings.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // A Method to find all the bookings list
    app.get('/bookings', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // A Method to find the available rooms on a given date
    app.get('/getBookingsByDate/:date', (req, res) => {
        const bookingDate = req.params["date"];
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            const fileData = JSON.parse(data);
            const bookingData = Object.values(fileData);
            const result = bookingData.filter((booking) => booking.date === bookingDate);
            res.send(JSON.stringify(result, null, 2));
        });
    });

    // A Method to find all the bookings for given guest name;
    app.get('/getBookingsByGuestName/:guestname', (req, res) => {
        const guestName = req.params["guestname"];
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            const fileData = JSON.parse(data);
            const bookingData = Object.values(fileData);
            console.log("bookingData1", bookingData);
            const result = bookingData.filter((booking) => booking.guestName === guestName);
            res.send(JSON.stringify(result, null, 2));
        });
    });

    // CREATE
    app.post('/addBooking', (req, res) => {

        readFile(data => {
            // Note: this isn't ideal for production use. 
            // ideally, use something like a UUID or other GUID for a unique ID value
            const newBookingId = Date.now().toString();

            // add the new bookings
            data[newBookingId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new booking added');
            });
        },
            true);
    });


    // UPDATE
    app.put('/bookings/:id', (req, res) => {

        readFile(data => {

            // add the new booking
            const bookingId = req.params["id"];
            data[bookingId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`booking id:${bookingId} updated`);
            });
        },
            true);
    });


    // DELETE
    app.delete('/bookings/:id', (req, res) => {

        readFile(data => {

            // delete the booking
            const bookingId = req.params["id"];
            delete data[bookingId];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`booking id:${bookingId} removed`);
            });
        },
            true);
    });
};

module.exports = bookingRoutes;
