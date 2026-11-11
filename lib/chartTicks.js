// X-axis for the weekly bar charts: label every Nth week counted back from the LAST week, so the most
// recent slot (the current week) is always labelled. Chart.js's autoSkip counts from the first week, so
// the last label could land a week or more before the end of the axis. Gridlines are kept only at the
// labelled ticks, as autoSkip did.
export function endAnchoredX(count, maxLabels, base = {}) {
  const step = Math.max(1, Math.ceil(count / maxLabels));
  const labelled = i => (count - 1 - i) % step === 0;
  return {
    ...base,
    ticks: {
      ...base.ticks,
      autoSkip: false,
      callback(value) {
        return labelled(Number(value)) ? this.getLabelForValue(value) : '';
      },
    },
    grid: {
      ...base.grid,
      color: ctx => (labelled(ctx.index) ? '#1f2937' : 'rgba(0,0,0,0)'),
    },
  };
}
