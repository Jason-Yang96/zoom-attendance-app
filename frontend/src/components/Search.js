import React from "react";

function Search({ onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event.target.elements.filter.value);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input name="filter" />
        <button className="button-22">검색</button>
      </form>
    </div>
  );
}

export default Search;
