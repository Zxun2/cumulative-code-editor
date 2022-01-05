import React, { useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "./state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import "./code-cell.css";
import { useCumulativeCode } from "../hooks/use-cumulative-code";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const content = useCumulativeCode(cell.id);

  // Whenever input (cell content) changes, this function gets executed.
  // When that happens, previous timer is reseted. If 500ms goes by without any content changes, the previous input will get bundled, transpiled and evaluated.
  useEffect(() => {
    const timer = setTimeout(async () => {
      createBundle(cell.id, content);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [content, cell.id, createBundle]);
  // Cell content is the only thing that should be changing. If we add bundle into the deps array, bundle will also be changing (after each bundle the state is updated) and hence, triggers useEffect - which is not what we want.

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Code editor */}
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
