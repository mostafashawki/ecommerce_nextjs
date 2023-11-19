//very cool feature with next, when you just create a component with loading.js name, it will be used as a loading component
export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 text-danger">
      LOADING...
    </div>
  );
}
