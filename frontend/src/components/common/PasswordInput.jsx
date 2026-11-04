import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2C23]">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full bg-white border border-stone-300 rounded-lg px-4 py-2.5 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#0F2C23] outline-none transition-all shadow-xs hover:border-stone-400"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C5A059] transition-colors cursor-pointer"
        >
          {show ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
