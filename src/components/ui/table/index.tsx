import {
  Table as AntTable,
  type TableProps,
  Pagination,
  Empty,
  Spin,
  Button,
  Result,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import clsx from "clsx";

interface DataTableProps<T> extends Omit<TableProps<T>, "title"> {
  title?: string;
  loading?: boolean;
  error?: boolean;
  total?: number;
  pageSize?: number;
  currentPage?: number;
  onRefresh?: () => void;
  onPageChange?: (page: number, pageSize: number) => void;
  emptyText?: string;
  bordered?: boolean;
}

export const DataTable = <T extends object>({
  title,
  columns,
  dataSource,
  loading = false,
  error = false,
  total,
  pageSize = 10,
  currentPage = 1,
  onRefresh,
  onPageChange,
  emptyText = "No data available",
  bordered = false,
  ...props
}: DataTableProps<T>) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow-sm",
        bordered ? "border border-gray-200" : ""
      )}
    >
      {/* Header */}
      {(title || onRefresh) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          {title && (
            <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          )}
          {onRefresh && (
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              className="flex items-center gap-1 text-[#00786F] hover:text-[#005F5A] border-none bg-transparent"
              type="text"
            >
              Refresh
            </Button>
          )}
        </div>
      )}

      {/* Body */}
      <div className="p-4">
        {/* 🔹 Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Spin size="large" />
          </div>
        )}

        {/* 🔹 Error */}
        {!loading && error && (
          <div className="flex items-center justify-center py-16">
            <Result
              status="error"
              title="Failed to load data"
              subTitle="Something went wrong while fetching your records."
              extra={
                onRefresh && (
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={onRefresh}
                    className="bg-[#00786F] text-white hover:bg-[#005F5A]"
                  >
                    Retry
                  </Button>
                )
              }
            />
          </div>
        )}

        {/* 🔹 Table */}
        {!loading && !error && (
          <>
            {dataSource && dataSource.length > 0 ? (
              <>
                {/* Responsive scroll container */}
                <div className="overflow-x-auto">
                  <AntTable
                    {...props}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: "max-content" }} // 👈 enables horizontal scroll
                    rowKey={(record) => (record as any).id || JSON.stringify(record)}
                    className={clsx(
                      "min-w-full",
                      "[&_thead_th]:!text-gray-500",
                      "[&_thead_th]:!text-xs",
                      "[&_thead_th]:!font-semibold",
                      "[&_thead_th]:!uppercase",
                      "[&_thead_th]:!bg-gray-50",
                      "[&_thead_th]:!py-3",
                      "[&_thead_th]:!px-4",
                      "[&_tbody_td]:!py-4",
                      "[&_tbody_td]:!px-4",
                      "[&_tbody_tr:hover]:!bg-gray-50",
                      "transition-colors duration-150"
                    )}
                  />
                </div>

                {/* Pagination */}
                {total && total > pageSize && (
                  <div className="flex justify-end pt-5 border-t border-gray-100 mt-4">
                    <Pagination
                      current={currentPage}
                      total={total}
                      pageSize={pageSize}
                      showSizeChanger={false}
                      onChange={onPageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <Empty description={emptyText} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
