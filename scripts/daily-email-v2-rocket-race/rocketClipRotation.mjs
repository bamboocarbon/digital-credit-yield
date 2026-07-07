// scripts/daily-email-v2-rocket-race/rocketClipRotation.mjs
//
// Controls which NASA launch clip plays as the intro, on a 7-days-per-clip
// rotation: Launch 1 plays for a week, then Launch 2, then repeats. Add more
// entries to ROCKET_CLIPS as new clips are cut — the cycle length grows
// automatically (N clips = N*7-day cycle) and old entries keep rotating back
// in rather than needing to be deleted.

export const DAYS_PER_CLIP = 7;

// Deliberately no file path here — production (public/rocket-clips/) and this
// preview folder (assets/) keep the clips in different places, so each
// consumer maps `key` to its own path. Keeps this module a pure schedule.
export const ROCKET_CLIPS = [
  { key: 'launch1_ixpe',     label: 'IXPE launch (Falcon 9, Dec 2021)' },
  { key: 'launch2_blueghost', label: 'Blue Ghost Mission 1 launch (Falcon 9, Jan 2025)' },
];

// Day 0 of the rotation — deliberately fixed rather than "today" so the
// schedule doesn't shift every time this file is touched or re-deployed.
export const ROTATION_START = new Date('2026-07-07T00:00:00Z');

export function getDailyRocketClip(offset = 0) {
  const daysSinceStart = Math.floor((Date.now() - ROTATION_START.getTime()) / 86400000) + offset;
  const cycleLength = ROCKET_CLIPS.length * DAYS_PER_CLIP;
  const dayInCycle = ((daysSinceStart % cycleLength) + cycleLength) % cycleLength;
  const clipIndex = Math.floor(dayInCycle / DAYS_PER_CLIP);
  return ROCKET_CLIPS[clipIndex];
}
