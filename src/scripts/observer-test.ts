require('module-alias/register');

import { addMusicToSessionObserver } from '@/main/observers/add-music';
// cmd: yarn ts-node src/scripts/observer-test.ts

import { any_music_queue } from '@/mocks/music/music';

const observer = addMusicToSessionObserver;

observer['123'] = {
  queue: [any_music_queue, any_music_queue],
};

// console.log(observer);
