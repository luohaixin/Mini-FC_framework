import type { Route, RouteMatch } from './types.js';

export function matchRoute(path: string, routes: Route[]): RouteMatch | null {
  const [pathname, search = ''] = path.split('?');
  const query = parseQuery(search);

  for (const route of routes) {
    const match = matchPath(pathname, route.path);
    if (match) {
      return {
        route,
        params: match.params,
        query
      };
    }

    if (route.children) {
      const childMatch = matchRoute(pathname, route.children);
      if (childMatch) {
        return {
          route: childMatch.route,
          params: { ...match?.params, ...childMatch.params },
          query
        };
      }
    }
  }

  return null;
}

function matchPath(pathname: string, routePath: string): { params: Record<string, string> } | null {
  const pathParts = pathname.split('/').filter(Boolean);
  const routeParts = routePath.split('/').filter(Boolean);

  if (pathParts.length !== routeParts.length && !routePath.includes('*')) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const pathPart = pathParts[i];

    if (routePart.startsWith(':')) {
      const paramName = routePart.slice(1);
      params[paramName] = pathPart || '';
    } else if (routePart === '*') {
      break;
    } else if (routePart !== pathPart) {
      return null;
    }
  }

  return { params };
}

function parseQuery(search: string): Record<string, string> {
  const query: Record<string, string> = {};
  if (!search) return query;

  const params = new URLSearchParams(search);
  params.forEach((value, key) => {
    query[key] = value;
  });

  return query;
}
