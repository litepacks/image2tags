#!/usr/bin/env node

import { Command } from 'commander';
import { getImageTags } from './index';
import * as path from 'path';

const program = new Command();

program
  .version('1.0.0')
  .description('A CLI tool to get tags for a given image.')
  .argument('<imagePath>', 'Path to the image file.')
  .option('-k, --topK <number>', 'Number of top predictions to return', '10')
  .option('--json', 'Output results in JSON format')
  .action(async (imagePath, options) => {
    try {
      const fullPath = path.resolve(imagePath);
      const topK = parseInt(options.topK, 10);
      
      if (!options.json) {
        console.log('Processing image...');
      }
      
      const tags = await getImageTags(fullPath, topK);

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