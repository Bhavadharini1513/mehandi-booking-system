import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordInput({ label, name, placeholder, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label className="block mb-2 text-gray-700 font-medium">{label}</label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-4"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
