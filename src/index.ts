import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as fs from 'fs';
import { promisify } from 'util';
import { fromFile as fileTypeFromFile } from 'file-type';

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

interface Tag {
  className: string;
  tags: string[];
  probability: number;
}

export interface ImageTagOptions {
  topK?: number;
  maxFileSize?: number; // in bytes
  modelVersion?: 1 | 2; // MobileNet version
}

// Supported image mimetypes (excluding GIF, SVG, and other unsupported formats)
const SUPPORTED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/bmp',
  'image/webp',
  'image/tiff'
];

let modelCache: mobilenet.MobileNet | null = null;

async function loadModel(version: 1 | 2 = 2): Promise<mobilenet.MobileNet> {
  if (!modelCache || (modelCache as any).version !== version) {
    modelCache = await mobilenet.load({ version });
    (modelCache as any).version = version;
  }
  return modelCache;
}

async function validateImageFile(imagePath: string, maxFileSize?: number): Promise<void> {
  // Check file size if maxFileSize is specified
  if (maxFileSize !== undefined && maxFileSize > 0) {
    const stats = await stat(imagePath);
    if (stats.size > maxFileSize) {
      throw new Error(`File size (${stats.size} bytes) exceeds the maximum allowed size (${maxFileSize} bytes).`);
    }
  }

  // Check file mimetype
  const fileType = await fileTypeFromFile(imagePath);
  
  if (!fileType) {
    throw new Error('Unable to determine file type. The file may not be a valid image.');
  }

  if (!SUPPORTED_MIMETYPES.includes(fileType.mime)) {
    throw new Error(`Unsupported file type: ${fileType.mime}. Supported types are: ${SUPPORTED_MIMETYPES.join(', ')}`);
  }
}

export async function getImageTags(imagePath: string, options?: ImageTagOptions | number): Promise<Tag[]> {
  try {
    // Handle backward compatibility: if options is a number, treat it as topK
    let topK = 10;
    let maxFileSize: number | undefined;
    let modelVersion: 1 | 2 = 2;

    if (typeof options === 'number') {
      topK = options;
    } else if (options) {
      topK = options.topK ?? 10;
      maxFileSize = options.maxFileSize;
      modelVersion = options.modelVersion ?? 2;
    }

    // Validate image file
    await validateImageFile(imagePath, maxFileSize);

    const image = await readFile(imagePath);
    const imageTensor = tf.node.decodeImage(new Uint8Array(image), 3) as tf.Tensor3D;

    const model = await loadModel(modelVersion);
    const predictions = await model.classify(imageTensor);

    const processedPredictions = predictions.map((p: { className: string; probability: number }) => ({
      ...p,
      tags: p.className.split(',').map((s: string) => s.trim()),
    }));

    return processedPredictions.slice(0, topK);
  } catch (error) {
    console.error('An error occurred while processing the image:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Could not classify the image.');
  }
} 