export const InputField = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
}: any) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      <Icon size={18} className="absolute left-3 top-3 text-gray-400" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          pl-10 pr-4 py-2.5
          border border-gray-300
          bg-white
          text-gray-900
          focus:outline-none
          focus:border-gray-500
          transition
        "
      />
    </div>
  </div>
);
