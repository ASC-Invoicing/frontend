import { Modal as AntModal } from "antd";

interface Props {
  open: boolean;
  onCancel: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

export const Modal = ({
  open,
  onCancel,
  title,
  children,
  footer,
  width = 520,
}: Props) => (
  <AntModal
    open={open}
    title={title}
    onCancel={onCancel}
    footer={footer}
    width={width}
    centered
  >
    {children}
  </AntModal>
);
