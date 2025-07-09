import { getImageTags } from '../src/index';
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

  it('should throw an error if the image path is invalid', async () => {
    const invalidImagePath = 'path/to/non/existent/image.jpg';
    await expect(getImageTags(invalidImagePath)).rejects.toThrow('Could not classify the image.');
  });
}); 