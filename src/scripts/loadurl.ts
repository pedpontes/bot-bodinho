require('module-alias/register');

//CMD yarn ts-node src/scripts/loadurl.ts

import { execSync } from 'child_process';

async function search(query: string): Promise<string> {
  const cmd = [
    'yt-dlp',
    '--skip-download',
    '--no-playlist',
    '--default-search',
    'ytsearch',
    '--flat-playlist',
    '--print',
    'url',
    `ytsearch1:${query}`,
  ];

  const output = execSync(cmd.join(' ')).toString().trim();
  console.log('Output:', output);
  return output; // já é a URL direta
}

(async () => await search('avoure'))();
