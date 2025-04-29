import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function ImageCarousel({ media }) {
  const [index, setIndex] = useState(0);

  if (!media || media.length === 0) {
    return <div>No images available.</div>;
  }

  function prev() {
    setIndex(index === 0 ? media.length - 1 : index - 1);
  }
  function next() {
    setIndex(index === media.length - 1 ? 0 : index + 1);
  }

  return (
    <div className="relative mx-auto mb-4 mt-0 max-w-[1500px] shadow-xl">
      <img
        src={media[index].url}
        alt={media[index].alt || ""}
        className="max-h-[780px] min-h-[600px] w-full object-cover shadow"
      />
      {media.length === 1 ? null : (
        <button
          onClick={prev}
          className="absolute left-1 top-1/2 -translate-y-1/2 transform bg-black/50 px-4 py-1 text-2xl text-white hover:text-accentLight"
          aria-label="Previous image"
        >
          <FontAwesomeIcon icon={faCircleArrowLeft} size="xl" />
        </button>
      )}
      {media.length === 1 ? null : (
        <button
          onClick={next}
          className="absolute right-1 top-1/2 -translate-y-1/2 transform bg-black/50 px-4 py-1 text-2xl text-white hover:text-accentLight"
          aria-label="Next image"
        >
          <FontAwesomeIcon icon={faCircleArrowRight} size="xl" />
        </button>
      )}
    </div>
  );
}
