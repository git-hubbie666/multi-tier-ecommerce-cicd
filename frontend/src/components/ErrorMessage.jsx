export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="error-state">
      <p>{message}</p>
      {onRetry && (
        <button className="btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
