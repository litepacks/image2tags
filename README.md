# Image to Tags

This package uses TensorFlow.js and the pre-trained MobileNet model to recognize objects and scenes in an image and generate relevant keywords (tags).

[![NPM Version](https://img.shields.io/npm/v/image2tags.svg)](https://www.npmjs.com/package/image2tags)
[![NPM Downloads](https://img.shields.io/npm/dm/image2tags.svg)](https://www.npmjs.com/package/image2tags)

## Features

-   Processes images from a local file path.
-   Uses the popular and efficient MobileNet model.
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

After importing the package into your project, you can use the `getImageTags` function. This function takes the file path of an image as a parameter and returns a `Promise`. This `Promise` resolves with an array containing the tags and their probabilities.

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

### CLI Usage

You can also use this package as a command-line tool.

```bash
image2tags <path/to/your/image.jpg>
```

**Options:**

- `-k, --topK <number>`: Specify the number of top predictions to return (default: 10).
- `--json`: Output results in JSON format.

**Example:**

```bash
image2tags tests/fixtures/sample.jpg -k 5
```

**Example with JSON output:**

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

### Parameters

-   `imagePath` (string, required): The file path of the image to be processed.
-   `topK` (number, optional, default: 10): The number of top predictions to return.

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