interface TableSkeletonProps {
  columns: number;
  rows: number;
}

export const TableSkeleton = ({ columns, rows }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={`skeleton-${rowIdx}`} className="border-b">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td
              key={colIdx}
              className="max-w-[230px] truncate px-6 py-3.5 text-sm"
            >
              <div className="h-6 animate-pulse rounded-md bg-muted" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
