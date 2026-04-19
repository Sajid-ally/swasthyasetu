const ErrorState = ({ title = "Something went wrong", message = "Please try again later." }) => {
  return (
    <div className="rounded-card border border-red-500/20 bg-red-500/10 p-6 text-center">
      <h3 className="text-lg font-semibold text-red-300">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{message}</p>
    </div>
  );
};

export default ErrorState;