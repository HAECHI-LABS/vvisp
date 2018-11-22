function DeployState() {
  let state = {};

  return {
    getState: function() {
      return JSON.parse(JSON.stringify(state, null, '  '));
    },
    updateState: function(newState) {
      state = JSON.parse(JSON.stringify(newState, null, '  '));
      return this;
    }
  };
}
module.exports = DeployState;
