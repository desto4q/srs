import ProductDetails from "./ProductDetails";
import type { ProductsRecord } from "pocketbase-types";
import type { OptionsConfig } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import { useState, useCallback, useEffect } from "react";
import { get_image } from "@/helpers/client"; // Updated import path
import ProductReviews from "./ProductReviews";

export default function ProductInfo({
  item,
}: {
  item: ProductsRecord<OptionsConfig>;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]); // Removed setSelectedIndex from dependency array as it's a state setter

  const handleThumbnailClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  // Add event listener for when the carousel is initialized and on every selection change
  // This ensures `selectedIndex` is always in sync with the current slide

  const images = item.images || [];

  return (
    <div className=" space-y-4">
      <div className="w-full  h-100 flex">
        <figure className="embla flex-1  bg-base-300/50 rounded-box ring fade">
          <div className="embla__viewport h-full" ref={emblaRef}>
            <div className="embla__container h-full">
              {images.length > 0 ? (
                images.map((imageName, index) => (
                  <div className="embla__slide h-full relative" key={index}>
                    {/* Using a regular img tag instead of Next.js Image component */}
                    <img
                      src={get_image(item, imageName)}
                      alt={`${item.name} image ${index + 1}`}
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                      className="rounded-md"
                    />
                  </div>
                ))
              ) : (
                <div className="embla__slide h-full flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
            </div>
          </div>
        </figure>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
        {images.map((imageName, index) => (
          <button
            key={index}
            className={`btn h-18 aspect-video w-full btn-soft ring rounded-box p-0 overflow-hidden ${
              index === selectedIndex
                ? "btn-accent ring-2 ring-accent"
                : "btn-ghost"
            }`}
          >
            {/* Using a regular img tag instead of Next.js Image component */}
            <img
              src={get_image(item, imageName)}
              alt={`Thumbnail ${index + 1}`}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              className="rounded-box"
            />
          </button>
        ))}
      </div>
      <div className="md:hidden">
        <ProductDetails item={item} />
      </div>
      <ProductReviews />
    </div>
  );
}
