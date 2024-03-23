import { MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import APIConnector, { PersonSearchResult } from "../../APIConnector";
import { PhotoIcon } from "@heroicons/react/16/solid";

export default function ComposerSearch() {
  const [personQuery, setPersonQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState(
    "done" as "done" | "pending"
  );
  const [searchResults, setSearchResults] = useState<PersonSearchResult[]>([]);

  const searchPerson = async () => {
    setSearchStatus("pending");
    const res = await APIConnector.searchContributor({ query: personQuery });
    console.log(res);
    if (res.status === "success") {
      // sort search results so that sound department is always on top
      setSearchResults(
        [...res.content.results].sort((a, b) => {
          if (a.known_for_department === "Sound") return -1;
          else if (b.known_for_department === "Sound") return 1;
          else
            return a.known_for_department.localeCompare(b.known_for_department);
        })
      );
    }
    setSearchStatus("done");
  };

  const addContributor = async (person: PersonSearchResult) => {
    await APIConnector.addContributor({
      tmdbID: person.id.toString(),
      name: person.name,
    });
    alert("Contributor added");
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold">Composer / Orchestrator Search</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchPerson();
        }}
      >
        <div className="flex items-center gap-2 my-2">
          <input
            type="text"
            placeholder="name"
            className="ml-auto border p-2 rounded-xl mr-2"
            value={personQuery}
            onChange={(e) => setPersonQuery(e.target.value)}
          />
          <button type="submit" className="flex gap-2 items-center">
            <MagnifyingGlassCircleIcon className="h-8 w-8" />
          </button>
        </div>
      </form>
      {/* Search status */}
      {searchStatus == "pending" ? <div>Loading</div> : <div />}
      {/* Search results */}
      <table>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Department</th>
            <th>Known for</th>
          </tr>
        </thead>
        <tbody>
          {[...searchResults].map((person) => (
            <tr
              key={person.id}
              className="text-left hover:bg-gray-200"
              onClick={() => addContributor(person)}
            >
              <td className="px-4 py-2">
                {person.profile_path ? (
                  <img
                    className="w-24"
                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  />
                ) : (
                  <div className="w-24 h-24 bg-navy-300 rounded-xl flex">
                    <PhotoIcon className="m-auto h-8 w-8 text-navy-800" />
                  </div>
                )}
              </td>
              <td className="px-4 py-2">{person.name}</td>
              <td className="px-4 py-2">{person.known_for_department}</td>
              <td className="px-4 py-2 flex gap-2">
                {person.known_for
                  .filter((e) => e.poster_path)
                  .map((movie) => (
                    <div key={movie.id} title={movie.title}>
                      {movie.poster_path ? (
                        <img
                          className="w-24"
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-300 rounded-xl"></div>
                      )}
                    </div>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
