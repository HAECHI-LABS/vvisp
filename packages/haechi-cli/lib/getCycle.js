module.exports = function(graph) {
  if (!graph) {
    return;
  }
  const keys = Object.keys(graph);
  if (!keys || keys.length === 0) {
    return;
  }

  graph = Object.assign(
    ...keys.map(node => ({ [node]: graph[node].map(String) }))
  );

  let queue = keys.map(node => [node]);
  while (queue.length) {
    const batch = [];
    for (const path of queue) {
      const parents = graph[path[0]] || [];
      for (const node of parents) {
        if (node === path[path.length - 1]) return [node, ...path];
        batch.push([node, ...path]);
      }
    }
    queue = batch;
  }
};
