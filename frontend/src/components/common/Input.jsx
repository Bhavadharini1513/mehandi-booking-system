function Input({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  icon = null,
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2C23]">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C5A059]">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-white border border-stone-300 rounded-lg ${
            icon ? "pl-10" : "px-4"
          } py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0F2C23] outline-none transition-all shadow-xs hover:border-stone-400`}
        />
      </div>
    </div>
  );
}

export default Input;
