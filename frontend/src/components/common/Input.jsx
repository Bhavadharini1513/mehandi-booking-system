function Input({ label, type = "text", name, placeholder, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-gray-700 font-medium">{label}</label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
      />
    </div>
  );
}

export default Input;
