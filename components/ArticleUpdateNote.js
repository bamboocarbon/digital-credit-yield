// Dated update note shown under an article's title, before the body.
// The article itself is left as written; the note says what has changed since.
export default function ArticleUpdateNote({ date, colour = '#9ca3af', children }) {
  return (
    <p
      style={{
        borderLeft: `3px solid ${colour}`,
        borderRight: `3px solid ${colour}`,
        padding: '0 44px',
        fontStyle: 'italic',
      }}
    >
      <strong>Update, {date}:</strong> {children}
    </p>
  );
}
