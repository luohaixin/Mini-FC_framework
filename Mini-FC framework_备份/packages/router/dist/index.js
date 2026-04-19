import { shallowRef, triggerRef, defineComponent, ref, h, watch } from "@my-framework/core";
function matchRoute(path, routes) {
  const [pathname, search = ""] = path.split("?");
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
          params: { ...match == null ? void 0 : match.params, ...childMatch.params },
          query
        };
      }
    }
  }
  return null;
}
function matchPath(pathname, routePath) {
  const pathParts = pathname.split("/").filter(Boolean);
  const routeParts = routePath.split("/").filter(Boolean);
  if (pathParts.length !== routeParts.length && !routePath.includes("*")) {
    return null;
  }
  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const pathPart = pathParts[i];
    if (routePart.startsWith(":")) {
      const paramName = routePart.slice(1);
      params[paramName] = pathPart || "";
    } else if (routePart === "*") {
      break;
    } else if (routePart !== pathPart) {
      return null;
    }
  }
  return { params };
}
function parseQuery(search) {
  const query = {};
  if (!search) return query;
  const params = new URLSearchParams(search);
  params.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}
let currentRouter = null;
function createRouter(options) {
  const { routes, base = "", mode = "hash" } = options;
  const _currentRoute = shallowRef(null);
  const beforeGuards = [];
  const afterHooks = [];
  let isNavigating = false;
  function resolvePath(path) {
    if (mode === "hash") {
      return base ? `#${base}${path}` : `#${path}`;
    }
    return base ? `${base}${path}` : path;
  }
  function getCurrentPath() {
    if (mode === "hash") {
      const hash = window.location.hash;
      return hash ? hash.slice(1) : "/";
    }
    return window.location.pathname + window.location.search;
  }
  async function resolveComponent(route) {
    if (typeof route.component === "function") {
      try {
        const module = await route.component();
        return module.default || module;
      } catch (error) {
        console.error("Failed to load component:", error);
        return null;
      }
    }
    return route.component;
  }
  async function navigate(path, replace = false) {
    if (isNavigating) return false;
    isNavigating = true;
    try {
      const match = matchRoute(path, routes);
      if (!match) {
        console.warn(`[router] No route matched for path: ${path}`);
        return false;
      }
      const from = _currentRoute.value;
      for (const guard of beforeGuards) {
        const canNavigate = await guard(match, from);
        if (!canNavigate) {
          return false;
        }
      }
      _currentRoute.value = match;
      triggerRef(_currentRoute);
      const url = resolvePath(path);
      if (mode === "hash") {
        if (replace) {
          window.location.replace(url);
        } else {
          window.location.hash = url.slice(1);
        }
      } else {
        if (replace) {
          window.history.replaceState({}, "", url);
        } else {
          window.history.pushState({}, "", url);
        }
      }
      for (const hook of afterHooks) {
        hook(match, from);
      }
      return true;
    } finally {
      isNavigating = false;
    }
  }
  const router = {
    _currentRoute,
    _resolveComponent: resolveComponent,
    get currentRoute() {
      return _currentRoute.value;
    },
    push(path) {
      void navigate(path);
    },
    replace(path) {
      void navigate(path, true);
    },
    back() {
      if (mode === "hash") {
        window.history.back();
      } else {
        window.history.back();
      }
    },
    forward() {
      window.history.forward();
    },
    go(delta) {
      window.history.go(delta);
    },
    beforeEach(guard) {
      beforeGuards.push(guard);
      return () => {
        const index = beforeGuards.indexOf(guard);
        if (index > -1) {
          beforeGuards.splice(index, 1);
        }
      };
    },
    afterEach(hook) {
      afterHooks.push(hook);
      return () => {
        const index = afterHooks.indexOf(hook);
        if (index > -1) {
          afterHooks.splice(index, 1);
        }
      };
    }
  };
  currentRouter = router;
  if (typeof window !== "undefined") {
    if (mode === "hash") {
      window.addEventListener("hashchange", () => {
        const path = getCurrentPath();
        void navigate(path, true);
      });
    } else {
      window.addEventListener("popstate", () => {
        const path = getCurrentPath();
        void navigate(path, true);
      });
    }
    const initialPath = getCurrentPath();
    void navigate(initialPath, true);
  }
  return router;
}
function getCurrentRouter() {
  return currentRouter;
}
function resolveRoutePath(path, params) {
  return path.replace(/:(\w+)/g, (_, key) => params[key] || "");
}
const RouterView = defineComponent({
  name: "RouterView",
  setup() {
    const router = getCurrentRouter();
    const currentComponent = ref(null);
    if (!router) {
      console.warn("[router] RouterView must be used within a router");
      return () => null;
    }
    watch(() => router._currentRoute.value, (routeMatch) => {
      console.log("[RouterView] routeMatch changed:", routeMatch);
      if (routeMatch) {
        const component = routeMatch.route.component;
        console.log("[RouterView] resolved component:", component);
        currentComponent.value = component;
      } else {
        currentComponent.value = null;
      }
    }, { immediate: true });
    return () => {
      const component = currentComponent.value;
      console.log("[RouterView] rendering component:", component);
      if (!component) {
        return h("div", { class: "router-view-empty" }, "No matched route");
      }
      return h(component, {});
    };
  }
});
const RouterLink = defineComponent({
  name: "RouterLink",
  props: {
    to: { type: [String, Object], required: true },
    replace: { type: Boolean, default: false },
    activeClass: { type: String, default: "router-link-active" },
    exactActiveClass: { type: String, default: "router-link-exact-active" }
  },
  setup(props, { slots }) {
    const router = getCurrentRouter();
    if (!router) {
      console.warn("[router] RouterLink must be used within a router");
      return () => {
        var _a;
        return h("a", {}, ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []);
      };
    }
    const handleClick = (event) => {
      event.preventDefault();
      const to = props.to;
      let path;
      if (typeof to === "string") {
        path = to;
      } else {
        const routeObj = to;
        if (routeObj.path) {
          path = routeObj.path;
        } else {
          path = "/";
        }
      }
      if (props.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    };
    const getHref = () => {
      const to = props.to;
      if (typeof to === "string") {
        return to;
      }
      return to.path || "/";
    };
    const isActive = () => {
      const currentRoute = router.currentRoute;
      if (!currentRoute) return false;
      const to = props.to;
      const targetPath = typeof to === "string" ? to : to.path || "/";
      const currentPath = currentRoute.route.path;
      return currentPath === targetPath || currentPath.startsWith(targetPath + "/");
    };
    const isExactActive = () => {
      const currentRoute = router.currentRoute;
      if (!currentRoute) return false;
      const to = props.to;
      const targetPath = typeof to === "string" ? to : to.path || "/";
      return currentRoute.route.path === targetPath;
    };
    return () => {
      var _a;
      const classNames = [
        "router-link",
        isActive() ? props.activeClass : "",
        isExactActive() ? props.exactActiveClass : ""
      ].filter(Boolean).join(" ");
      return h("a", {
        class: classNames,
        href: getHref(),
        onClick: handleClick
      }, ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []);
    };
  }
});
export {
  RouterLink,
  RouterView,
  createRouter,
  getCurrentRouter,
  matchRoute,
  resolveRoutePath
};
//# sourceMappingURL=index.js.map
