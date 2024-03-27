import { useParams } from "react-router-dom";
import MoviePickerLocal from "../../components/datapickers/MoviePickerLocal";
import { useState } from "react";
import { emptyCueset } from "../../classes/CueSet";
import { PhotoIcon } from "@heroicons/react/16/solid";
import CueEditor from "../../components/cues/MultiCueEditor";

export default function EditCueSet() {
  const { id } = useParams();
  // todo behaviour if id exists
  const [cueSet, setCueSet] = useState(emptyCueset());
  return (
    <div>
      <div className="bg-navy-50 p-4 rounded-b-lg">
      <h1 className="text-3xl font-semibold my-2">
        {id == undefined ? "Add a Cue Set" : "Edit a Cue Set"}
      </h1>

      <div className="h-96 grid grid-cols-4">
        <div className="">
          <div className="p-4 ">
            {cueSet.movie?.poster_path ? (
              <img
                className="rounded-lg h-64 w-48 object-contain"
                src={
                  "https://image.tmdb.org/t/p/w500" + cueSet.movie?.poster_path
                }
              />
            ) : (
              <div className="h-64 w-48 bg-navy-200 rounded flex items-center justify-center">
                <PhotoIcon className="w-8 h-8" />
                <div>{!cueSet.movie && "Pick a movie"}</div>
              </div>
            )}
          </div>

          <MoviePickerLocal
            onSelect={(t) => setCueSet({ ...cueSet, movie: t })}
          />
        </div>
        <div className="col-span-3 flex flex-col gap-2">
          <div className="text-3xl font-semibold">
            {cueSet.movie?.title || "Pick a movie to start"}
          </div>
          <input
            className="border p-2 rounded-xl mr-2"
            value={cueSet.title}
            onChange={(e) => setCueSet({ ...cueSet, title: e.target.value })}
            placeholder="Cue Set Title"
          />
          <input
            className="border p-2 rounded-xl mr-2"
            value={cueSet.cueSource}
            onChange={(e) =>
              setCueSet({ ...cueSet, cueSource: e.target.value })
            }
            placeholder="Cue Source (e.g. GEMA, sheets, sessions,...)"
          />
        </div>
      </div>
      </div>
      <div>
        <CueEditor />
      </div>
    </div>
  );
}
