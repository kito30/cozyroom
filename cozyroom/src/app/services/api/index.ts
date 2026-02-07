// API Services - Backend API calls

export { getLayoutSession, type LayoutSession } from './layout-session.server';

// Server-side API calls
export {
  checkAuthServer,
  getProfileServer,
  updateProfileServer,
  loginServer,
  registerServer,
  logoutServer,
  uploadAvatarServer,
} from './user.api.server';

// Client-side API calls
export {
  checkAuthClient,
} from './user.api.client';
