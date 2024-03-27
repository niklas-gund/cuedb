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
  updateCue: (cue: Cue) => void;
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
        <input value={cue.orchestrators.join(", ")} />
      </td>
      <td className="flex gap-2">
        <button>
          <TrashIcon className="w-6 h-6" />
        </button>
        <button>
          <ArrowUpCircleIcon className="w-6 h-6" />
        </button>
        <button>
          <ArrowDownCircleIcon className="w-6 h-6" />
        </button>
      </td>
    </tr>
  );
}
