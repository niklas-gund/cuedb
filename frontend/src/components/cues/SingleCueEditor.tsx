import { useState } from "react";
import { Cue } from "../../classes/Cue";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { PersonSearchResult } from "../../APIConnector";
import MultiContributorSelector from "../datapickers/MultiContributorSelector";

export default function SingleCueEditor(props: {
  cue: Cue;
  contributorPool: PersonSearchResult[];
  canMoveUp: boolean;
  canMoveDown: boolean;
  updateCue: (cue: Cue) => void;
  onDelete: () => void;
  onUp: () => void;
  onDown: () => void;
}) {
  const [cue, setCue] = useState(props.cue);

  // Fix one step behind react bug
  const updateCue = (update: Partial<Cue>) => {
    setCue((prevCue) => {
      const newCue = { ...prevCue, ...update };
      props.updateCue(newCue);
      return newCue;
    });
  };

  return (
    <tr>
      <td>
        <input
          value={cue.slate}
          onChange={(e) => updateCue({ slate: e.target.value })}
          placeholder="Slate (e.g. 1m02)"
        />
      </td>
      <td>
        <input
          value={cue.title}
          onChange={(e) => updateCue({ title: e.target.value })}
          placeholder="Title (e.g. Opening)"
        />
      </td>
      <td>
        <MultiContributorSelector
          pool={props.contributorPool}
          selectedContributors={props.contributorPool.filter((p) =>
            cue.composers.includes(p.id.toString())
          )}
          onUpdate={(persons) =>
            updateCue({ composers: persons.map((p) => p.id.toString()) })
          }
        />
      </td>
      <td>
        <MultiContributorSelector
          pool={props.contributorPool}
          selectedContributors={props.contributorPool.filter((p) =>
            cue.orchestrators.includes(p.id.toString())
          )}
          onUpdate={(persons) =>
            updateCue({ orchestrators: persons.map((p) => p.id.toString()) })
          }
        />
      </td>
      <td className="flex gap-2">
        <button onClick={props.onDelete}>
          <TrashIcon className="w-6 h-6" />
        </button>
        <button
          onClick={props.onUp}
          disabled={!props.canMoveUp}
          className="disabled:text-gray-400"
        >
          <ArrowUpCircleIcon className="w-6 h-6" />
        </button>
        <button
          onClick={props.onDown}
          disabled={!props.canMoveDown}
          className="disabled:text-gray-400"
        >
          <ArrowDownCircleIcon className="w-6 h-6" />
        </button>
      </td>
    </tr>
  );
}
