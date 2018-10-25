import {RouterState} from 'react-router-redux';

export interface AppState {
  routesPermissions: any,
  routing: RouterState,
  user: any,
  auth: any,
  ajaxCallsInProgress: any,
  [props: string]: any,
}
