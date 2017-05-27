import combineModelReducers from './combineModelReducers'

let models = {};

export function registerModel(...pendingModels) {
  pendingModels.forEach(model => {
    models[model.modelName] = model;
  });
}

export function getModels() {
  return models;
}