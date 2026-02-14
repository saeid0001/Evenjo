import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
  inputFild?: (value: string) => void;
  svg: React.ReactNode;
  label: string;
  valueDefult: string;
}

const InputForm = forwardRef<HTMLInputElement, InputFormProps>(
  (
    {
      inputFild,
      svg,
      type = "text",
      placeholder,
      label,
      valueDefult,
      disabled,
      ...rest
    },
    ref,
  ) => {
    return (
      <div id="input" className="relative">
        <input
          {...rest}
          ref={ref}
          type={type}
          id={label}
          className="block w-full text-sm h-12.5 px-4 pl-12 text-neutral-100 bg-neutral-700 rounded-[8px] appearance-none focus:border-transparent focus:outline focus:outline-neutral-200 focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-12"
          placeholder={placeholder}
          onChange={(e) => {
            rest.onChange?.(e);
            inputFild?.(e.target.value);
          }}
          value={valueDefult}
          required
          disabled={disabled}
        />
        <label
          htmlFor={label}
          className="peer-placeholder-shown:-z-10 text-neutral-200 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-left disabled:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {label}
          <span className="bg-neutral-700 -z-10 w-[90%] absolute left-0.75 h-0.5 top-[48%]" />
        </label>
        <span className="absolute top-2/4 -translate-y-2/4 left-3.5">
          {svg}
        </span>
      </div>
    );
  },
);

InputForm.displayName = "InputForm";
export default InputForm;
