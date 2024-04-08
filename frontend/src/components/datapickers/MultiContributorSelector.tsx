import { useState } from "react";
import { PersonSearchResult } from "../../APIConnector";
import { XCircleIcon } from "@heroicons/react/16/solid";

export default function MultiContributorSelector(props: {
  pool: PersonSearchResult[];
  selectedContributors: PersonSearchResult[];
  onUpdate: (persons: PersonSearchResult[]) => void;
}) {
  const [selectedContributors, setSelectedContributors] = useState<
    PersonSearchResult[]
  >(props.selectedContributors);
  const [selectValue, setSelectValue] = useState("");

  const availableContributors = props.pool.filter(
    (p) => !selectedContributors.some((c) => c.id === p.id)
  );
  const addContributor = (id: string) => {
    const newElement = props.pool.find((p) => p.id.toString() === id);
    if (newElement) {
      const updatedContributors = [...selectedContributors, newElement];
      setSelectedContributors(updatedContributors);
      setSelectValue("");
      props.onUpdate(updatedContributors);
    }
  };

  const removeContributor = (id: string) => {
    const updatedContributors = selectedContributors.filter(
      (p) => p.id.toString() !== id
    );
    setSelectedContributors(updatedContributors);
    props.onUpdate(updatedContributors);
  };

  const hideSelect = availableContributors.length === 0;
  return (
    <div className="w-64 border border-navy-200 bg-navy-50 p-2 rounded flex flex-col gap-2">
      {selectedContributors.map((s) => (
        <div className="flex gap-2">
          <button onClick={() => removeContributor(s.id.toString())}>
            <XCircleIcon className="w-4 h-4" />
          </button>
          <div>{s.name}</div>
        </div>
      ))}
      {!hideSelect && (
        <select
          className="p-2 rounded"
          onChange={(e) => addContributor(e.target.value)}
          value={selectValue}
        >
          <option selected disabled value="">
            Add Contributor
          </option>
          {availableContributors.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
