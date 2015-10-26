const newID = (() => {
  let i = 0;
  return () => {
    i++;
    return `chunk-tree-${i}`;
  };
})();

export const create = () => {
  const result = [];
  result.chunkTreeID = newID();
  return result;
};

export const append = (tree0, element) => {
  const tree1 = [ ...tree0, element ];
  tree1.chunkTreeID = tree0.chunkTreeID;
  const path = [tree0.length];
  return {tree: tree1, path};
};

export const replace = (tree0, path, element) => {
  const index = path[0];
  const subpath = path.slice(1);
  const subtree0 = tree0[index];
  const subtree1 = subpath.length === 0 ? element :
                   replace(subtree0, subpath, element);
  const tree1 = [...tree0];
  tree1[index] = subtree1; // benign mutation
  tree1.chunkTreeID = tree0.chunkTreeID;
  return tree1;
};

export const remove = (tree0, path) => {
  const index = path[0];
  const subpath = path.slice(1);

  if (subpath.length === 0) {
    const tree1 = [...tree0];
    tree1.splice(index, 1); // benign mutation
    tree1.chunkTreeID = tree0.chunkTreeID;
    return tree1;
  }

  const subtree0 = tree0[index];
  const subtree1 = remove(subtree0, subpath);
  const tree1 = [...tree0];
  tree1.splice(index, 1, subtree1); // benign mutation
  tree1.chunkTreeID = tree0.chunkTreeID;
  return tree1;
};

export const get = (tree, path) => {
  const index = path[0];
  const subpath = path.slice(1);

  if (subpath.length === 0) {
    return tree[index];
  }

  const subtree = tree[index];
  return fetch(subtree, subpath);
};

export const isTree = maybeTree => !!maybeTree.chunkTreeID;
