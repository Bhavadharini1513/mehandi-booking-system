function Button({ text, loading }) {
  return (
    <button
      type="submit"
      className="w-full bg-green-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
    >
      {loading ? "Please Wait..." : text}
    </button>
  );
}

export default Button;
