// scripts/dailyTweet.js
// Run via: node scripts/dailyTweet.js

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';
import { generateDailyInsight } from './insightEngine.js';

const __dir = dirname(fileURLToPath(import.meta.url));

async function run() {
  const missing = [
    'TWITTER_API_KEY', 'TWITTER_API_SECRET',
    'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_TOKEN_SECRET',
  ].filter(k => !process.env[k]);
  if (missing.length > 0) throw new Error(`Missing env vars: ${missing.join(', ')}`);

  console.log('Fetching market data...');
  const { tweetText } = await generateDailyInsight();

  console.log('\n--- Tweet preview ---');
  console.log(tweetText);
  console.log(`\nString length: ${tweetText.length} chars (Twitter counts URLs as 23)`);

  const client = new TwitterApi({
    appKey:       process.env.TWITTER_API_KEY,
    appSecret:    process.env.TWITTER_API_SECRET,
    accessToken:  process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const logoPath = join(__dir, '..', 'public', 'logo-tweet.png');
  let mediaId;
  if (existsSync(logoPath)) {
    mediaId = await client.v1.uploadMedia(logoPath, { mimeType: 'image/png' });
    console.log(`\nUploaded logo, media ID: ${mediaId}`);
  }

  const tweetParams = mediaId ? { media: { media_ids: [mediaId] } } : {};
  const { data } = await client.v2.tweet(tweetText, tweetParams);
  console.log(`\nPosted! Tweet ID: ${data.id}`);
}

run().catch(err => {
  console.error('\nFailed to post tweet:', err.message || err);
  process.exit(1);
});
