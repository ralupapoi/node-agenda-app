var allPersons = [];
var editPersonId;

var API_URL = {
    //ADD: 'data/add.json'
    CREATE: '...',
    READ: '...',
    ADD: 'users/add',
    UPDATE: 'users/update',
    DELETE: 'users/delete'
};
var API_METHOD = {
    //ADD: 'GET'
    CREATE: 'POST',
    READ: 'GET',
    ADD: 'POST',
    UPDATE: 'PUT',
    DELETE: 'DELETE'
}

fetch('data/persons.json').then(function (r) {
    return r.json();
}).then(function (persons) {
    console.log('all persons', persons);
    allPersons = persons;
    display(persons);
});

function display(persons) {
    var list = persons.map(function (person) {
        return `<tr data-id="${person.id}">
            <td>${person.firstName}</td>
            <td>${person.lastName}</td>
            <td>${person.phone}</td>
            <td>
                <a href="#" class="delete">&#10006;</a>
                <a href="#" class="edit">&#9998;</a>
            </td>
        </tr>`;
    });

    document.querySelector('#agenda tbody').innerHTML = list.join('');
}

function savePerson() {
    var firstName = document.querySelector('[name=firstName]').value;
    var lastName = document.querySelector('[name=lastName]').value;
    var phone = document.querySelector('[name=phone]').value;


    if (editPersonId) {
        submitEditPerson(editPersonId, firstName, lastName, phone);
    } else {
        submitNewPerson(firstName, lastName, phone);
    }
}

function submitNewPerson(firstName, lastName, phone) {
    var body = null;
    const method = API_METHOD.ADD;
    if (API_METHOD.ADD === 'POST') {
        body = JSON.stringify({
            firstName,
            lastName,
            phone
        });
    }
    fetch(API_URL.ADD, {
        method,
        body,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (r) {
        return r.json();
    }).then(function (status) {
        if (status.success) {
            inlineAddPerson(status.id, firstName, lastName, phone);
        } else {
            console.warn('not saved!', status);
        }
    })
}


function inlineAddPerson(id, firstName, lastName, phone) {
    allPersons.push({
        id,
        firstName,
        lastName,
        phone
    });
    display(allPersons);
}

function inlineDeletePerson(id) {
    console.warn('please refresh', id);
    allPersons = allPersons.filter(function (person) {
        return person.id != id;
    });
    display(allPersons);
}

function deletePerson(id) {
    var body = null;
    if (API_METHOD.DELETE === 'DELETE') {
        body = JSON.stringify({ id });
    }
    fetch(API_URL.DELETE, {
        method: API_METHOD.DELETE,
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (r) {
        return r.json();

    }).then(function (status) {
        if (status.success) {
            inlineDeletePerson(id);
        } else {
            console.warn('not removed!', status);
        }
    })
}

function submitEditPerson(id, firstName, lastName, phone) {
    var body = null;
    const method = API_METHOD.UPDATE;
    if (API_METHOD.UPDATE === 'PUT') {
        body = JSON.stringify({
            id,
            firstName,
            lastName,
            phone
        });
    }
    fetch(API_URL.UPDATE, {
        method,
        body,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (r) {
        return r.json();
    }).then(function (status) {
        if (status.success) {
            console.log('reload here');
            inlineEditPerson(id, firstName, lastName, phone);
        } else {
            console.warn('not saved!', status);
        }
    })
}

function inlineEditPerson(id, firstName, lastName, phone) {
    window.location.reload();
}

const editPerson = function (id) {
    var person = allPersons.find(function (p) {
        return p.id == id
    });
    document.querySelector('[name=firstName]').value = person.firstName;
    document.querySelector('[name=lastName]').value = person.lastName;
    document.querySelector('[name=phone]').value = person.phone;
    editPersonId = id;
}

function initEvents() {
    const tbody = document.querySelector('#agenda tbody');
    tbody.addEventListener('click', function (e) {
        if (e.target.className == 'delete') {
            const tr = e.target.parentNode.parentNode;
            const id = tr.getAttribute('data-id');
            deletePerson(id);
        }
        else if (e.target.className == 'edit') {
            const tr = e.target.parentNode.parentNode;
            const id = tr.getAttribute('data-id');
            editPerson(id);
        }
    });
}

initEvents();
