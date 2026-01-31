import React from 'react';

interface InputGroupProps {
  id: string;
  type: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  actionLink?: {
    text: string;
    href: string;
  };
}

export const InputGroup: React.FC<InputGroupProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  placeholder,
  required,
  actionLink,
}) => {
  return (
    <div className="relative group">
      <div className="flex justify-between items-end mb-1">
        <label 
          htmlFor={id} 
          className="text-[10px] uppercase tracking-widest text-aurelia-gray block"
        >
          {label}
        </label>
        {actionLink && (
          <a 
            href={actionLink.href} 
            className="text-[10px] uppercase tracking-widest text-aurelia-gray hover:text-black transition-colors"
          >
            {actionLink.text}
          </a>
        )}
      </div>
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border-aurelia-silver border-t-0 border-x-0 border-b px-0 py-4 focus:ring-0 focus:border-black transition-colors placeholder:text-aurelia-gray/50 text-sm bg-transparent outline-none text-aurelia-black"
      />
    </div>
  );
};