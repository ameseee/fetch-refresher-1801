const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public')));

app.locals.title = 'Hedgehog Party';

app.get('/', (request, response) => {
  response.send('Oh hey hedgie hedge');
});

app.get('/api/v1/invites', (request, response) => {
  database('hedgehogs').select()
    .then((hedgehogs) => {
      return response.status(200).json(hedgehogs);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/invites', (request, response) => {
  const hedgehog = request.body;

  for (let requiredParameter of ['name', 'hoglets', 'allergies']) {
    if (!hedgehog[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }

  database('hedgehogs').insert(hedgehog, 'id')
    .then((hedgehogId) => {
      return response.status(201).json({ id: hedgehogId[0] });
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.delete('/api/v1/invites/:id', (request, response) => {
  const { id } = request.params;

  database('hedgehogs').where({ id }).del()
    .then((hedgehog) => {
      if (hedgehog) {
        return response.sendStatus(204);
      } else {
        return response.status(422).json({ error: 'Not Found' });
      }
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
