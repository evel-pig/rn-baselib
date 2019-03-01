import { createAction, ActionFunctionAny, Action } from 'redux-actions';

export type ActionKeys<T> = { [key in keyof T]: string };

export interface Actions<T> {
  actions: { [key in keyof T]: ActionFunctionAny<Action<{}>> };
  actionNames: { [key in keyof T]: string };
}

/**
 * 创建普通Action
 * @param modelName
 * @param keys
 */
export function initAction<T>(modelName: string, keys: ActionKeys<T>): Actions<T> {

  const ModelName = modelName.toLocaleUpperCase();

  const actions = {
    actionNames: {},
    actions: {},
  } as Actions<T>;

  Object.keys(keys).forEach((key) => {
    const actionName = `${ModelName}_ACTION:${keys[key]}`;
    actions.actionNames[key] = actionName;
    actions.actions[key] = createAction(actionName);
  });

  return actions;
}
