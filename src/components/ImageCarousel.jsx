import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";

/**
 * React component for diplaying an image carousel for the provided images of the venue.
 * If no image is present, it shows a placeholder image.
 * When there is only one image provided, the arrows are not displayed.
 *
 * @param {Object} props
 * @param {Array<{ url: string, alt?: string }>} props.media - Array of image objects to display in the carousel.
 * @returns {JSX.Element} The rendered image carousel component.
 */
export default function ImageCarousel({ media }) {
  const [index, setIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className="mx-auto mt-0 w-xs text-center shadow-lg sm:w-md">
        <img src="../assets/placeholder-image.jpg"></img>
      </div>
    );
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
        loading="lazy"
      />
      {media.length === 1 ? null : (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 transform bg-black/50 px-4 py-1.5 text-2xl text-white hover:text-accentLight"
          aria-label="Previous image"
        >
          <FontAwesomeIcon icon={faCircleArrowLeft} size="xl" />
        </button>
      )}
      {media.length === 1 ? null : (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 transform bg-black/50 px-4 py-1.5 text-2xl text-white hover:text-accentLight"
          aria-label="Next image"
        >
          <FontAwesomeIcon icon={faCircleArrowRight} size="xl" />
        </button>
      )}
    </div>
  );
}
