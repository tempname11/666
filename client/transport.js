import io from 'socket.io-client';

/* eslint no-console: 0 */
const socket = io( window.location.hostname + ':' + DATAPORT );
const EXCHANGE_TIMEOUT = 3000;
console.log('transport: socket connection');

function assert(condition) {
  if (!condition) {
    throw new Error('Assertion failed!');
  }
}

export function onTopRooms(handler) {
  socket.on('broadcast:topRooms', data => {
    assert(data.rooms instanceof Array);
    data.rooms.forEach(room => {
      assert(typeof room.roomID === 'string');
      assert(typeof room.name === 'string');
      assert(typeof room.users === 'number');
      assert(typeof room.rating === 'number');
    });
    handler(data);
  });
}

export function onMessage(handler) {
  socket.on('roomcast:message', data => {
    assert(typeof data.roomID === 'string');
    assert(typeof data.userID === 'string');
    assert(typeof data.messageID === 'string');
    assert(typeof data.text === 'string');
    assert(typeof data.time === 'number');
    handler(data);
  });
}

export function onJoinUser(handler) {
  socket.on('roomcast:joinUser', data => {
    assert(typeof data.roomID === 'string');
    assert(typeof data.userID === 'string');
    assert(typeof data.avatar === 'string');
    assert(typeof data.nick === 'string');
    handler(data);
  });
}

export function onLeaveUser(handler) {
  socket.on('roomcast:leaveUser', data => {
    assert(typeof data.roomID === 'string');
    assert(typeof data.userID === 'string');
    handler(data);
  });
}

let exchangeCount = 0;
function getExchangeID() {
  return exchangeCount++;
}

export function joinRoom(roomID) {
  const exchangeID = getExchangeID();
  socket.emit('client-request:joinRoom', {
    exchangeID,
    data: {
      roomID,
    },
  });

  return new Promise( (resolve, reject) => {
    socket.once(`server-response:joinRoom@${exchangeID}`, res => {
      assert(res instanceof Object);
      assert(res.data instanceof Object);
      assert(res.data.identity instanceof Object);
      assert(typeof res.data.identity.userID === 'string');
      assert(typeof res.data.identity.avatar === 'string');
      assert(typeof res.data.identity.nick === 'string');
      assert(typeof res.data.identity.secret === 'string');
      assert(res.data.room instanceof Object);
      assert(typeof res.data.room.roomID === 'string');
      assert(typeof res.data.room.name === 'string');
      assert(res.data.room.users instanceof Array);
      res.data.room.users.forEach(user => {
        assert(typeof user.roomID === 'string');
        assert(typeof user.userID === 'string');
        assert(typeof user.avatar === 'string');
        assert(typeof user.nick === 'string');
      });
      resolve(res.data);
    });
    setTimeout(() => { reject('joinRoom timeout'); }, EXCHANGE_TIMEOUT);
  });
}

export function leaveRoom({roomID, userID, secret}) {
  const exchangeID = getExchangeID();
  socket.emit('client-request:leaveRoom', {
    exchangeID,
    data: {
      roomID,
      userID,
      secret,
    },
  });

  return new Promise( (resolve, reject) => {
    socket.once(`server-response:joinRoom@${exchangeID}`, res => {
      assert(res instanceof Object);
      assert(res.status === 'OK');
      resolve();
    });
    setTimeout(() => { reject('leaveRoom timeout'); }, EXCHANGE_TIMEOUT);
  });
}

export function message({roomID, userID, secret, text, time}) {
  const exchangeID = getExchangeID();
  socket.emit('client-request:message', {
    exchangeID,
    data: {
      roomID,
      userID,
      secret,
      text,
      time,
    },
  });

  return new Promise( (resolve, reject) => {
    socket.once(`server-response:message@${exchangeID}`, res => {
      assert(res instanceof Object);
      assert(res.status === 'OK');
      assert(res.data instanceof Object);
      assert(typeof res.data.roomID === 'string');
      assert(typeof res.data.userID === 'string');
      assert(typeof res.data.messageID === 'string');
      assert(typeof res.data.text === 'string');
      assert(typeof res.data.time === 'number');
      resolve(res.data);
    });
    setTimeout(() => { reject('message timeout'); }, EXCHANGE_TIMEOUT);
  });
}

