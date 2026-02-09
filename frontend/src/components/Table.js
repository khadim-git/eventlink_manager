import React from 'react';
import { modernStyles } from '../styles/modernStyles';

const Table = ({ columns, data = [], actions }) => (
  <table style={modernStyles.table}>
    <thead>
      <tr>
        {columns.map((col, idx) => (
          <th key={idx} style={modernStyles.th}>{col.header}</th>
        ))}
        {actions && <th style={modernStyles.th}>Actions</th>}
      </tr>
    </thead>
    <tbody>
      {data.length === 0 ? (
        <tr>
          <td colSpan={columns.length + (actions ? 1 : 0)} style={{...modernStyles.td, textAlign: 'center', padding: '40px'}}>
            No data available
          </td>
        </tr>
      ) : (
        data.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {columns.map((col, colIdx) => (
              <td key={colIdx} style={modernStyles.td}>
                {col.render ? col.render(row) : row[col.field]}
              </td>
            ))}
            {actions && (
              <td style={modernStyles.td}>
                {actions(row)}
              </td>
            )}
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default Table;
