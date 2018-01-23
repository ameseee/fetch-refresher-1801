const getHedgehogs = () => {
  $('#hedgehog-info').html('');
  return fetch('http://localhost:3000/api/v1/invites')
    .then((response) => handleResponse(response))
    .then((hedgehogs) => getEachHedgehog(hedgehogs))
    .catch((error) => console.error({ error }))
};

const handleResponse = (response) => {
  return response.json()
    .then(json => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusText: response.statusText,
          ...json
        };
        return Promise.reject(error);
      }
      return json;
    });
};

const getEachHedgehog = (hedgehogs) => {
  return hedgehogs.forEach((hedgehog) => {
    renderHedgehog(hedgehog)
  });
};

const renderHedgehog = (hedgehog) => {
  $('#hedgehog-info').append(`
    <article class="invited-hedgehog">
      <p class="name">${hedgehog.name}</p>
      <p class="hoglet-number">${hedgehog.hoglets}</p>
      <p class="allergies">${hedgehog.allergies}</p>
      <button id="${hedgehog.id}" class="uninvite-btn">
        uninvite
      </button>
    </article>
  `);
};

const storeNewHedgehog = (event) => {
  event.preventDefault();
  let name = $('#name').val();
  let hoglets = $('#hoglets').val();
  let allergies = $('#allergies').val();

  postNewHedgehog(name, hoglets, allergies);
  clearInputs();
};

const postNewHedgehog = (name, hoglets, allergies) => {
  fetch('http://localhost:3000/api/v1/invites',
    newHedgehogPayload({ name, hoglets, allergies }))
    .then((response) => handleResponse(response))
    .then(() => getHedgehogs())
    .catch((error) => console.error({ error }))
};

const newHedgehogPayload = (body) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
};

const clearInputs = () => {
  $('#name').val('');
  $('#hoglets').val('');
  $('#allergies').val('');
};

const uninviteHedgehog = (event) => {
  event.target.parentNode.remove()
  deleteHedgehog(event.target.id);
};

const deleteHedgehog = (hedgehogId) => {
  fetch(`http://localhost:3000/api/v1/invites/${hedgehogId}`, {
    method: 'DELETE'
  })
  .then((response) => handleResponse(response))
  .catch((error) => console.error({ error }))
};

$(document).ready(() => {
  getHedgehogs();
});

$('#invite-btn').on('click', storeNewHedgehog);

$('#invited-hedgehogs-info').on('click', '.uninvite-btn', uninviteHedgehog);

// PRE-RE-FACTOR
// const getHedgehogs = () => {
//   $('#hedgehog-info').html('');
//   return fetch('http://localhost:3000/api/v1/invites')
//     .then(response => response.json())
//     .then(hedgehogs => {
//       return hedgehogs.forEach(hedgehog => {
//         renderHedgehog(hedgehog)
//       });
//     })
//     .catch((error) => console.error({ error }))
// };

// PRE-RE-FACTOR
// const storeNewHedgehog = (event) => {
//   event.preventDefault();
//   let name = $('#name').val();
//   let hoglets = $('#hoglets').val();
//   let allergies = $('#allergies').val();
//
//   postNewHedgehog(name, hoglets, allergies);
//   $('#name').val('');
//   $('#hoglets').val('');
//   $('#allergies').val('');
// };

// PRE-RE-FACTOR
// const postNewHedgehog = (name, hoglets, allergies) => {
//   fetch('http://localhost:3000/api/v1/invites',
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(body)
//     })
//     .then(() => getHedgehogs())
//     .catch((error) => console.error({ error }))
// };
