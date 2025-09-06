import "./Search.css";

export default function Search() {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Write it here..."
        className="search-input"
      />
      <p className="search-helper-text">Search hobby, location, interest</p>
      <button className="search-button">Let's find out</button>
    </div>
  );
}