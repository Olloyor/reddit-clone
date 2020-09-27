import {UserResponse} from './user-profile.payload';

export interface MyState {
  isAuthenticated: boolean;
  user: UserResponse;
}
