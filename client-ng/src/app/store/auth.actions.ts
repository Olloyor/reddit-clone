import {createAction, props} from '@ngrx/store';
import {UserResponse} from '../models/user-profile.payload';

export const login = createAction('[Auth Component] Auth');
export const logout = createAction('[Auth Component] Logout');

export const setUser = createAction('[User Component] User', props<{ user: UserResponse }>());
