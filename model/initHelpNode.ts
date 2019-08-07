import { createAction, ActionFunctionAny, Action } from 'redux-actions';

export interface HelpNodeProps {
  name: string;
  action: ActionFunctionAny<Action<{}>>;
}

export type HelpKeys<T> = { [key in keyof T]: string };
export type HelpNode<T> = { [key in keyof T]: HelpNodeProps };

/**
 * 创建普通 Node
 * @param modelName
 * @param keys
 */
export function initNode<T>(modelName: string, keys: HelpKeys<T>): HelpNode<T> {
  const ModelName = modelName.toLocaleUpperCase();
  const nodes = {} as HelpNode<T>;

  Object.keys(keys).forEach((key) => {
    const actionName = `${ModelName}_ACTION:${keys[key]}`;
    let node = {} as HelpNodeProps;
    node.name = actionName;
    node.action = createAction(actionName);
    nodes[key] = node;
  });

  return nodes;
}
