import { defineComponent, ref, h, computed, reactive } from "@my-framework/core";
const Button = defineComponent({
  name: "Button",
  props: {
    type: { type: String, default: "default" },
    size: { type: String, default: "medium" },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const isPressed = ref(false);
    const handleClick = (event) => {
      if (props.disabled || props.loading) return;
      emit("click", event);
    };
    const handleMouseDown = () => {
      if (!props.disabled && !props.loading) {
        isPressed.value = true;
      }
    };
    const handleMouseUp = () => {
      isPressed.value = false;
    };
    return () => {
      const classNames = [
        "mf-button",
        `mf-button--${props.type}`,
        `mf-button--${props.size}`,
        props.disabled ? "mf-button--disabled" : "",
        props.loading ? "mf-button--loading" : "",
        isPressed.value ? "mf-button--pressed" : ""
      ].filter(Boolean).join(" ");
      return h("button", {
        class: classNames,
        disabled: props.disabled || props.loading,
        "aria-disabled": props.disabled || props.loading,
        onClick: handleClick,
        onMousedown: handleMouseDown,
        onMouseup: handleMouseUp,
        onMouseleave: handleMouseUp
      }, [
        props.loading ? h("span", { class: "mf-button__loading-icon mf-animate-spin" }, "⟳") : null,
        h("span", { class: "mf-button__content" }, "默认内容")
      ]);
    };
  }
});
const Input = defineComponent({
  name: "Input",
  props: {
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: "text" },
    clearable: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const isFocused = ref(false);
    const inputRef = ref(null);
    const showClear = computed(() => {
      return props.clearable && props.modelValue && !props.disabled;
    });
    const handleInput = (event) => {
      const target = event.target;
      emit("update:modelValue", target.value);
    };
    const handleFocus = (event) => {
      isFocused.value = true;
      emit("focus", event);
    };
    const handleBlur = (event) => {
      isFocused.value = false;
      emit("blur", event);
    };
    const handleClear = () => {
      var _a;
      emit("update:modelValue", "");
      (_a = inputRef.value) == null ? void 0 : _a.focus();
    };
    return () => {
      const classNames = [
        "mf-input",
        props.disabled ? "mf-input--disabled" : "",
        isFocused.value ? "mf-input--focused" : ""
      ].filter(Boolean).join(" ");
      return h("div", { class: classNames }, [
        h("input", {
          ref: inputRef,
          class: "mf-input__field",
          type: props.type,
          value: props.modelValue,
          placeholder: props.placeholder,
          disabled: props.disabled,
          "aria-disabled": props.disabled,
          onInput: handleInput,
          onFocus: handleFocus,
          onBlur: handleBlur
        }),
        showClear.value ? h("span", {
          class: "mf-input__clear",
          onClick: handleClear
        }, "✕") : null
      ]);
    };
  }
});
const Select = defineComponent({
  name: "Select",
  props: {
    modelValue: { type: [String, Number], default: void 0 },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: "请选择" }
  },
  setup(props, { emit }) {
    const isOpen = ref(false);
    const selectRef = ref(null);
    const selectedLabel = computed(() => {
      const selected = props.options.find((opt) => opt.value === props.modelValue);
      return (selected == null ? void 0 : selected.label) ?? "";
    });
    const handleToggle = () => {
      isOpen.value = !isOpen.value;
    };
    const handleSelect = (option) => {
      emit("update:modelValue", option.value);
      emit("change", option.value);
      isOpen.value = false;
    };
    const handleClickOutside = (event) => {
      if (selectRef.value && !selectRef.value.contains(event.target)) {
        isOpen.value = false;
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      const classNames = [
        "mf-select",
        isOpen.value ? "mf-select--open" : ""
      ].filter(Boolean).join(" ");
      return h("div", { class: classNames, ref: selectRef }, [
        h("div", {
          class: "mf-select__trigger",
          onClick: handleToggle
        }, [
          h("span", {
            class: selectedLabel.value ? "mf-select__value" : "mf-select__placeholder"
          }, selectedLabel.value || props.placeholder),
          h("span", { class: "mf-select__arrow" }, "▼")
        ]),
        isOpen.value ? h("div", { class: "mf-select__dropdown mf-animate-slide-up" }, [
          h(
            "ul",
            { class: "mf-select__list" },
            props.options.map(
              (option) => h("li", {
                class: [
                  "mf-select__option",
                  option.value === props.modelValue ? "mf-select__option--selected" : ""
                ].join(" "),
                onClick: () => handleSelect(option)
              }, option.label)
            )
          )
        ]) : null
      ]);
    };
  }
});
const Switch = defineComponent({
  name: "Switch",
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: "medium" }
  },
  setup(props, { emit }) {
    const handleClick = () => {
      if (props.disabled) return;
      emit("update:modelValue", !props.modelValue);
    };
    return () => {
      const classNames = [
        "mf-switch",
        `mf-switch--${props.size}`,
        props.modelValue ? "mf-switch--checked" : "",
        props.disabled ? "mf-switch--disabled" : ""
      ].filter(Boolean).join(" ");
      return h("button", {
        class: classNames,
        type: "button",
        role: "switch",
        "aria-checked": String(props.modelValue),
        "aria-disabled": props.disabled,
        disabled: props.disabled,
        onClick: handleClick
      }, [
        h("span", { class: "mf-switch__handle" })
      ]);
    };
  }
});
const Modal = defineComponent({
  name: "Modal",
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: "" },
    width: { type: [String, Number], default: 520 },
    closable: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: true }
  },
  setup(props, { emit, slots }) {
    const modalRef = ref(null);
    const handleClose = () => {
      emit("update:visible", false);
      emit("close");
    };
    const handleMaskClick = () => {
      if (props.maskClosable) {
        handleClose();
      }
    };
    const handleConfirm = () => {
      emit("confirm");
    };
    const handleKeydown = (event) => {
      if (event.key === "Escape" && props.visible) {
        handleClose();
      }
    };
    onMounted(() => {
      document.addEventListener("keydown", handleKeydown);
    });
    onUnmounted(() => {
      document.removeEventListener("keydown", handleKeydown);
    });
    return () => {
      var _a;
      if (!props.visible) return null;
      const widthStyle = typeof props.width === "number" ? `${props.width}px` : props.width;
      return h("div", { class: "mf-modal-root" }, [
        h("div", {
          class: "mf-modal-mask mf-animate-fade-in",
          onClick: handleMaskClick
        }),
        h("div", {
          class: "mf-modal-wrap",
          ref: modalRef
        }, [
          h("div", {
            class: "mf-modal mf-animate-slide-up",
            style: { width: widthStyle }
          }, [
            h("div", { class: "mf-modal__header" }, [
              h("div", { class: "mf-modal__title" }, props.title),
              props.closable ? h("button", {
                class: "mf-modal__close",
                onClick: handleClose
              }, "✕") : null
            ]),
            h("div", { class: "mf-modal__body" }, ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []),
            h("div", { class: "mf-modal__footer" }, [
              h("button", {
                class: "mf-modal__btn mf-modal__btn--default",
                onClick: handleClose
              }, "取消"),
              h("button", {
                class: "mf-modal__btn mf-modal__btn--primary",
                onClick: handleConfirm
              }, "确定")
            ])
          ])
        ])
      ]);
    };
  }
});
const Card = defineComponent({
  name: "Card",
  props: {
    title: { type: String, default: "" },
    bordered: { type: Boolean, default: true },
    shadow: { type: String, default: "always" }
  },
  setup(props, { slots }) {
    return () => {
      var _a, _b;
      const classNames = [
        "mf-card",
        props.bordered ? "mf-card--bordered" : "",
        `mf-card--shadow-${props.shadow}`
      ].filter(Boolean).join(" ");
      return h("div", { class: classNames }, [
        props.title || slots.header ? h("div", { class: "mf-card__header" }, [
          ((_a = slots.header) == null ? void 0 : _a.call(slots)) ?? h("span", { class: "mf-card__title" }, props.title)
        ]) : null,
        h("div", { class: "mf-card__body" }, ((_b = slots.default) == null ? void 0 : _b.call(slots)) ?? []),
        slots.footer ? h("div", { class: "mf-card__footer" }, slots.footer()) : null
      ]);
    };
  }
});
const List = defineComponent({
  name: "List",
  props: {
    dataSource: { type: Array, default: () => [] },
    bordered: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    emptyText: { type: String, default: "暂无数据" }
  },
  setup(props, { slots }) {
    return () => {
      const classNames = [
        "mf-list",
        props.bordered ? "mf-list--bordered" : ""
      ].filter(Boolean).join(" ");
      const data = props.dataSource;
      const isEmpty = data.length === 0;
      return h("div", { class: classNames }, [
        props.loading ? h("div", { class: "mf-list__loading" }, [
          h("span", { class: "mf-list__loading-icon mf-animate-spin" }, "⟳"),
          h("span", { class: "mf-list__loading-text" }, "加载中...")
        ]) : isEmpty ? h("div", { class: "mf-list__empty" }, props.emptyText) : h(
          "ul",
          { class: "mf-list__items" },
          data.map(
            (item, index) => {
              var _a;
              return h("li", {
                class: "mf-list__item",
                key: index
              }, ((_a = slots.renderItem) == null ? void 0 : _a.call(slots, item, index)) ?? []);
            }
          )
        )
      ]);
    };
  }
});
const toastQueue = reactive([]);
let toastId = 0;
function addToast(message, type, duration = 3e3) {
  const id = `toast-${++toastId}`;
  const toast = {
    id,
    message,
    type,
    duration
  };
  toastQueue.push(toast);
  setTimeout(() => {
    const index = toastQueue.findIndex((t) => t.id === id);
    if (index > -1) {
      toastQueue.splice(index, 1);
    }
  }, duration);
}
const ToastAPI = {
  info(message, duration) {
    addToast(message, "info", duration);
  },
  success(message, duration) {
    addToast(message, "success", duration);
  },
  error(message, duration) {
    addToast(message, "error", duration);
  },
  warning(message, duration) {
    addToast(message, "warning", duration);
  }
};
const ToastContainer = defineComponent({
  name: "ToastContainer",
  setup() {
    return () => {
      return h(
        "div",
        { class: "mf-toast-container" },
        toastQueue.map(
          (toast) => h("div", {
            class: `mf-toast mf-toast--${toast.type} mf-animate-slide-up`,
            key: toast.id
          }, [
            h("span", { class: "mf-toast__icon" }, getIcon(toast.type)),
            h("span", { class: "mf-toast__message" }, toast.message)
          ])
        )
      );
    };
  }
});
function getIcon(type) {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✕";
    case "warning":
      return "!";
    default:
      return "ℹ";
  }
}
const Loading = defineComponent({
  name: "Loading",
  props: {
    visible: { type: Boolean, default: false },
    text: { type: String, default: "加载中..." },
    fullscreen: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    return () => {
      var _a, _b;
      if (!props.visible) {
        return ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? null;
      }
      const classNames = [
        "mf-loading",
        props.fullscreen ? "mf-loading--fullscreen" : "mf-loading--local"
      ].filter(Boolean).join(" ");
      const spinner = h("div", { class: classNames }, [
        h("div", { class: "mf-loading__mask" }),
        h("div", { class: "mf-loading__content" }, [
          h("span", { class: "mf-loading__spinner mf-animate-spin" }, "⟳"),
          props.text ? h("span", { class: "mf-loading__text" }, props.text) : null
        ])
      ]);
      if (props.fullscreen) {
        return spinner;
      }
      return h("div", { class: "mf-loading-wrapper" }, [
        ((_b = slots.default) == null ? void 0 : _b.call(slots)) ?? [],
        spinner
      ]);
    };
  }
});
const Layout = defineComponent({
  name: "Layout",
  setup(props, { slots }) {
    return () => {
      var _a;
      return h("div", { class: "mf-layout" }, ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []);
    };
  }
});
const Header = defineComponent({
  name: "Header",
  setup(props, { slots }) {
    return () => {
      var _a;
      return h("header", { class: "mf-layout__header" }, ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []);
    };
  }
});
const Sider = defineComponent({
  name: "Sider",
  props: {
    width: { type: [String, Number], default: 200 },
    collapsible: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false }
  },
  setup(props, { emit, slots }) {
    const handleToggle = () => {
      emit("update:collapsed", !props.collapsed);
    };
    return () => {
      var _a;
      const widthStyle = props.collapsed ? "80px" : typeof props.width === "number" ? `${props.width}px` : props.width;
      const classNames = [
        "mf-layout__sider",
        props.collapsed ? "mf-layout__sider--collapsed" : ""
      ].filter(Boolean).join(" ");
      return h("aside", {
        class: classNames,
        style: { width: widthStyle }
      }, [
        h("div", { class: "mf-layout__sider-content" }, ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []),
        props.collapsible ? h("button", {
          class: "mf-layout__sider-trigger",
          onClick: handleToggle
        }, props.collapsed ? "→" : "←") : null
      ]);
    };
  }
});
const Content = defineComponent({
  name: "Content",
  setup(props, { slots }) {
    return () => {
      var _a;
      return h("main", { class: "mf-layout__content" }, ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []);
    };
  }
});
const Footer = defineComponent({
  name: "Footer",
  setup(props, { slots }) {
    return () => {
      var _a;
      return h("footer", { class: "mf-layout__footer" }, ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? []);
    };
  }
});
export {
  Button,
  Card,
  Content,
  Footer,
  Header,
  Input,
  Layout,
  List,
  Loading,
  Modal,
  Select,
  Sider,
  Switch,
  ToastAPI as Toast,
  ToastAPI,
  ToastContainer
};
//# sourceMappingURL=index.js.map
