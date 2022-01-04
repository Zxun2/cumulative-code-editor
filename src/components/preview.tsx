import React, { useEffect, useRef } from "react";
import "./preview.css";

interface PreviewProps {
  code: string;
  err: string;
}

//	Specifies the HTML content of the page to show in the <iframe>
//  Code gets evaluated in the iframe
const html = `
    <html>
      <head></head>
        <body style="background-color: #282424; font-family: roboto; ">
          <div id="root" ></div>
          <script>
            const handleError = (err) => {
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
                console.error(err);
            }
            window.addEventListener('message', (e) => {
              try {
                eval(e.data);
              } catch(err) {
                handleError(err);
              }
            }, false);
          </script>
        </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  // Re-executes this whenever code changes
  useEffect(() => {
    // Adds message listener
    iframe.current.srcDoc = html;

    // Post a message to the iframe (Gets picked up by event listener)
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
