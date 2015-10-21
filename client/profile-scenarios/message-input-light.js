import { roomInputChange } from '../actions';

export const actions = [
  roomInputChange('Hello.'),
];

export const state = JSON.parse(`{"joinedRooms":{"123":{"userID":"2621e4cb-2554-4246-a1f6-be629167de51","secret":"12c66b8a-cded-4668-860c-171f11f6be40","roomName":"123","roomUsers":{"2621e4cb-2554-4246-a1f6-be629167de51":{"avatar":"http://eightbitavatar.herokuapp.com/?id=2621e4cb-2554-4246-a1f6-be629167de51&s=female&size=64","nick":"Massive Fox"}},"roomMessages":{"8cf2c161-0980-4ba0-a38e-34b370adff84":{"userID":"2621e4cb-2554-4246-a1f6-be629167de51","messageID":"8cf2c161-0980-4ba0-a38e-34b370adff84","text":"Hello.","time":1445332987809,"attachments":[],"status":"confirmed","index":0}},"orderedMessages":["8cf2c161-0980-4ba0-a38e-34b370adff84"]}},"joiningRooms":{"undefined":true},"topRooms":null,"ui":{"navigationCollapsed":false,"previewCollapsed":false,"searchInputText":"123","roomInputText":"","searchResults":null},"router":{"routes":[{},{"path":"/","childRoutes":[{"path":"/room/:roomID"},{"path":"*"}]},{"path":"/room/:roomID"}],"params":{"roomID":"123"},"location":{"pathname":"/room/123","search":"","hash":"","state":{},"action":"PUSH","key":"o9d9m6","query":{}},"components":[null,null,null]}}`);
