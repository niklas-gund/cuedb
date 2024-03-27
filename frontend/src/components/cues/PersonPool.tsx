import { useState } from "react";
import { PersonSearchResult } from "../../APIConnector";
import PersonPickerLocal from "../datapickers/PersonPickerLocal";
import React from "react";

export default function PersonPool(props: {
  onUpdate: (persons: PersonSearchResult[]) => void;
}) {
  const [persons, setPersons] = useState<PersonSearchResult[]>([]);

  // update when we update persons
  React.useEffect(() => {
    props.onUpdate(persons);
  }, [persons]);

  return (
    <div>
      <h1>Contributors (composers & orchestrators)</h1>
      <div className="flex w-auto gap-4">
        <div>
          <PersonPickerLocal
            onSelect={(person) => setPersons([...persons, person])}
          />
        </div>
        <div className="w-full flex flex-wrap gap-2">
          {persons.map((person) => (
            <div className="flex flex-col">
              <div className="w-16 flex">
                <img
                  className="rounded mx-auto"
                  src={"http://image.tmdb.org/t/p/w500" + person.profile_path}
                />
              </div>
              <div>{person.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
