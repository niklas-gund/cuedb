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

  const updateCue = (update: Partial<Cue>) => {
    setCue((cue) => ({ ...cue, ...update }));
    props.updateCue(cue);
  };

  return (
    <tr>
      <td>
        <input
          value={cue.slate}
          onChange={(e) => updateCue({ slate: e.target.value })}
        />
      </td>
      <td>
        <input
          value={cue.title}
          onChange={(e) => updateCue({ title: e.target.value })}
        />
      </td>
      <td>
        <MultiContributorSelector
          pool={props.contributorPool}
          onUpdate={(persons) =>
            updateCue({ composers: persons.map((p) => p.id.toString()) })
          }
        />
      </td>
      <td>
        <MultiContributorSelector
          pool={props.contributorPool}
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
