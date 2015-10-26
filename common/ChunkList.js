import _ from 'lodash';

const CHUNK_SIZE = 32;

export const create = (elements) => {
  const list = elements.length > 0 ? _.chunk(elements, CHUNK_SIZE) : [[]];
  const paths = elements.map((element, index) => {
    const p = Math.floor(index / CHUNK_SIZE);
    const q = index - p * CHUNK_SIZE;
    const path = [p, q];
    return {element, path};
  });
  return {list, paths};
};

export const append = (list0, element) => {
  const lastChunk = _.last(list0);
  if (lastChunk.length >= CHUNK_SIZE) {
    const list1 = [...list0, [element]];
    const path = [list0.length, 0];
    return {list: list1, path};
  }

  const list1 = [...list0];
  list1.pop();
  list1.push([...lastChunk, element]);
  const path = [list0.length - 1, lastChunk.length];
  return {list: list1, path};
};

export const replace = (list0, path, element) => {
  const p = path[0];
  const q = path[1];
  const chunk = list0[p];
  const newChunk = [...chunk];
  newChunk[q] = element;
  const list1 = [...list0];
  list1[p] = newChunk;
  return list1;
};

export const remove = (list0, path) => replace(list0, path, null);

export const get = (list, path) => {
  const p = path[0];
  const q = path[1];

  return list[p][q];
};
