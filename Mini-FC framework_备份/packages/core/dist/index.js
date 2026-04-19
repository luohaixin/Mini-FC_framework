import { shallowReactive as shallowReactive$1, shallowReadonly as shallowReadonly$1, shallowRef as shallowRef$1, computed as computed$1, reactive as reactive$1, readonly as readonly$1, ref as ref$1, watch as watch$1, effect, stop, unref, triggerRef } from "@vue/reactivity";
import { customRef, effectScope, getCurrentScope, isProxy, isReactive, isReadonly, isRef, onScopeDispose, proxyRefs, toRaw, toRef, toRefs, triggerRef as triggerRef2, unref as unref2 } from "@vue/reactivity";
let componentId = 0;
function createComponent(options) {
  const id = `component-${++componentId}`;
  let isMounted = false;
  let container = null;
  let currentProps = {};
  let setupContext;
  const component = {
    id,
    name: options.name,
    render() {
      return options.render(setupContext);
    },
    mount(target) {
      if (isMounted) {
        throw new Error(`Component ${options.name} is already mounted`);
      }
      container = target;
      setupContext = options.setup(currentProps, {
        emit: () => {
        },
        slots: {}
      });
      isMounted = true;
    },
    unmount() {
      if (!isMounted) {
        throw new Error(`Component ${options.name} is not mounted`);
      }
      container = null;
      isMounted = false;
    },
    update(props) {
      currentProps = { ...currentProps, ...props };
      if (isMounted && container) {
        setupContext = options.setup(currentProps, {
          emit: () => {
          },
          slots: {}
        });
      }
    }
  };
  return component;
}
const __DEV__$4 = process.env["NODE_ENV"] !== "production";
function nextTick$1(fn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (fn) {
        resolve(fn());
      } else {
        resolve(void 0);
      }
    }, 0);
  });
}
const NON_SERIALIZABLE_TYPES = /* @__PURE__ */ new Set([
  "Function",
  // 函数
  "Symbol",
  // Symbol
  "WeakMap",
  // WeakMap（无法遍历）
  "WeakSet",
  // WeakSet（无法遍历）
  "Promise"
  // Promise
]);
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
function isSerializable(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (value === null || typeof value !== "object") {
    return typeof value !== "function" && typeof value !== "symbol";
  }
  if (seen.has(value)) return true;
  seen.add(value);
  const type = getType(value);
  if (NON_SERIALIZABLE_TYPES.has(type)) return false;
  if (Array.isArray(value)) {
    return value.every((item) => isSerializable(item, seen));
  }
  if (value instanceof Map || value instanceof Set) {
    for (const item of value) {
      if (!isSerializable(item, seen)) return false;
    }
    return true;
  }
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      if (!isSerializable(value[key], seen)) {
        return false;
      }
    }
  }
  return true;
}
function warnNonSerializable(value, context) {
  if (!__DEV__$4) return;
  if (!isSerializable(value)) {
    console.warn(
      `[mini-fc warn]: Non-serializable value detected in ${context}. This may cause issues with state persistence. Value type: ${getType(value)}`
    );
  }
}
function ref(value) {
  if (__DEV__$4 && arguments.length > 0) {
    warnNonSerializable(value, "ref");
  }
  return ref$1(value);
}
const shallowRef = shallowRef$1;
function reactive(target) {
  if (__DEV__$4) {
    warnNonSerializable(target, "reactive");
  }
  return reactive$1(target);
}
const shallowReactive = shallowReactive$1;
function readonly(target) {
  return readonly$1(target);
}
const shallowReadonly = shallowReadonly$1;
function computed(getterOrOptions) {
  return computed$1(getterOrOptions);
}
function watch(source, callback, options) {
  return watch$1(source, callback, options);
}
function watchEffect(effect$1, options) {
  let cleanup;
  const onCleanup = (fn) => {
    cleanup = fn;
  };
  const runner = effect(() => {
    if (cleanup) {
      cleanup();
      cleanup = void 0;
    }
    effect$1(onCleanup);
  }, {
    lazy: false,
    // 立即执行
    scheduler: (options == null ? void 0 : options.flush) === "sync" ? void 0 : () => {
      nextTick$1(() => runner());
    }
  });
  return () => {
    if (cleanup) {
      cleanup();
    }
    stop(runner);
  };
}
const __DEV__$3 = process.env.NODE_ENV !== "production";
function validateProp(key, value, propType, componentName) {
  if (!__DEV__$3) return;
  const type = typeof propType === "function" ? propType : propType.type;
  const isRequired = typeof propType === "object" && propType.required === true;
  const hasDefault = typeof propType === "object" && "default" in propType;
  if (isRequired && (value === void 0 || value === null)) {
    console.warn(
      `[mini-fc warn]: Missing required prop: "${key}" in component "${componentName}"`
    );
    return;
  }
  if ((value === void 0 || value === null) && hasDefault) {
    return;
  }
  if (value !== void 0 && value !== null && type !== null) {
    type.name.toLowerCase();
    const actualType = typeof value;
    let typeMatch = false;
    if (type === String) {
      typeMatch = actualType === "string";
    } else if (type === Number) {
      typeMatch = actualType === "number";
    } else if (type === Boolean) {
      typeMatch = actualType === "boolean";
    } else if (type === Function) {
      typeMatch = actualType === "function";
    } else if (type === Object) {
      typeMatch = actualType === "object" && !Array.isArray(value);
    } else if (type === Array) {
      typeMatch = Array.isArray(value);
    } else if (type === Symbol) {
      typeMatch = actualType === "symbol";
    }
    if (!typeMatch) {
      console.warn(
        `[mini-fc warn]: Invalid prop: type check failed for prop "${key}" in component "${componentName}". Expected ${type.name}, got ${actualType === "object" ? Array.isArray(value) ? "Array" : "Object" : actualType}`
      );
    }
  }
}
function resolveProps(options, rawProps) {
  const props = {};
  const propOptions = options.props || {};
  for (const key in propOptions) {
    const propType = propOptions[key];
    let value = rawProps[key];
    if ((value === void 0 || value === null) && typeof propType === "object") {
      if ("default" in propType) {
        value = typeof propType.default === "function" ? propType.default() : propType.default;
      }
    }
    validateProp(key, value, propType, options.name);
    props[key] = value;
  }
  return props;
}
function createEmitFn(instance) {
  return (event, ...args) => {
    if (__DEV__$3) {
      console.log(`[mini-fc emit]: Component "${instance.name}" emitted event "${event}"`, args);
    }
  };
}
function createComponentInstance(options, rawProps) {
  const resolvedProps = resolveProps(options, rawProps);
  const props = shallowRef(resolvedProps);
  const instance = {
    name: options.name,
    props,
    setupResult: null,
    context: null,
    isMounted: false,
    emit: null
  };
  instance.emit = createEmitFn(instance);
  instance.context = {
    emit: instance.emit,
    slots: {}
  };
  instance.setupResult = options.setup(resolvedProps, instance.context);
  return instance;
}
function defineComponent(options) {
  const component = {
    name: options.name,
    props: options.props,
    setup: (props, context) => {
      return options.setup(props, context);
    }
  };
  return component;
}
function mountComponent(component, container, props = {}) {
  const instance = createComponentInstance(
    { name: component.name, props: component.props, setup: component.setup },
    props
  );
  instance.isMounted = true;
  if (__DEV__$3) {
    console.log(`[mini-fc]: Component "${instance.name}" mounted`);
  }
  return instance;
}
function updateComponentProps(instance, newProps) {
  const resolvedProps = { ...unref(instance.props), ...newProps };
  instance.props.value = resolvedProps;
  triggerRef(instance.props);
  if (__DEV__$3) {
    console.log(`[mini-fc]: Component "${instance.name}" props updated`, resolvedProps);
  }
}
function unmountComponent(instance) {
  instance.isMounted = false;
  if (__DEV__$3) {
    console.log(`[mini-fc]: Component "${instance.name}" unmounted`);
  }
}
const __DEV__$2 = process.env.NODE_ENV !== "production";
function h(type, props, children) {
  if (__DEV__$2) {
    if (typeof type !== "string" && typeof type !== "object") {
      console.warn(`[mini-fc warn]: h() received invalid type: ${typeof type}`);
    }
  }
  const normalizedProps = props ?? {};
  const normalizedChildren = normalizeChildren(children);
  const key = normalizedProps.key;
  if (key !== void 0) {
    delete normalizedProps.key;
  }
  return {
    type,
    props: normalizedProps,
    children: normalizedChildren,
    key,
    el: null
  };
}
function normalizeChildren(children) {
  if (children === null || children === void 0) {
    return [];
  }
  if (Array.isArray(children)) {
    return children.flatMap((child) => normalizeChild(child));
  }
  return normalizeChild(children);
}
function normalizeChild(child) {
  if (isVNode(child)) {
    return [child];
  }
  if (typeof child === "string") {
    return [child];
  }
  if (typeof child === "number") {
    return [String(child)];
  }
  if (typeof child === "boolean") {
    return child ? ["true"] : ["false"];
  }
  if (child === null || child === void 0) {
    return [];
  }
  if (Array.isArray(child)) {
    return child.flatMap((c) => normalizeChild(c));
  }
  if (__DEV__$2) {
    console.warn(`[mini-fc warn]: Invalid child type: ${typeof child}`);
  }
  return [];
}
function isVNode(value) {
  return value !== null && typeof value === "object" && "type" in value && "props" in value && "children" in value;
}
function createTextVNode(text) {
  return {
    type: null,
    props: {},
    children: [text],
    el: null
  };
}
const Fragment = Symbol("Fragment");
function hFragment(children) {
  return {
    type: Fragment,
    props: {},
    children: normalizeChildren(children),
    el: null
  };
}
const __DEV__$1 = process.env.NODE_ENV !== "production";
const queue = [];
let isFlushing = false;
let isFlushPending = false;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
    queueFlush();
  }
}
function queuePostFlushCb(cb) {
  if (!queue.includes(cb)) {
    queue.push(cb);
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function flushJobs() {
  isFlushPending = false;
  isFlushing = true;
  if (__DEV__$1) {
    console.log("[mini-fc scheduler]: Flushing jobs, count:", queue.length);
  }
  try {
    const jobs = queue.slice();
    queue.length = 0;
    for (const job of jobs) {
      try {
        job();
      } catch (err) {
        if (__DEV__$1) {
          console.error("[mini-fc scheduler]: Job execution failed:", err);
        }
      }
    }
  } finally {
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length > 0) {
      queueFlush();
    }
  }
}
function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(fn) : p;
}
function flush() {
  while (queue.length > 0 || isFlushPending) {
    flushJobs();
  }
}
const scheduler = {
  nextTick,
  flush,
  queueJob
};
const __DEV__ = process.env.NODE_ENV !== "production";
const EVENT_PREFIX = "on";
const EVENT_PREFIX_LENGTH = EVENT_PREFIX.length;
function isEventHandler(key) {
  return key.length > EVENT_PREFIX_LENGTH && key.startsWith(EVENT_PREFIX) && key[EVENT_PREFIX_LENGTH] === key[EVENT_PREFIX_LENGTH].toUpperCase();
}
function extractEventName(key) {
  return key.slice(EVENT_PREFIX_LENGTH).toLowerCase();
}
function setDOMAttribute(el, key, value, oldValue) {
  if (isEventHandler(key)) {
    const eventName = extractEventName(key);
    if (oldValue) {
      el.removeEventListener(eventName, oldValue);
    }
    if (value) {
      el.addEventListener(eventName, value);
    }
    return;
  }
  if (key === "class" || key === "className") {
    if (typeof value === "string") {
      el.className = value;
    } else if (Array.isArray(value)) {
      el.className = value.filter(Boolean).join(" ");
    } else if (typeof value === "object" && value !== null) {
      el.className = Object.entries(value).filter(([, v]) => v).map(([k]) => k).join(" ");
    }
    return;
  }
  if (key === "style") {
    if (typeof value === "string") {
      el.setAttribute("style", value);
    } else if (typeof value === "object" && value !== null) {
      Object.assign(el.style, value);
    }
    return;
  }
  if (key === "key" || key === "ref") {
    return;
  }
  if (typeof value === "boolean") {
    if (value) {
      el.setAttribute(key, "");
    } else {
      el.removeAttribute(key);
    }
    return;
  }
  if (value === null || value === void 0) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, String(value));
  }
}
function removeDOMAttribute(el, key, oldValue) {
  if (isEventHandler(key)) {
    const eventName = extractEventName(key);
    el.removeEventListener(eventName, oldValue);
    return;
  }
  if (key === "class" || key === "className") {
    el.className = "";
    return;
  }
  if (key === "style") {
    el.removeAttribute("style");
    return;
  }
  el.removeAttribute(key);
}
function createElement(vnode) {
  const { type, props, children } = vnode;
  if (type === null) {
    const text = children.length > 0 ? String(children[0]) : "";
    return document.createTextNode(text);
  }
  if (type === Fragment) {
    const fragment = document.createDocumentFragment();
    for (const child of children) {
      if (typeof child === "string") {
        fragment.appendChild(document.createTextNode(child));
      } else if (isVNode(child)) {
        fragment.appendChild(createElement(child));
      }
    }
    return fragment;
  }
  if (typeof type === "object") {
    return mountComponentVNode(vnode);
  }
  const el = document.createElement(type);
  for (const [key, value] of Object.entries(props)) {
    setDOMAttribute(el, key, value, void 0);
  }
  for (const child of children) {
    if (typeof child === "string") {
      el.appendChild(document.createTextNode(child));
    } else if (isVNode(child)) {
      el.appendChild(createElement(child));
    }
  }
  return el;
}
function mountComponentVNode(vnode) {
  const component = vnode.type;
  const props = { ...vnode.props };
  const slots = {
    default: () => vnode.children
  };
  const instance = {
    name: component.name,
    setupResult: null,
    context: {
      emit: () => {
      },
      slots
    },
    isMounted: false
  };
  const setupResult = component.setup(props, instance.context);
  instance.setupResult = setupResult;
  let renderResult;
  if (typeof setupResult === "function") {
    renderResult = setupResult();
  } else {
    renderResult = {
      type: "div",
      props: {},
      children: [],
      el: null
    };
  }
  const el = createElement(renderResult);
  vnode.el = el;
  instance.isMounted = true;
  return el;
}
function patchProps(el, oldProps, newProps) {
  for (const key in oldProps) {
    if (!(key in newProps)) {
      removeDOMAttribute(el, key, oldProps[key]);
    }
  }
  for (const key in newProps) {
    const oldValue = oldProps[key];
    const newValue = newProps[key];
    if (oldValue !== newValue) {
      setDOMAttribute(el, key, newValue, oldValue);
    }
  }
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
function patchChildren(parentEl, oldChildren, newChildren) {
  const oldLen = oldChildren.length;
  const newLen = newChildren.length;
  const minLen = Math.min(oldLen, newLen);
  for (let i = 0; i < minLen; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    if (typeof oldChild === "string" && typeof newChild === "string") {
      if (oldChild !== newChild && parentEl.childNodes[i]) {
        parentEl.childNodes[i].textContent = newChild;
      }
    } else if (isVNode(oldChild) && isVNode(newChild)) {
      patch(oldChild, newChild, parentEl, i);
    } else {
      const newEl = typeof newChild === "string" ? document.createTextNode(newChild) : createElement(newChild);
      if (parentEl.childNodes[i]) {
        parentEl.replaceChild(newEl, parentEl.childNodes[i]);
      } else {
        parentEl.appendChild(newEl);
      }
    }
  }
  for (let i = minLen; i < newLen; i++) {
    const newChild = newChildren[i];
    const newEl = typeof newChild === "string" ? document.createTextNode(newChild) : createElement(newChild);
    parentEl.appendChild(newEl);
  }
  for (let i = oldLen - 1; i >= minLen; i--) {
    if (parentEl.childNodes[i]) {
      parentEl.removeChild(parentEl.childNodes[i]);
    }
  }
}
function patch(oldVNode, newVNode, container, index) {
  if (!isSameVNodeType(oldVNode, newVNode)) {
    const newEl = createElement(newVNode);
    const oldEl = oldVNode.el;
    if (oldEl && oldEl.parentNode) {
      if (typeof index === "number" && oldEl.parentNode.childNodes[index]) {
        oldEl.parentNode.replaceChild(newEl, oldEl.parentNode.childNodes[index]);
      } else {
        oldEl.parentNode.replaceChild(newEl, oldEl);
      }
    }
    newVNode.el = newEl;
    return;
  }
  const el = newVNode.el = oldVNode.el;
  if (!el) return;
  if (newVNode.type === null) {
    const newText = newVNode.children.length > 0 ? String(newVNode.children[0]) : "";
    if (el.textContent !== newText) {
      el.textContent = newText;
    }
    return;
  }
  if (typeof newVNode.type === "object") {
    return;
  }
  const element = el;
  patchProps(element, oldVNode.props, newVNode.props);
  patchChildren(element, oldVNode.children, newVNode.children);
}
function render(vnode, container) {
  if (__DEV__) {
    console.log("[mini-fc render]: Rendering vnode to container", container);
  }
  const oldVNode = container._vnode;
  if (vnode === null) {
    if (oldVNode) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
    container._vnode = void 0;
    return;
  }
  if (oldVNode) {
    patchRoot(oldVNode, vnode);
  } else {
    const el = createElement(vnode);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(el);
    vnode.el = el;
  }
  container._vnode = vnode;
}
function patchRoot(oldVNode, newVNode, container) {
  if (!isSameVNodeType(oldVNode, newVNode)) {
    const newEl = createElement(newVNode);
    const oldEl = oldVNode.el;
    if (oldEl && oldEl.parentNode) {
      oldEl.parentNode.replaceChild(newEl, oldEl);
    }
    newVNode.el = newEl;
    return;
  }
  const el = newVNode.el = oldVNode.el;
  if (!el) return;
  if (newVNode.type === null) {
    const newText = newVNode.children.length > 0 ? String(newVNode.children[0]) : "";
    if (el.textContent !== newText) {
      el.textContent = newText;
    }
    return;
  }
  if (typeof newVNode.type === "object") {
    return;
  }
  const element = el;
  patchProps(element, oldVNode.props, newVNode.props);
  patchChildren(element, oldVNode.children, newVNode.children);
}
export {
  Fragment,
  computed,
  createComponent,
  createElement,
  createTextVNode,
  customRef,
  defineComponent,
  effectScope,
  flush,
  getCurrentScope,
  h,
  hFragment,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  isSameVNodeType,
  isVNode,
  mountComponent,
  onScopeDispose,
  patch,
  proxyRefs,
  queueJob,
  queuePostFlushCb,
  reactive,
  readonly,
  ref,
  render,
  scheduler,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  toRaw,
  toRef,
  toRefs,
  triggerRef2 as triggerRef,
  unmountComponent,
  unref2 as unref,
  updateComponentProps,
  watch,
  watchEffect
};
//# sourceMappingURL=index.js.map
