import { getImageTags, ImageTagOptions } from '../src/index';
import * as path from 'path';
import * as fs from 'fs';

describe('Image to Tags', () => {
  const fixturesPath = path.join(__dirname, 'fixtures');
  const imagePath = path.join(fixturesPath, 'sample.jpg');

  beforeAll(() => {
    // Make sure the sample image file exists before running tests.
    if (!fs.existsSync(imagePath)) {
      throw new Error(
        `Test image not found: ${imagePath}. Please add an image named 'sample.jpg' to the 'tests/fixtures' folder.`
      );
    }
  });

  it('should return an array of tags for a given image', async () => {
    // Extend the Jest timeout as model loading can be slow.
    jest.setTimeout(30000); 

    const tags = await getImageTags(imagePath);

    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
  });

  it('should return tags with className, probability, and tags properties', async () => {
    jest.setTimeout(30000);

    const tags = await getImageTags(imagePath, 1);
    
    expect(tags[0]).toHaveProperty('className');
    expect(tags[0]).toHaveProperty('probability');
    expect(tags[0]).toHaveProperty('tags');
    expect(typeof tags[0].className).toBe('string');
    expect(typeof tags[0].probability).toBe('number');
    expect(Array.isArray(tags[0].tags)).toBe(true);
    expect(tags[0].tags.length).toBeGreaterThan(0);
    expect(typeof tags[0].tags[0]).toBe('string');
  });

  it('should accept options object with topK', async () => {
    jest.setTimeout(30000);

    const options: ImageTagOptions = { topK: 3 };
    const tags = await getImageTags(imagePath, options);
    
    expect(tags.length).toBe(3);
  });

  it('should accept options object with modelVersion', async () => {
    jest.setTimeout(30000);

    const options: ImageTagOptions = { topK: 5, modelVersion: 1 };
    const tags = await getImageTags(imagePath, options);
    
    expect(tags.length).toBe(5);
    expect(tags[0]).toHaveProperty('className');
  });

  it('should throw an error if file size exceeds maxFileSize', async () => {
    jest.setTimeout(30000);

    const options: ImageTagOptions = { maxFileSize: 100 }; // 100 bytes - very small
    await expect(getImageTags(imagePath, options)).rejects.toThrow(/exceeds the maximum allowed size/);
  });

  it('should process image when file size is within limit', async () => {
    jest.setTimeout(30000);

    const stats = fs.statSync(imagePath);
    const options: ImageTagOptions = { maxFileSize: stats.size + 1000 }; // Set limit above actual size
    const tags = await getImageTags(imagePath, options);
    
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
  });

  it('should throw an error if the image path is invalid', async () => {
    const invalidImagePath = 'path/to/non/existent/image.jpg';
    await expect(getImageTags(invalidImagePath)).rejects.toThrow();
  });

  it('should maintain backward compatibility with numeric topK parameter', async () => {
    jest.setTimeout(30000);

    const tags = await getImageTags(imagePath, 5);
    
    expect(tags.length).toBe(5);
  });
}); 