import React from 'react';

import './CustomTable.scss';

interface TableProps {
  data: any[];
  fields: string[];
}

const CustomTable: React.FC<TableProps> = ({ data, fields }) => {
  return (
    <div className='custom-table-container'>
      <table>
        <thead>
          <tr>
            {fields.map((field) => (
              <td>{field}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((el) => {
            return (
              <tr>
                {Object.keys(el).map((key) => (
                  <td>{el[key]}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
