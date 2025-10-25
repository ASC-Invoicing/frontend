import TextArea from "antd/es/input/TextArea";
import clsx from "clsx";

interface Props {
  label?: string;
  error?: string;
  className?: string;
  [key: string]: any;
}

export const CustomTextArea = ({ label, error, className, ...props }: Props) => (
  <div className={clsx("flex flex-col gap-1", className)}>
    {label && <label className="text-sm font-medium">{label}</label>}
    <TextArea
      {...props}
      className={clsx("rounded-md !py-5 border-gray-300 focus:border-[#1d4ed8]")}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
