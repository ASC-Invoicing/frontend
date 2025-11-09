import { Input as AntInput } from "antd";
import clsx from "clsx";

interface Props {
  label?: string;
  error?: string;
  className?: string;
  [key: string]: any;
}

export const Input = ({ label, error, className, ...props }: Props) => (
  <div className={clsx("flex flex-col gap-1", className)}>
    {label && <label className="text-sm font-medium">{label}</label>}
    <AntInput
      {...props}
      className={clsx("rounded-md !py-2.5 border-gray-300 focus:border-[#00786F]")}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
