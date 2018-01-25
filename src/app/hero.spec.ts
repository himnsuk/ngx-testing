import { Hero } from './hero';

describe('Hero', () => {
  it('should create an instance', () => {
    let hero = new Hero();
    expect(hero).toBeTruthy();
  });
});
