import { describe, it, expect } from 'vitest';
import { Input } from './Input.js';

describe('Input', () => {
  it('should be defined', () => {
    expect(Input).toBeDefined();
    expect(Input.name).toBe('Input');
  });

  it('should have correct props definition', () => {
    expect(Input.props).toBeDefined();
    expect(Input.props?.modelValue).toBeDefined();
    expect(Input.props?.placeholder).toBeDefined();
    expect(Input.props?.disabled).toBeDefined();
    expect(Input.props?.type).toBeDefined();
    expect(Input.props?.clearable).toBeDefined();
  });
});
