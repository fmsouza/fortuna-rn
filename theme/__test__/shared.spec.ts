import { SharedBaseTheme } from "../shared";

describe('SharedBaseTheme', () => {

  describe('.dimensions', () => {
    it.each([
      [undefined, 8],
      [1, 8],
      [2, 16],
      [3, 24],
      [4, 32],
      [5, 40],
    ])('should return %i when spacing is called with %i', (input, expected) => {
      expect(SharedBaseTheme.dimensions.spacing(input)).toBe(expected);
    });
  });

  describe('.radius', () => {
    it.each([
      [undefined, 2],
      [1, 2],
      [2, 4],
      [3, 6],
      [4, 8],
      [5, 10],
    ])('should return %i when radius is called with %i', (input, expected) => {
      expect(SharedBaseTheme.dimensions.radius(input)).toBe(expected);
    });
  });

  describe('.border', () => {
    it.each([
      [undefined, 1],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
    ])('should return %i when border is called with %i', (input, expected) => {
      expect(SharedBaseTheme.dimensions.border(input)).toBe(expected);
    });
  });
});