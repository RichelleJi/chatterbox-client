// YOUR CODE HERE:
let app = {};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {

};

app.send = () => {
  var message = {
    username: 'Mel Brooks',
    text: 'It\'s good to be the king',
    roomname: 'lobby'
  };

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
    // data: JSON.stringify(message),
    // contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
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

app.renderMessage = (msg) => {
  let childNode = $('<div>', {'class':'chatMessage ' + 'room-'+msg.roomname}).text(msg.text);
  $('#chats').append(childNode);
};

app.renderRoom = (roomName) => {
  let roomNode = $('<div>', {'class':'chatRoom chatRoomName-' + roomName}).text(roomName)
  $('#roomSelect').append(roomNode);
}























