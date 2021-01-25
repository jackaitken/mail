document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#compose-form').onsubmit = event => {
    event.preventDefault();
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox(sent);
    });
  }

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(result => {
    result.forEach(function(object) {
      let id = object.id;
      let sender = object.sender;
      let subject = object.subject;
      let timestamp = object.timestamp;
      let read = object.read
      let div = document.createElement('div')

      // Adds to the innerHTML of the above created div
      div.innerHTML = 
      `
      <div class="list-group" style="padding: 5px;">
        <a href="/emails/${id}" id="single-email" class="list-group-item list-group-item-action flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${sender}</h5>
            <small class="text-muted" id="read">${read}</small>
          </div>
          <p class="mb-1">${subject}</p>
          <small class="text-muted">${timestamp}</small>
        </a>
      </div>
      `
      // Appends the above inside our new div
      document.querySelector('#emails-view').append(div);
      div.addEventListener('click', function () {
        console.log(`CLICKED ON ${id}`)
        document.querySelector('#clicked-email-view').style.display = 'block';
        document.querySelector('#emails-view').style.display = 'none';
      })
    })
  });
  document.querySelector('#(mailbox)')
}