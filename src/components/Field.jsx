import React from 'react';

const Field = ({ fields }) => {
  return (
    <div className="field">
      {
            fields.map((row) => {
              return row.map((column) => {
                return <div className={`dots ${column}`}></div>
              })
            })}
{/* 1 回目のループ → 1 行目の配列を表示 */}
{/* 2 回目のループ → 2 行目の配列を表示 */}
{/* 3 回目のループ → 3 行目の配列を表示 */}
{/* 4 回目のループ → 4 行目の配列を表示 */}
    </div>
  );
};

export default Field;