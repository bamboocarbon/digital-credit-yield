#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  DCY Thought of the Day — auto text backfill
#  Finds entries with an X post URL but no thought text, reads
#  the quote-card image via Claude, and fills the text in.
# ─────────────────────────────────────────────────────────────

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "═══════════════════════════════════════════════════════"
echo "  DCY Thought of the Day — text backfill"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Dry run first — nothing is written yet."
echo ""

node scripts/backfillThoughtText.js

echo ""
read -p "Write these to the live site now? (y/N) " CONFIRM
if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
  echo ""
  node scripts/backfillThoughtText.js --apply
else
  echo "Skipped — nothing written."
fi

echo ""
read -p "Press Enter to close this window…"
