import { useState } from "react";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";
import APIConnector, { PersonSearchResult } from "../../APIConnector";

export default function PersonPickerLocal(props: {
    onSelect: (person: PersonSearchResult) => void;
}) {
    const [search, setSearch] = useState("");
    const [persons, setPersons] = useState<PersonSearchResult[]>([]);
    const [searchStatus, setSearchStatus] = useState("done" as "done" | "pending");

    const searchContributors = () => {
        setSearchStatus("pending");
        APIConnector.searchLocalContributor({ query: search })
            .then((res) => {
                if (res.status === "success") setPersons(res.content);
            })
            .finally(() => setSearchStatus("done"));
    };

    const makeSelection = (person: PersonSearchResult) => {
      setSearch(person.name);
      setPersons([]);
      props.onSelect(person);
    };

    return <div>
              <form
        onSubmit={(e) => {
          e.preventDefault();
          searchContributors();
        }}
        className="flex gap-2  items-center"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="border p-2 rounded-xl mr-2"
        />
        <button type="submit">
          <MagnifyingGlassCircleIcon className="w-8 h-8" />
        </button>
      </form>
      <div className="relative">
        {persons.length > 0 ? (
          <div className="absolute shadow-lg bg-white w-96">
            <div>{searchStatus === "pending" ? "Searching..." : ""}</div>
            {persons.map((e) => (
              <div
                className="grid grid-cols-6 gap-2 items-center even:bg-navy-50 hover:bg-navy-100 cursor-pointer"
                onClick={() => makeSelection(e)}
              >
                <img src={`https://image.tmdb.org/t/p/w500${e.profile_path}`} />
                <div className="col-span-5">{e.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>;
}