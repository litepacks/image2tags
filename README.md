# Image to Tags

This package uses TensorFlow.js and the pre-trained MobileNet model to recognize objects and scenes in an image and generate relevant keywords (tags).

[![NPM Version](https://img.shields.io/npm/v/image2tags.svg)](https://www.npmjs.com/package/image2tags)
[![NPM Downloads](https://img.shields.io/npm/dm/image2tags.svg)](https://www.npmjs.com/package/image2tags)

## Features

-   Processes images from a local file path.
-   Uses the popular and efficient MobileNet model (versions 1 and 2 supported).
-   File size limit control to prevent processing of oversized images.
-   Mimetype validation to ensure only supported image formats are processed.
-   Supports JPEG, PNG, BMP, WebP, and TIFF formats (excludes GIF, SVG, and other unsupported formats).
-   Written in TypeScript and includes type definitions.
-   Provides an easy-to-use and flexible API.

## Installation

You can add the package to your project using npm or yarn:

```bash
npm install image2tags
```

or

```bash
yarn add image2tags
```

## Usage

After importing the package into your project, you can use the `getImageTags` function. This function takes the file path of an image and optional configuration options, and returns a `Promise` that resolves with an array containing the tags and their probabilities.

### Basic Usage

```typescript
import { getImageTags } from 'image2tags';
import * as path from 'path';

async function main() {
  try {
    const imagePath = path.join(__dirname, 'path/to/your/image.jpg');
    const tags = await getImageTags(imagePath);
    
    console.log('Detected Tags:');
    tags.forEach(tag => {
      console.log(`- ${tag.className} (Probability: ${(tag.probability * 100).toFixed(2)}%)`);
    });
  } catch (error) {
    console.error('An error occurred while getting tags:', error);
  }
}

main();
```

### Advanced Usage with Options

```typescript
import { getImageTags, ImageTagOptions } from 'image2tags';
import * as path from 'path';

async function main() {
  try {
    const imagePath = path.join(__dirname, 'path/to/your/image.jpg');
    
    // Configure options
    const options: ImageTagOptions = {
      topK: 5,                    // Return top 5 predictions
      maxFileSize: 5242880,       // Max 5MB file size
      modelVersion: 2             // Use MobileNet v2 (default)
    };
    
    const tags = await getImageTags(imagePath, options);
    
    console.log('Detected Tags:');
    tags.forEach(tag => {
      console.log(`- ${tag.className} (Probability: ${(tag.probability * 100).toFixed(2)}%)`);
    });
  } catch (error) {
    console.error('An error occurred while getting tags:', error);
  }
}

main();
```

### CLI Usage

You can also use this package as a command-line tool.

```bash
image2tags <path/to/your/image.jpg>
```

**Options:**

- `-k, --topK <number>`: Specify the number of top predictions to return (default: 10).
- `--json`: Output results in JSON format.
- `--max-size <bytes>`: Maximum file size in bytes (e.g., 5242880 for 5MB).
- `--model <version>`: MobileNet model version (1 or 2, default: 2).

**Examples:**

```bash
# Basic usage
image2tags tests/fixtures/sample.jpg -k 5

# With file size limit (5MB)
image2tags tests/fixtures/sample.jpg --max-size 5242880

# Using MobileNet v1
image2tags tests/fixtures/sample.jpg --model 1

# JSON output with all options
image2tags tests/fixtures/sample.jpg -k 3 --max-size 10485760 --model 2 --json
```

**Example JSON output:**

```bash
image2tags tests/fixtures/sample.jpg --json
```

Which will produce the following output:
```json
[
  {
    "className": "brass, memorial tablet, plaque",
    "probability": 0.28563258051872253,
    "tags": [
      "brass",
      "memorial tablet",
      "plaque"
    ]
  },
  {
    "className": "envelope",
    "probability": 0.19800801575183868,
    "tags": [
      "envelope"
    ]
  }
]
```

### API Reference

#### `getImageTags(imagePath: string, options?: ImageTagOptions | number): Promise<Tag[]>`

**Parameters:**

-   `imagePath` (string, required): The file path of the image to be processed.
-   `options` (ImageTagOptions | number, optional): Configuration options or a number for backward compatibility.
    -   If a number is provided, it's treated as `topK` (for backward compatibility).
    -   If an object is provided, it can include:
        -   `topK` (number, optional, default: 10): The number of top predictions to return.
        -   `maxFileSize` (number, optional): Maximum file size in bytes. Files exceeding this size will throw an error.
        -   `modelVersion` (1 | 2, optional, default: 2): MobileNet model version to use.

**Returns:**

-   `Promise<Tag[]>`: A promise that resolves to an array of tag objects.

**Tag Object:**

```typescript
interface Tag {
  className: string;      // Full classification name (may include multiple synonyms)
  tags: string[];         // Array of individual tag strings
  probability: number;    // Confidence score (0-1)
}
```

### Supported Image Formats

The package supports the following image formats:
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- BMP (`.bmp`)
- WebP (`.webp`)
- TIFF (`.tif`, `.tiff`)

**Note:** GIF, SVG, and other formats are **not supported** as they cannot be processed by TensorFlow.js image classification models.

### Error Handling

The package will throw errors in the following cases:
- File size exceeds the `maxFileSize` limit (if specified)
- Unsupported file format (e.g., GIF, SVG)
- Invalid or corrupted image file
- File not found

```typescript
try {
  const tags = await getImageTags(imagePath, { maxFileSize: 1048576 }); // 1MB limit
} catch (error) {
  if (error.message.includes('exceeds the maximum allowed size')) {
    console.error('File is too large');
  } else if (error.message.includes('Unsupported file type')) {
    console.error('Invalid image format');
  } else {
    console.error('Error processing image:', error);
  }
}
```

## Running Tests

To run the tests, clone the project, install the dependencies, and then run the test command:

```bash
git clone https://github.com/litepacks/image2tags.git
cd image2tags
npm install
npm test
```

**Note:** For the tests to run, there must be an image file named `sample.jpg` in the `tests/fixtures` folder.

## Contributing

Contributions are always welcome! Please open an issue to discuss your proposed changes before submitting a pull request.

## License

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) License. 