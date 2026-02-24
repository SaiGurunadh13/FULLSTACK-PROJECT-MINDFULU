function Button({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
