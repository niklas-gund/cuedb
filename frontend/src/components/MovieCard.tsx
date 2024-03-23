import { useState } from "react";

export interface IMovieCardProps {
  title: string;
  poster_path: string;
  overview: string;
}

export function MovieCard(props: IMovieCardProps) {
  const [imageError, setImageError] = useState(false);
  return (
    <div className="w-64">
      <div className="h-96 relative group">
        <img
          className="w-full h-full object-cover rounded-xl"
          src={`https://image.tmdb.org/t/p/w500${props.poster_path}`}
          alt=""
          onError={() => setImageError(true)}
        />
        <div
          className={
            "absolute bottom-0 bg-black rounded-xl bg-opacity-70 h-96 w-64 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-ellipsis overflow-hidden" +
            (imageError ? " opacity-100" : "")
          }
        >
          {props.overview}
        </div>
      </div>
      <h2 className="font-bold text-xl">{props.title}</h2>
    </div>
  );
}
