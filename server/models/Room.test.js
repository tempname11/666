import { assert } from 'chai';

import utils from '../testUtils';

import * as Room from './Room';
import * as User from './User';
import * as Message from './Message';

describe('Room: model', () => {
  describe('#create()', () => {
    it('should create a new Room', done => {
      const roomData = {
        roomID: 'roomID',
        name: 'name',
        rating: 0,
      };
      const room = new Room.model(roomData);
      room.save( (err, createdRoom) => {
        assert.equal(err, null);
        assert.equal(createdRoom.roomID, 'roomID');
        assert.equal(createdRoom.name, 'name');
        assert.equal(createdRoom.rating, 0);
        done();
      });
    });
    it('should throw Error', done => {
      const roomData = {};
      const room = new Room.model(roomData);
      room.save( (err, createdRoom) => {
        assert.equal(err.name, 'ValidationError');
        done();
      });
    });
  });
});
