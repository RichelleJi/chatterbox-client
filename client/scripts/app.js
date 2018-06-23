// YOUR CODE HERE:
let app = {};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
app.nsfxss = false;
app.friends = {};

app.init = function() {
  app.prevRender = false;
  this.fetch();
  setInterval(this.fetch.bind(this), 1000);

    let urlParams = {};
    let parts = window.location.search.replace(
      /[?&]+([^=&]+)=([^&]*)/gi, 
      function(m,key,value) {
        urlParams[key] = value;
      });
    app.username = urlParams.username;
};

app.send = (message) => {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.log(data);
    },

    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = () => {
  if(!app.prevRender){
    app.prevRender = true;
    let currentRoom = $('#roomInput').val();
    let searchParams = {'order' : '-createdAt'}
    if(currentRoom !== ''){
      console.log(currentRoom);
      searchParams.where = {'roomname': currentRoom}
    } else {
      currentRoom = 'Lobby'
    }

    $.ajax({
      url: app.server,
      type: 'GET',
      data: searchParams,
      // contentType: 'application/json',
      success: function (data) {
        console.log('dataFetched');
        app.prevRender = false;
        console.log(data);
        if(data.results.length !== undefined && app.results !== undefined) {
          if(data.results.length !== 0 && data.results.length == app.results.length && data.results[0].text == app.results[0].text) {
            console.log('Matching Data, doing nothing')
          } else {
            console.log('new data. rerendering page')
            app.results = data.results;
            app.clearMessages();
            app.renderAllMessages(data.results);
          }
        } else {
            app.results = data.results;
            app.clearMessages();
            app.renderAllMessages(data.results);
        }
      },
      error: function (data) {
        app.prevRender = false;
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
};

app.clearMessages = () => {
  $('#chats').children().remove();
};


app.renderAllMessages = (data) => {
  for(let val of data) {
    if(!app.nsfxss){
      app.renderMessage(val);
    }else{
      app.nsfXssRenderMessage(val);
    }
  }
};

app.renderMessage = (msg) => {

  // var node = '<div class = chatMessage> room-' + msg.roomname 
  let messageContainer = $('<div>', {'class' : 'messageContainer'});
  let userNode = $('<a>', {'class' : 'userName user-' + msg.username.replace(/[^\w\s]/gi, '').replace(' ', '')}).text('@: ' + msg.username);
  userNode.click(function(input){
    // console.log(input.target.className.split(' ')[1]);
    var targetClass = input.target.className.split(' ')[1];
    if(app.friends[targetClass]) {
      app.friends[targetClass] = false;
      $('.' + targetClass).css({color: 'black'})
    } else {
      app.friends[targetClass] = true;
      $('.' + targetClass).css({color: 'green'});
    }

  });
  let childNode = $('<div>', {'class':'chatMessage ' + 'room-'+msg.roomname}).text(msg.text);
  messageContainer.append(userNode);
  messageContainer.append(childNode);
  $('#chats').append(messageContainer);
  // $('#chats').append(childNode);
};

app.nsfXssRenderMessage = (msg) => {
  let messageContainer = $('<div>', {'class' : 'messageContainer'});
  let userNode = $('<a>', {'class' : 'userName user-' + msg.username.replace(/[^\w\s]/gi, '').replace(' ', '')}).html(msg.username);
  let childNode = $('<div>', {'class':'chatMessage ' + 'room-'+msg.roomname}).html(msg.text);
  messageContainer.append(userNode);
  messageContainer.append(childNode);
  $('#chats').append(messageContainer);
};

app.renderRoom = (roomName) => {
  let roomNode = $('<div>', {'class':'chatRoom chatRoomName-' + roomName}).text(roomName)
  $('#roomSelect').append(roomNode);
}


$('document').ready(function() {
  app.init();
  
  $('#submit').click(function(input) {
    
    let msgText = $('#messageInput').val();
    let roomText = $('#roomInput').val();
    if(roomText === '') {
      roomText = 'Lobby';
    }
    let messageBuilder = {
      username:app.username,
      text: msgText,
      roomname: roomText
    };
    app.send(messageBuilder);
    return false;
  
  });

  $('#nsfxss').click(function(input){
    if(!app.nsfxss){
      app.nsfxss = true;
      $('#nsfxss').text('BACK TO SAFETY');
      app.clearMessages();
      app.renderAllMessages(app.results);
    } else {
      app.nsfxss = false;
      $('#nsfxss').text('UNSAFE MODE');
      app.clearMessages();
      app.renderAllMessages(app.results);
    }
  })

});









