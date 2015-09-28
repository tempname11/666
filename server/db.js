import _ from 'lodash';

/*
  rooms: HashMap('roomID', {
    roomName: string,
    roomUsers: HashMap('userID', {
      avatar: string,
      nick: string,
      secret: string,
    }),
    roomMessages: [{
      userID: string,
      messageID: string,
      text: string,
      time: number,
    }],
    rating: number,
  })
*/
const rooms = {};

const users = {};
const unreadMessages = [];

// TODO FIX ME
export function getRoomIDs() {
  return Promise.resolve(Object.keys(rooms));
}

// TODO PROBLEM: race condition
/*
user 1 joined
  getRoom 1
user 2 joined
  getRoom 2
  setRoom 1
  setRoom 2
*/

// TODO FIX ME
export function getRoom(roomID) {
  const room = rooms[roomID];
  if (!room) {
    return Promise.reject(`No such room: '${roomID}'`);
  }
  return Promise.resolve(_.cloneDeep(room));
}

/**
 * Создает promise для добавления пользователя в БД
 * @param {User}
 * @return {Promise}
 */
export function addUser(user) {
  const promise = new Promise( function onAddUser(resolve, reject) {
    if (!user) {
      reject('Error!');
      return;
    }

    setTimeout( function onAddUserSuccess() {
      users[user.uid] = user;
      resolve(user);
    }, 10);
  });

  return promise;
}

/**
 * Создает promise для получения пользователя из БД
 * @param  {string} userId - идентификатор пользователя
 * @return {Promise}
 */
export function getUser(userId) {
  const promise = new Promise( function onGetUser(resolve, reject) {
    if (!userId || !users[userId]) {
      reject('Error!');
      return;
    }

    setTimeout( function onGetUserSuccess() {
      resolve(users[userId]);
    }, 10);
  });

  return promise;
}

/**
 * Создает promise для получения всех пользователей
 * @return {Promise}
 */
export function getRoomUsers() {
  const promise = new Promise( function onGetRoomUsers(resolve) {
    setTimeout( function onGetRoomUsersSuccess() {
      resolve(users);
    }, 10);
  });

  return promise;
}

/**
 * Создает promise для добавления непрочитаных сообщений в список непрочитанны сообщений
 * @param {Message}
 * @return {Promise}
 */
export function addUnreadMessage(message) {
  const promise = new Promise( function onAddUnreadMessage(resolve, reject) {
    if (!message || !message.uid) {
      reject('Error!');
      return;
    }

    setTimeout( function onAddUnreadMessageSuccess() {
      unreadMessages.push(message);
      console.log(unreadMessages);
      resolve(message);
    }, 10);
  });

  return promise;
}

/**
 * Создает promise для удаления прочитанных сообщений из списка непрочитанных
 * @param  {string} mid - идентификатор сообщения
 * @return {Promise}
 */
export function readMessage(mid) {
  const promise = new Promise( function onReadMessage(resolve) {
    if (!mid) {
      reject('Error!');
      return;
    }

    setTimeout( function onGetUserSuccess() {
      const message = _.remove(unreadMessages, function checkMessageForRemove(el) {
        return el.mid === mid;
      });
      console.log(message);
      resolve(message);
    }, 10);
  });

  return promise;
}
