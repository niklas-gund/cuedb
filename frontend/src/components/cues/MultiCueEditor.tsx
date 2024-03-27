import { useState } from "react";
import "./MultiCueEditor.css";
import { Cue, createCue } from "../../classes/Cue";
import SingleCueEditor from "./SingleCueEditor";
import PersonPool from "./PersonPool";
import { PersonSearchResult } from "../../APIConnector";

export default function CueEditor() {
  const [cues, setCues] = useState([] as Cue[]);
  const [contributorPool, setPersons] = useState([] as PersonSearchResult[]);

  const updateCue = (cue: Cue, index: number) => {
    setCues((cues) => cues.map((c, i) => (i === index ? cue : c)));
  };

  return (
    <div>
      <PersonPool onUpdate={setPersons} />
      <table className="table-auto w-auto">
        <thead className="w-full">
          <tr>
            <th>Cue Number</th>
            <th>Cue Title</th>
            <th>Composer(s)</th>
            <th>Orchestrator(s)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cues.map((cue, index) => {
            return (
              <SingleCueEditor
                cue={cue}
                contributorPool={contributorPool}
                updateCue={(cue) => updateCue(cue, index)}
              />
            );
          })}
        </tbody>
      </table>
      <button
        onClick={() =>
          setCues((cues) => [
            ...cues,
            createCue({ slate: "Dieter", title: "Cue 1" }),
          ])
        }
      >
        Add cue
      </button>
      <div>{JSON.stringify(cues)}</div>
    </div>
  );
}
