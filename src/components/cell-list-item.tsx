import React from "react";
import { Cell } from "./state";
import TextEditor from "./text-editor";
import CodeCell from "./code-cell";
import ActionBar from "./action-bar";
import "./cell-list-item.css";
import AddCell from "./add-cell";
import { AnimateSharedLayout, motion } from "framer-motion";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === "code") {
    child = (
      <div className="cell-list-item">
        <AnimateSharedLayout>
          <motion.div layout>
            <div className="action-bar-wrapper code-bar">
              <ActionBar id={cell.id} />
            </div>
            <CodeCell cell={cell} />
          </motion.div>
        </AnimateSharedLayout>
      </div>
    );
  } else {
    child = (
      <AnimateSharedLayout>
        <motion.div layout>
          <div className="cell-list-item text-editor">
            <div className="action-bar-wrapper ">
              <ActionBar id={cell.id} />
            </div>
            <TextEditor cell={cell} />
          </div>
        </motion.div>
      </AnimateSharedLayout>
    );
  }

  return (
    <>
      <AddCell nextCellId={cell.id} />
      {child}
    </>
  );
};

export default CellListItem;
