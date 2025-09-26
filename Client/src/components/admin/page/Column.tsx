import React from "react";

export type Column<T> = {
  key: keyof T | "actions";
  label: string;
  render?: (item: T) => React.ReactNode;
};

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function GenericTable<T extends { id: number }>({ data, columns }: GenericTableProps<T>) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped" id="dataTable">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key.toString()}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={`${item.id}-${col.key.toString()}`}>
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
