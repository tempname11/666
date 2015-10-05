import { assert } from 'chai';

import utils from './testUtils';

import * as actions from './actions';

describe('actions', () => {
  describe('#createRoom({roomID})', () => {
    it('should reject if roomID === undefined', done => {
      actions.createRoom({})
        .catch(error => {
          assert.equal(error.name, 'ValidationError');
          done();
        });
    });
  });
  describe('#joinRoom({roomID})', () => {
    it('should reject if roomID === undefined', done => {
      const data = {roomID: 'roomID'};
      actions.joinRoom(data)
        .catch(error => {
          assert.equal(error, 'Error: Can not find user in unexisted room');
          done();
        });
    });
    it('should resolve with new User', done => {
      const data = {roomID: 'roomID'};
      actions.createRoom(data)
        .then(actions.joinRoom)
        .then(user => {
          assert.equal(user.roomID, 'roomID');
          done();
        });
    });
  });
  describe('#leaveRoom({roomID, userID, secret})', () => {
    it('should reject if user not found in room', done => {
      const data = {
        roomID: 'roomID',
        userID: 'userID',
        secret: 'secret',
      };
      actions.leaveRoom(data)
        .catch(error => {
          assert.equal(error, 'Error: Can not find user in unexisted room');
          done();
        });
    });
    it('should resolve with {roomID, userID}', done => {
      const data = {roomID: 'roomID'};
      actions.createRoom(data)
        .then(actions.joinRoom)
        .then(actions.leaveRoom)
        .then(leaveData => {
          assert.equal(leaveData.roomID, 'roomID');
          done();
        });
    });
  });
  describe('#message({roomID, userID, secret, text, time})', () => {
    it('should reject if user not found in room', done => {
      const data = {
        roomID: 'roomID',
        userID: 'userID',
        secret: 'secret',
        text: 'text',
        time: 0,
      };
      actions.message(data)
        .catch(error => {
          assert.equal(error, 'Error: Can not find user in unexisted room');
          done();
        });
    });
    it('should resolve with {roomID, userID, secret, text, time}', done => {
      const data = {
        roomID: 'roomID',
        userID: 'userID',
        secret: 'secret',
        text: 'text',
        time: 0,
      };
      actions.createRoom(data)
        .then(actions.joinRoom)
        .then( (user) => {
          const messageData = {
            roomID: user.roomID,
            userID: user.userID,
            secret: user.secret,
            text: 'text',
            time: 0,
          };
          actions.message(messageData)
            .then(message => {
              assert.equal(message.roomID, messageData.roomID);
              assert.equal(message.userID, messageData.userID);
              assert.equal(message.text, messageData.text);
              assert.equal(message.time, messageData.time);
              done();
            });
        });
    });
  });
  describe('#getTop()', () => {
    it('should resolve with [rooms]', done => {
      const data = {
        roomID: 'roomID',
        userID: 'userID',
        secret: 'secret',
        text: 'text',
        time: 0,
      };
      actions.createRoom(data)
        .then( () => {
          actions.getTop()
            .then(topData => {
              assert.equal(topData.rooms.length, 1);
              done();
            });
        });
    });
  });
  describe('#searchRoomID({partialRoomID})', () => {
    it('should resolve with [rooms]', done => {
      const data = {
        roomID: 'roomID',
        userID: 'userID',
        secret: 'secret',
        text: 'text',
        time: 0,
      };
      actions.createRoom(data)
        .then( () => {
          actions.searchRoomID({partialRoomID: 'roo'})
            .then(searchData => {
              assert.equal(searchData.rooms.length, 1);
              done();
            });
        });
    });
  });
});
