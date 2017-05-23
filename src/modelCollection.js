let models = {};

function registerModel(...pendingModels) {
  pendingModels.forEach(model => {
    models[model.modelName] = model;
  });
}

export function getModels() {
  return models;
}

export function registerModelAndGenerateReducer({ models, generateReducer }) {
  registerModel(...models);
  return generateReducer();
}