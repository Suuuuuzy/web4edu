document.addEventListener('DOMContentLoaded', function () {
  if (window.location.hash === '#messages') {
    getMessages();
  }
  else {
    getJobListings();
  }
});

document.getElementById('home').addEventListener('click', function (event) {
  getJobListings();
});
document.getElementById('about').addEventListener('click', function (event) {
  getJobListings();
});
document.getElementById('contact').addEventListener('click', function (event) {
  getJobListings();
});
document.getElementById('messages').addEventListener('click', function (event) {
  getMessages();
});
document.getElementById('searchButton').addEventListener('click', function (event) {
  handleSearch();
});
document.getElementById('searchForm').addEventListener('submit', function (event) {
  handleSearch();
});

// ::Deprecated:: remove at next version
function loadMessageBoardJS(){
    let utilJS = window.utilsJS || {};
    let script = document.createElement('script');
    script.src = utilJS.url;
    document.body.appendChild(script);
};
/**
 * Handle search functionality
 */
function handleSearch() {
  const searchQuery = document.getElementById('searchInput').value;
  fetch(`/search?q=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
          document.getElementById('searchResults').textContent = data.results;
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

/**
 * Handle job listings functionality
 */
function getJobListings() {
  fetch('/jobs')
      .then(response => response.json())
      .then(data => { 
          document.getElementById('mainboard').innerHTML = DOMPurify.sanitize(data.messages);
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

/**
 * Handle messages functionality
 */
async function getMessages() {
  const mainboard = document.getElementById('mainboard');
  mainboard.innerHTML = '<h2>Message Board</h2>';

  try {
    const countResponse = await fetch('/messages?count=1');
    const countData = await countResponse.json();
    const messageCount = countData.count;
    let messages = "";

    for (let i = 0; i < messageCount; i++) {
      const response = await fetch(`/messages?id=${i}`);
      const data = await response.text();
      const message = data.split(':::');
      messages += renderMessageBoard(message[0], message[1], message[2]).outerHTML;
    }

    // Add form for posting new messages
    mainboard.innerHTML += messages;
    addMessageForm();
    loadMessageBoardJS();


  } catch (error) {
    console.error('Error:', error);
    mainboard.innerHTML += '<p>Could not load messages.</p>';
  }
}

function renderMessageBoard(user, message, date) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = DOMPurify.sanitize(`
      <div class="message-header">
        <strong>${user}</strong>
        <span class="message-date">${new Date(date).toLocaleString()}</span>
      </div>
      <p>${message}</p>
    `);
    return messageElement;
}

function addMessageForm() {
    const mainboard = document.getElementById('mainboard');
    const formHTML = `
      <form id="message-form" class="input-container">
          <h3>Post a New Message</h3>
          <label for="userName">Name:</label>
          <input type="text" id="userName" name="userName" required>
          <label for="messageContent">Message:</label>
          <textarea id="messageContent" name="messageContent" rows="4" required></textarea>
          <input type="submit" value="Post Message">
      </form>
    `;
    mainboard.insertAdjacentHTML('beforeend', formHTML);

    document.getElementById('message-form').addEventListener('submit', async function(event) {
      event.preventDefault();
      const name = document.getElementById('userName').value;
      const message = document.getElementById('messageContent').value;

      try {
        await fetch('/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, message }),
        });
        getMessages(); // Refresh the message board
      } catch (error) {
        console.error('Error posting message:', error);
      }
    });
}
    
