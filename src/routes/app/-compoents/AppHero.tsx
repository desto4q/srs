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
    <div className="h-155 rounded-box ring fade shadow-xl bg-base-200 w-full relative overflow-hidden">
      <CompLoader query={query} minHeight={620}>
        {(data) => {
          return (
            <>
              <div className="embla h-155">
                <div
                  className="embla__viewport h-full relative isolate"
                  ref={emblaRef}
                >
                  <div className="inset-0 z-10 bg-linear-30 from-base-100 via-base-100/90 to-transparent absolute"></div>
                  <div className="embla__container h-full  flex ">
                    {data.map((banner) => (
                      <div
                        className="embla__slide  flex-[0_0_100%] 200 min-w-0 relative"
                        key={banner.id}
                      >
                        {banner.banner_img && (
                          <img
                            src={get_image(banner, banner.banner_img)}
                            alt={banner.title || "Banner Image"}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 z-20 flex items-center justify-start p-16">
                          <div className="max-w-xl text-left">
                            {/*<p className="text-lg  mb-2">Men's Shoe</p>*/}
                            {banner.title && (
                              <h2 className="text-6xl font-extrabold mb-4 ">
                                {banner.title}
                              </h2>
                            )}
                            {banner.description && (
                              <p className="text-lg mb-6 max-w-md">
                                {banner.description}
                              </p>
                            )}
                            {banner.product_id && (
                              <Link
                                to="/app/product/$id"
                                //@ts-ignore
                                params={{ id: banner.product_id }}
                                className="btn  btn-primary btn-lg ring "
                              >
                                See Product
                              </Link>
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
