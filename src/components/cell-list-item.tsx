import React from "react";
import { Cell } from "./state";
import TextEditor from "./text-editor";
import CodeCell from "./code-cell";
import ActionBar from "./action-bar";
import "./cell-list-item.css";
import AddCell from "./add-cell";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === "code") {
    child = (
      <>
        <div className="action-bar-wrapper code-bar">
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <div className="action-bar-wrapper">
          <ActionBar id={cell.id} />
        </div>
        <TextEditor cell={cell} />
      </>
    );
  }

  return (
    <div className="cell-list-item">
      <AddCell nextCellId={cell.id} />
      {child}
    </div>
  );
};

export default CellListItem;
