export function Tile({ content: Content, flip, state, ...props }) {
  switch (state) {
    case "start":
      return (
        <Back className="flipBack fadeHideAnimation" flip={flip} {...props} />
      );
    case "flipped":
      return (
        <Front className="flipFront fadeShowAnimation" {...props}>
          <Content className="absolute text-white text-5xl" />
        </Front>
      );
    case "matched":
      return (
        <Matched className="flipMatch" {...props}>
          <Content className="absolute text-indigo-200 text-5xl" />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip, ...props }) {
  return <button onClick={flip} className={className} {...props}></button>;
}

function Front({ className, children, ...props }) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function Matched({ className, children, ...props }) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
