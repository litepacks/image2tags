import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

interface Tag {
  className: string;
  tags: string[];
  probability: number;
}

let modelCache: mobilenet.MobileNet | null = null;

async function loadModel(): Promise<mobilenet.MobileNet> {
  if (!modelCache) {
    modelCache = await mobilenet.load();
  }
  return modelCache;
}

export async function getImageTags(imagePath: string, topK = 10): Promise<Tag[]> {
  try {
    const image = await readFile(imagePath);
    const imageTensor = tf.node.decodeImage(new Uint8Array(image), 3) as tf.Tensor3D;

    const model = await loadModel();
    const predictions = await model.classify(imageTensor);

    const processedPredictions = predictions.map((p: { className: string; probability: number }) => ({
      ...p,
      tags: p.className.split(',').map((s: string) => s.trim()),
    }));

    return processedPredictions.slice(0, topK);
  } catch (error) {
    console.error('An error occurred while processing the image:', error);
    throw new Error('Could not classify the image.');
  }
} 