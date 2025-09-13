import { Table, type TableProps } from "antd";

export default function StandardTable<T extends object>({
  columns,
  dataSource,
  ...rest
}: TableProps<T>) {
  return (
    <Table<T>
      scroll={{ x: "max-content"}}
      columns={columns}
      dataSource={dataSource}
      {...rest}
    />
  );
}
