import { Select as AntSelect } from "antd";
import clsx from "clsx";

interface Props {
  label?: string;
  error?: string;
  className?: string;
  options: { label: string; value: string | number }[];
  [key: string]: any;
}

export const Select = ({ label, error, options, className, ...props }: Props) => (
  <div className={clsx("flex flex-col gap-1", className)}>
    {label && <label className="text-sm font-medium">{label}</label>}
    <AntSelect
      {...props}
      options={options}
      className="rounded-md !h-[43px] border-gray-300 focus:border-[#00A859]"
      style={{ width: "100%" }}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
