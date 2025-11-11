#!/usr/bin/env node

import { Command } from 'commander';
import { getImageTags, ImageTagOptions } from './index';
import * as path from 'path';

const program = new Command();

interface CliOptions {
  topK: string;
  json?: boolean;
  maxSize?: string;
  model?: string;
}

program
  .version('1.0.0')
  .description('A CLI tool to get tags for a given image.')
  .argument('<imagePath>', 'Path to the image file.')
  .option('-k, --topK <number>', 'Number of top predictions to return', '10')
  .option('--json', 'Output results in JSON format')
  .option('--max-size <bytes>', 'Maximum file size in bytes (e.g., 5242880 for 5MB)')
  .option('--model <version>', 'MobileNet model version (1 or 2)', '2')
  .action(async (imagePath: string, options: CliOptions) => {
    try {
      const fullPath = path.resolve(imagePath);
      const topK = parseInt(options.topK, 10);
      const maxFileSize = options.maxSize ? parseInt(options.maxSize, 10) : undefined;
      const modelVersion = options.model ? parseInt(options.model, 10) as 1 | 2 : 2;

      // Validate model version
      if (modelVersion !== 1 && modelVersion !== 2) {
        throw new Error('Model version must be 1 or 2');
      }

      // Validate max file size
      if (maxFileSize !== undefined && (isNaN(maxFileSize) || maxFileSize <= 0)) {
        throw new Error('Max file size must be a positive number');
      }
      
      if (!options.json) {
        console.log('Processing image...');
      }
      
      const tagOptions: ImageTagOptions = {
        topK,
        maxFileSize,
        modelVersion
      };

      const tags = await getImageTags(fullPath, tagOptions);

      if (options.json) {
        console.log(JSON.stringify(tags, null, 2));
      } else {
        console.log('\nDetected Tags:');
        tags.forEach(tag => {
          const probability = (tag.probability * 100).toFixed(2);
          console.log(`- ${tag.className} (Probability: ${probability}%)`);
        });
      }
    } catch (error) {
      if (options.json) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error(JSON.stringify({ error: 'Could not classify the image.', details: errorMessage }, null, 2));
      } else {
        if (error instanceof Error) {
          console.error(`\nError: ${error.message}`);
        } else {
          console.error('\nAn unknown error occurred.');
        }
      }
      process.exit(1);
    }
  });

program.parse(process.argv); 