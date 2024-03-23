import { useState } from "react";
import APIConnector, { MovieSearchResult } from "../../APIConnector";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";
("../../utils/debounce");

export default function MoviePickerLocal(
  props: Readonly<{ onSelect: (movie: MovieSearchResult) => void }>
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([] as MovieSearchResult[]);
  const [searchStatus, setSearchStatus] = useState(
    "done" as "done" | "pending"
  );

  const searchMovies = () => {
    setSearchStatus("pending");
    APIConnector.searchLocalMovies({ query: searchQuery })
      .then((res) => {
        if (res.status === "success") setSearchResults(res.content);
      })
      .finally(() => setSearchStatus("done"));
  };

  const makeSelection = (movie: MovieSearchResult) => {
    setSearchQuery(movie.title);
    setSearchResults([]);
    props.onSelect(movie);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchMovies();
        }}
        className="flex gap-2  items-center"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          className="border p-2 rounded-xl mr-2"
        />
        <button type="submit">
          <MagnifyingGlassCircleIcon className="w-8 h-8" />
        </button>
      </form>
      <div className="relative">
        {searchResults.length > 0 ? (
          <div className="absolute shadow-lg bg-white w-96">
            <div>{searchStatus === "pending" ? "Searching..." : ""}</div>
            {searchResults.map((e) => (
              <div
                className="grid grid-cols-6 gap-2 items-center even:bg-navy-50 hover:bg-navy-100 cursor-pointer"
                onClick={() => makeSelection(e)}
              >
                <img src={`https://image.tmdb.org/t/p/w500${e.poster_path}`} />
                <div className="col-span-5">{e.title}</div>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
