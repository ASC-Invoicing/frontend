import { LoadingOutlined } from "@ant-design/icons";

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <LoadingOutlined className="text-[#1d4ed8] text-2xl animate-spin" />
  </div>
);
