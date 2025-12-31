import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/api/apiClient";
import CompLoader from "@/components/layouts/ComponentLoader";
import type { BannersResponse } from "pocketbase-types";
import { Link } from "@tanstack/react-router";
import { get_image } from "@/helpers/client";

export default function AppHero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const query = useQuery<BannersResponse[]>({
    queryKey: ["heroBanners"],
    queryFn: async () => {
      let resp = await pb.collection("banners").getFullList();
      return resp;
    },
  });
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="h-155 rounded-box bg-base-200 w-full relative overflow-hidden isolate">
      <CompLoader query={query} minHeight={620}>
        {(data) => {
          return (
            <>
              <div className="embla h-155">
                <div
                  className="embla__viewport h-full relative isolate"
                  ref={emblaRef}
                >
                  <div className="embla__container h-full  flex ">
                    {data.map((banner) => (
                      <div
                        className="embla__slide flex-[0_0_100%] min-w-0 relative flex p-4 md:p-12 items-center justify-center"
                        key={banner.id}
                      >
                        <div className="flex flex-col-reverse gap-4 md:gap-2 md:flex-row flex-1 items-center justify-center container p-4 md:p-8 rounded-box shadow fade ring mx-auto ">
                          <div className="flex-1 text-center md:text-left md:pr-16 mb-8 md:mb-0">
                            {banner.title && (
                              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                                {banner.title}
                              </h2>
                            )}
                            {banner.description && (
                              <p className="text-base line-clamp-3 md:line-clamp-none md:text-lg mb-6 md:mb-8 max-w-lg mx-auto md:mx-0 text-current/80">
                                {banner.description}
                              </p>
                            )}
                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                              {banner.product_id && (
                                <Link
                                  to="/app/product/$id"
                                  //@ts-ignore
                                  params={{ id: banner.product_id }}
                                  className="btn btn-primary w-full sm:w-auto"
                                >
                                  Shop Now
                                </Link>
                              )}
                              <Link
                                to="/app/products"
                                className="flex items-center text-gray-800 font-semibold text-base md:text-lg group"
                              >
                                Explore Collection
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="w-5 h-5 ml-2 transition-transform transform group-hover:translate-x-1"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                  />
                                </svg>
                              </Link>
                            </div>
                          </div>
                          <div className="flex-1 flex justify-center md:justify-end">
                            {banner.banner_img && (
                              <div className="rounded-2xl overflow-hidden shadow-2xl max-w-full h-auto">
                                <img
                                  src={get_image(banner, banner.banner_img)}
                                  alt={banner.title || "Banner Image"}
                                  className="w-full h-auto max-w-[250px] md:max-w-[500px] object-cover"
                                  style={{ aspectRatio: "1/1" }} // Maintain aspect ratio
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="embla__prev btn btn-circle btn-ghost absolute left-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={scrollPrev}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="embla__next btn btn-circle btn-ghost absolute right-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={scrollNext}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </>
          );
        }}
      </CompLoader>
    </div>
  );
}
