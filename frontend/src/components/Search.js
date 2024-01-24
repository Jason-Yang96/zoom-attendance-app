import React from "react";

function Search({ onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event.target.elements.filter.value);
  };

  return (
    <div className="search-container">
      <form className={"search_form"} onSubmit={handleSubmit}>
        <input className={"search_input"} name="filter" />
        <button className="search_btn">검색</button>
      </form>
    </div>
  );
}

export default Search;
