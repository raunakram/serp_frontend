import React from 'react';

export default function DynamicTable({ items }) {
  if (!items || items.length === 0) {
    return <p>No items to display.</p>;
  }

  // Get all unique keys across all items
  const allKeys = Array.from(
    items.reduce((keys, item) => {
      Object.keys(item).forEach(k => keys.add(k));
      return keys;
    }, new Set())
  );

  return (
    <div className="results-table">
      <table className="results-table-inner">
        <thead>
          <tr>
            {allKeys.map((key, index) => (
              <th key={key}
              className={index === 0 ? 'sticky-column' : ''}
              >{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
            {items.map((item, idx) => (
                <tr key={idx}>
                {allKeys.map((key, index) => (
                    <td
                    key={key}
                    className={index === 0 ? 'sticky-column' : ''}
                    >
                    {renderCell(item[key])}
                    </td>
                ))}
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return <pre style={{ maxWidth: 300, overflowX: 'auto' }}>{JSON.stringify(value, null, 2)}</pre>;
  }
  return String(value);
}
