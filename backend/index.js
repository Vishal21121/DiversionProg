const connectToMongo = require('./db');
const express = require('express')

connectToMongo();
var cors = require('cors')
const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/answer',require('./routes/answer'));
app.use('/api/question',require('./routes/questions'));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})