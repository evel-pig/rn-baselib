import { StackActions, NavigationActions } from 'react-navigation';

export function createNavModel(
  AppNavigator: any,
  initialRoute: string,
  handleState?: (state: any, nextState: any) => any,
) {
  const Actions = { ...StackActions, ...NavigationActions };

  const ActionNames = Object.keys(Actions)
    .filter(key => typeof Actions[key] === 'string')
    .map(key => Actions[key]);

  function getNavState(action, state?) {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    if (nextState) {
      nextState.routeName = nextState.routes[nextState.index].routeName;
    }
    if (handleState && typeof handleState === 'function') {
      return handleState(state, nextState);
    }
    return nextState;
  }

  const initialState = getNavState(AppNavigator.router.getActionForPathAndParams(initialRoute));

  const navReducer = (state = initialState, action) => {
    if (ActionNames.includes(action.type)) {
      const nextState = getNavState(action, state);
      return nextState || state;
    }
    return state;
  };

  const nav = {
    modelName: 'nav',
    reducer: navReducer,
  };
  return nav;
}
