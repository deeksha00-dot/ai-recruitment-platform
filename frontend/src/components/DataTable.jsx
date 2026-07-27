import { useMemo, useState } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import EmptyState from './EmptyState';
import { FiInbox } from 'react-icons/fi';

export default function DataTable({ columns, data, emptyMessage = 'No records found.' }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    const accessor = col?.sortAccessor || ((row) => row[sortKey]);
    return [...data].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av === bv) return 0;
      const result = av > bv ? 1 : -1;
      return sortDir === 'asc' ? result : -result;
    });
  }, [data, sortKey, sortDir, columns]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (!data.length) {
    return <EmptyState icon={FiInbox} title="No data yet" description={emptyMessage} />;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/10">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">
                {col.sortable ? (
                  <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
                    {col.label}
                    <span className="flex flex-col">
                      <FiChevronUp size={10} className={sortKey === col.key && sortDir === 'asc' ? 'text-brand-500' : 'text-slate-300'} />
                      <FiChevronDown size={10} className={sortKey === col.key && sortDir === 'desc' ? 'text-brand-500' : 'text-slate-300'} />
                    </span>
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => (
            <tr key={row.id ?? idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/[0.03]">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-5 py-3.5 text-slate-600 dark:text-slate-300">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
