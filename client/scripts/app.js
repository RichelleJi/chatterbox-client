// YOUR CODE HERE:
let app = {};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  this.fetch();
  setInterval(this.fetch.bind(this), 10000);

  
};

app.send = (message) => {
  

  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = () => {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {'order' : '-createdAt'},
    // contentType: 'application/json',
    success: function (data) {
      console.log('dataFetched');
      // console.log(data.results);
      app.clearMessages();
      app.renderAllMessages(data.results);

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.clearMessages = () => {
  $('#chats').children().remove();
};


app.renderAllMessages = (data) => {
  for(let val of data) {
    app.renderMessage(val);
  }
};

app.renderMessage = (msg) => {
  let userNode = $('<p>', {'class' : 'userName user-' + msg.username}).text(msg.username);
  let childNode = $('<div>', {'class':'chatMessage ' + 'room-'+msg.roomname}).text(msg.text);
  userNode.append(childNode);
  $('#chats').append(userNode);
};

app.renderRoom = (roomName) => {
  let roomNode = $('<div>', {'class':'chatRoom chatRoomName-' + roomName}).text(roomName)
  $('#roomSelect').append(roomNode);
}













$('document').ready(function() {
  // console.log('DOCUMENT READY');
  app.init();

});









