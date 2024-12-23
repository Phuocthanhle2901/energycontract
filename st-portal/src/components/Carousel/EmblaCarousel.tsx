import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
  children?: ReactNode;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const newIndex = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    emblaThumbsApi.scrollTo(newIndex);
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const scrollToPrev = () => {
    if (emblaMainApi) {
      const prevIndex =
        selectedIndex === 0 ? slides.length - 1 : selectedIndex - 1;
      emblaMainApi.scrollTo(prevIndex);
    }
  };

  const scrollToNext = () => {
    if (emblaMainApi) {
      const nextIndex =
        selectedIndex === slides.length - 1 ? 0 : selectedIndex + 1;
      emblaMainApi.scrollTo(nextIndex);
    }
  };

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <img
                className="embla__slide__img"
                src={slide}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="gap-3 embla-thumbs">
        <button
          onClick={scrollToPrev}
          className="embla__button embla__button--prev"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e2f2fa]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </div>
        </button>
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {slides.map((slide, index) => (
              <div key={index} className="embla-thumbs__slide">
                <img
                  className="embla-thumbs__img"
                  src={slide}
                  alt={`Thumb ${index + 1}`}
                  onClick={() => onThumbClick(index)}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={scrollToNext}
          className="embla__button embla__button--next"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e2f2fa]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default EmblaCarousel;
