import express from 'express';

const app = express();

app.get('/users', (request, response)=>{
  response.json(['Elaine', 'Ilton', 'Caio', 'Nicolle', 'Daniel']);
});

app.listen(3333);