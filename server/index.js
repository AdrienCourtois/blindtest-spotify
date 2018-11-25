const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({origin: 'http://localhost:4200'}));

const user_router = require('./router/login');
app.use('/user', user_router);

const game_router = require('./router/game');
app.use('/game', game_router);

const theme_router = require('./router/theme');
app.use('/theme', theme_router);


app.listen(process.env.PORT || 5000, () => console.log('Server started, listening on port 5000'));