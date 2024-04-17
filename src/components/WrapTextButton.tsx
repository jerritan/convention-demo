import React from "react";

const WrapTextButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  className: string;
}> = ({ children, onClick, className }) => {
  const content =
    typeof children === "string"
      ? children.split(":").map((piece, index, array) => (
          <React.Fragment key={index}>
            {piece}
            {index < array.length - 1 && <br />}
          </React.Fragment>
        ))
      : children;

  return (
    <button onClick={onClick} className={`${className} two-line-text`}>
      {content}
    </button>
  );
};

export default WrapTextButton;