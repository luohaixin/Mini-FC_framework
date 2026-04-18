import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button.js';

describe('Button', () => {
  it('should be defined', () => {
    expect(Button).toBeDefined();
    expect(Button.name).toBe('Button');
  });

  it('should have correct props definition', () => {
    expect(Button.props).toBeDefined();
    expect(Button.props?.type).toBeDefined();
    expect(Button.props?.size).toBeDefined();
    expect(Button.props?.disabled).toBeDefined();
    expect(Button.props?.loading).toBeDefined();
  });

  it('should have setup function', () => {
    expect(typeof Button.setup).toBe('function');
  });
});
