import "./post.css"
export function CardPost(props) {

  return (
    <>
      <div className={` ${props.state === false ? "card-post-diseable":"card-post"}`}>{props.children}</div>
    </>
  );
}
