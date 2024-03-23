import { useState } from "react";
import APIConnector, { MovieSearchResult } from "../../APIConnector";
import { MovieCard } from "../../components/MovieCard";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";

export default function MovieSearch() {
  const [movieQuery, setMovieQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState(
    "done" as "done" | "pending"
  );
  const [searchResults, setSearchResults] = useState([] as MovieSearchResult[]);

  const searchMovies = () => {
    setSearchStatus("pending");
    APIConnector.searchMovie({ query: movieQuery })
      .then((res) => {
        if (res.status === "success") setSearchResults(res.content.results);
      })
      .finally(() => setSearchStatus("done"));
  };

  const addMovie = async (movie: MovieSearchResult) => {
    await APIConnector.addMovie({
      tmdbID: movie.id.toString(),
      title: movie.title,
    });
    alert("Movie added");
  };

  return (
    <div>
      <div className="text-3xl font-semibold">Search movie</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchMovies();
        }}
      >
        <div className="flex items-center gap-2 my-2">
          <input
            type="text"
            placeholder="Movie title"
            className="ml-auto border p-2 rounded-xl mr-2"
            value={movieQuery}
            onChange={(e) => setMovieQuery(e.target.value)}
          />
          <button type="submit" className="flex gap-2 items-center">
            <MagnifyingGlassCircleIcon className="h-8 w-8" />
          </button>
        </div>
      </form>
      {searchStatus === "pending" && <div>Loading...</div>}
      <div className="flex flex-wrap gap-4 gap-y-8">
        {searchResults.map((movie) => (
          <div
            className="flex flex-col border p-2 rounded-xl bg-navy-50 hover:bg-navy-100 cursor-pointer"
            onClick={() => {
              addMovie(movie);
            }}
          >
            <MovieCard
              key={movie.id}
              title={
                movie.title + " (" + movie.release_date.substring(0, 4) + ")"
              }
              poster_path={movie.poster_path}
              overview={movie.overview}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
