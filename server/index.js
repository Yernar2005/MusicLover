require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const mongoose     = require('mongoose');


const musicRoutes = require('./router/music-route');




const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));


// connectMusicDB().then( ()=> console.log('Connected to DB')).catch(e => console.log("Error in connectDB: ", e));
app.use(express.json())
app.use('/api/music', musicRoutes);

app.use(express.json());
app.use(cookieParser());






const router          = require('./router/index.js');
const errorMiddleware = require('./middlewares/error-middleware');




app.use('/api', router);
app.use('/music', musicRoutes);
app.use(errorMiddleware);





const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(process.env.PORT || 5000, () =>
            console.log(`Server started on port ${process.env.PORT || 5000}`)
        );
    } catch (e) {
        console.error('MongoDB connection error', e);
    }
};

start();