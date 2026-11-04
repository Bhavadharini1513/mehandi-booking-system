function Button({ text, loading, type = "submit", onClick, className = "", variant = "primary" }) {
  const baseClasses =
    "w-full py-3 px-5 rounded-lg font-medium transition-all duration-200 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#0F2C23] to-[#163E32] text-amber-200 border border-amber-500/30 hover:border-amber-400 hover:shadow-md",
    gold: "bg-[#C5A059] hover:bg-[#b58f48] text-[#0F2C23] font-semibold border border-amber-400/40 hover:shadow-md",
    outline:
      "bg-transparent text-[#0F2C23] border border-[#0F2C23]/30 hover:bg-[#0F2C23]/5",
    danger: "bg-rose-700 hover:bg-rose-800 text-white border border-rose-600/40",
  };

  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>Please Wait...</span>
        </>
      ) : (
        text
      )}
    </button>
  );
}

export default Button;
