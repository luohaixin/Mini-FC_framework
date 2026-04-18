import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  defineComponent,
  mountComponent,
  unmountComponent,
  updateComponentProps,
  type DefineComponentOptions,
  type ComponentInstance,
  type VNode
} from './defineComponent.js';
import { ref } from '../reactivity/index.js';

describe('defineComponent', () => {
  describe('basic component creation', () => {
    it('should create a component with name', () => {
      const component = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      expect(component.name).toBe('TestComponent');
      expect(typeof component.setup).toBe('function');
    });

    it('should execute setup function', () => {
      const setupFn = vi.fn(() => () => ({ type: 'div', props: {}, children: [] }));

      const component = defineComponent({
        name: 'TestComponent',
        setup: setupFn
      });

      const container = document.createElement('div');
      mountComponent(component, container);

      expect(setupFn).toHaveBeenCalled();
    });

    it('should return render function from setup', () => {
      const renderFn = () => ({ type: 'div', props: {}, children: [] });

      const component = defineComponent({
        name: 'TestComponent',
        setup() {
          return renderFn;
        }
      });

      const container = document.createElement('div');
      const instance = mountComponent(component, container);

      expect(typeof instance.setupResult).toBe('function');
    });
  });

  describe('props definition', () => {
    it('should accept props with type', () => {
      const component = defineComponent({
        name: 'PropsComponent',
        props: {
          title: String,
          count: Number,
          active: Boolean
        },
        setup(props) {
          return () => ({ type: 'div', props: {}, children: [props.title || ''] });
        }
      });

      const container = document.createElement('div');
      const instance = mountComponent(component, container, { title: 'Hello', count: 42, active: true });

      expect(instance.props.value.title).toBe('Hello');
      expect(instance.props.value.count).toBe(42);
      expect(instance.props.value.active).toBe(true);
    });

    it('should apply default values', () => {
      const component = defineComponent({
        name: 'DefaultPropsComponent',
        props: {
          title: { type: String, default: 'Default Title' },
          count: { type: Number, default: 0 }
        },
        setup(props) {
          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      const container = document.createElement('div');
      const instance = mountComponent(component, container);

      expect(instance.props.value.title).toBe('Default Title');
      expect(instance.props.value.count).toBe(0);
    });

    it('should support function default values', () => {
      const component = defineComponent({
        name: 'FunctionDefaultComponent',
        props: {
          items: { type: Array, default: () => [] }
        },
        setup(props) {
          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      const container = document.createElement('div');
      const instance = mountComponent(component, container);

      expect(Array.isArray(instance.props.value.items)).toBe(true);
    });

    it('should handle required props', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const component = defineComponent({
        name: 'RequiredPropsComponent',
        props: {
          requiredProp: { type: String, required: true }
        },
        setup(props) {
          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      const container = document.createElement('div');
      mountComponent(component, container);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required prop')
      );

      consoleSpy.mockRestore();
    });

    it('should validate prop types', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const component = defineComponent({
        name: 'TypeCheckComponent',
        props: {
          count: Number,
          title: String
        },
        setup(props) {
          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      const container = document.createElement('div');
      mountComponent(component, container, { count: 'not a number', title: 123 });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid prop: type check failed')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('setup context', () => {
    it('should provide emit function in context', () => {
      const setupFn = vi.fn((props, context) => {
        expect(typeof context.emit).toBe('function');
        return () => ({ type: 'div', props: {}, children: [] });
      });

      const component = defineComponent({
        name: 'EmitComponent',
        setup: setupFn
      });

      const container = document.createElement('div');
      mountComponent(component, container);

      expect(setupFn).toHaveBeenCalled();
    });

    it('should emit events', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const component = defineComponent({
        name: 'EmitTestComponent',
        setup(props, { emit }) {
          emit('customEvent', 'arg1', 'arg2');
          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      const container = document.createElement('div');
      mountComponent(component, container);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('emitted event "customEvent"'),
        ['arg1', 'arg2']
      );

      consoleSpy.mockRestore();
    });
  });

  describe('component lifecycle', () => {
    it('should mount component', () => {
      const component = defineComponent({
        name: 'LifecycleComponent',
        setup() {
          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      const container = document.createElement('div');
      const instance = mountComponent(component, container);

      expect(instance.isMounted).toBe(true);
      expect(instance.name).toBe('LifecycleComponent');
    });

    it('should unmount component', () => {
      const component = defineComponent({
        name: 'UnmountComponent',
        setup() {
          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      const container = document.createElement('div');
      const instance = mountComponent(component, container);

      unmountComponent(instance);

      expect(instance.isMounted).toBe(false);
    });

    it('should update component props', () => {
      const component = defineComponent({
        name: 'UpdatePropsComponent',
        props: {
          count: Number
        },
        setup(props) {
          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      const container = document.createElement('div');
      const instance = mountComponent(component, container, { count: 0 });

      expect(instance.props.value.count).toBe(0);

      updateComponentProps(instance, { count: 5 });

      expect(instance.props.value.count).toBe(5);
    });
  });

  describe('setup return values', () => {
    it('should support render function return', () => {
      const component = defineComponent({
        name: 'RenderFnComponent',
        setup() {
          return () => ({
            type: 'div',
            props: { class: 'test' },
            children: ['Hello World']
          });
        }
      });

      const container = document.createElement('div');
      const instance = mountComponent(component, container);
      const renderFn = instance.setupResult as () => VNode;
      const vnode = renderFn();

      expect(vnode.type).toBe('div');
      expect(vnode.props.class).toBe('test');
      expect(vnode.children).toEqual(['Hello World']);
    });

    it('should support object return from setup', () => {
      const component = defineComponent({
        name: 'ObjectReturnComponent',
        setup() {
          const count = ref(0);
          const increment = () => count.value++;

          return { count, increment };
        }
      });

      const container = document.createElement('div');
      const instance = mountComponent(component, container);

      expect(typeof instance.setupResult).toBe('object');
      expect('count' in (instance.setupResult as object)).toBe(true);
      expect('increment' in (instance.setupResult as object)).toBe(true);
    });
  });

  describe('type inference', () => {
    it('should infer props types correctly', () => {
      const component = defineComponent({
        name: 'TypeInferenceComponent',
        props: {
          title: String,
          count: { type: Number, default: 0 },
          items: { type: Array as () => string[], default: () => [] }
        },
        setup(props) {
          // TypeScript should infer correct types
          const title: string = props.title;
          const count: number = props.count;
          const items: string[] = props.items;

          return () => ({ type: 'div', props: {}, children: [] });
        }
      });

      expect(component.name).toBe('TypeInferenceComponent');
    });
  });
});
