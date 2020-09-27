import {Action, createReducer, on, State} from '@ngrx/store';
import * as AuthAction from './auth.actions';
import {MyState} from '../models/MyState';



export const initialState: MyState = {
  isAuthenticated: false,
  user: null
};

const _authReducer = createReducer(
  initialState,
  on(AuthAction.login, (state) => ({...state, isAuthenticated: true})),
  on(AuthAction.logout, (state) => ({...state, isAuthenticated: false, user: null})),
  on(AuthAction.setUser, (state, {user}) => ({...state, isAuthenticated: true, user}))
);

export function authReducer(state: MyState, action: Action) {
  return _authReducer(state, action);
}
