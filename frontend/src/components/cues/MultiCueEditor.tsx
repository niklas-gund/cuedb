import { useState } from "react";
import "./MultiCueEditor.css";
import { Cue, cloneCue, createCue } from "../../classes/Cue";
import SingleCueEditor from "./SingleCueEditor";
import PersonPool from "./PersonPool";
import { PersonSearchResult } from "../../APIConnector";
import { PlusCircleIcon } from "@heroicons/react/16/solid";

export default function CueEditor() {
  const [cues, setCues] = useState([] as Cue[]);
  const [templateCue, setTemplateCue] = useState(createCue());
  const [addCueAmount, setAddCueAmount] = useState(1);
  const [contributorPool, setPersons] = useState([] as PersonSearchResult[]);

  const updateCue = (cue: Cue, index: number) => {
    setCues((cues) => cues.map((c, i) => (i === index ? cue : c)));
  };

  const moveCueUp = (index: number) => {
    if (index > 0) {
      setCues((cues) => {
        const newCues = [...cues];
        const copy = newCues[index];
        newCues[index] = newCues[index - 1];
        newCues[index - 1] = copy;
        return newCues;
      });
    }
  };

  const moveCueDown = (index: number) => {
    if (index < cues.length - 1) {
      setCues((cues) => {
        const newCues = [...cues];
        const copy = newCues[index];
        newCues[index] = newCues[index + 1];
        newCues[index + 1] = copy;
        return newCues;
      });
    }
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
                key={cue.id}
                cue={cue}
                canMoveUp={index > 0}
                canMoveDown={index < cues.length - 1}
                contributorPool={contributorPool}
                updateCue={(cue) => updateCue(cue, index)}
                onDelete={() =>
                  setCues((cues) => cues.filter((_, i) => i !== index))
                }
                onUp={() => moveCueUp(index)}
                onDown={() => moveCueDown(index)}
              />
            );
          })}
        </tbody>
      </table>
      <div className="my-4 flex items-center">
        <button
          className="rounded bg-navy-950 p-2 text-white font-bold ml-auto"
          onClick={() => console.log(cues)}
        >
          Save cues
        </button>
      </div>
      {/* Add cue */}
      <hr className="my-4" />
      <h2 className="text-2xl font-semibold">Cue Template</h2>
      <table>
        <tbody>
          <SingleCueEditor
            cue={templateCue}
            updateCue={(cue) => setTemplateCue(cue)}
            contributorPool={contributorPool}
            key="template"
            canMoveDown={false}
            canMoveUp={false}
            onDelete={() => {}}
            onUp={() => {}}
            onDown={() => {}}
          />
        </tbody>
      </table>
      <div className="w-full my-4 flex items-center">
        <div className="m-auto flex items-center gap-4">
          <input
            value={addCueAmount}
            onChange={(e) => setAddCueAmount(Number(e.target.value))}
            type="number"
          />
          <button
            onClick={() => {
              for (let i = 0; i < addCueAmount; i++) {
                setCues((cues) => [...cues, createCue(cloneCue(templateCue))]);
              }
            }}
          >
            <PlusCircleIcon className="w-16 h-16  text-navy-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
