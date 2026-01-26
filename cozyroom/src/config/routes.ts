export const ROUTES = {
  login: "/login",
  register: "/register",
  home: "/",
};

// The Master List of Public Routes
export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/about",
];

export function isPublicPath(path: string) {
  return PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath));
}