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

export async function getImageTags(imagePath: string, topK = 10): Promise<Tag[]> {
  try {
    const image = await readFile(imagePath);
    const imageTensor = tf.node.decodeImage(new Uint8Array(image), 3) as tf.Tensor3D;

    const model = await mobilenet.load();
    const predictions = await model.classify(imageTensor);

    const processedPredictions = predictions.map(p => ({
      ...p,
      tags: p.className.split(',').map(s => s.trim()),
    }));

    return processedPredictions.slice(0, topK);
  } catch (error) {
    console.error('An error occurred while processing the image:', error);
    throw new Error('Could not classify the image.');
  }
} 