import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { availableResturant } from "@/store/data";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { Clock, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { match } from "ts-pattern";

type RestuarantResult = typeof availableResturant;

export const RestuarantToolUI = makeAssistantToolUI<never, RestuarantResult>({
  toolName: "getAvailableRestuarant",
  render: ({ status, result, addResult }) => {
    console.log("STATUS", status);
    if (status.type === "incomplete" && status.error === "error") {
      console.log("INCOMPLETE");
      return (
        <div className="text-red-500">Failed to get Available Restuarant</div>
      );
    }
    return match(status.type)
      .with("running", () => {
        return (
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin" />
            <span>Checking for Available Restuarant...</span>
          </div>
        );
      })
      .with("complete", () => {
        return (
          <div className="mt-4 px-8 w-full">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4 flex gap-3">
                {result?.map((restaurant) => (
                  <CarouselItem
                    key={restaurant?.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2"
                  >
                    <Card
                      className="cursor-pointer border-none hover-scale hover:shadow-md transition-all h-80 w-[15rem]"
                      onClick={() => {
                        const foo = Array.of(restaurant);
                        addResult(foo);
                      }}
                    >
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="h-[70%] w-full">
                          <Image
                            src={restaurant?.cover_images[0].path ?? ""}
                            alt={restaurant?.name ?? ""}
                            className="w-full h-full rounded-t-lg object-cover"
                            width={500}
                            height={500}
                          />
                        </div>

                        <div className="p-3 h-[30%] flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold text-foreground text-sm truncate">
                                {restaurant?.name}
                              </h3>
                              <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">
                                ⭐ {restaurant?.average_rating}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                              {restaurant?.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 h-auto"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {restaurant!.tags.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1.5 py-0.5 h-auto"
                                >
                                  +{restaurant!.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {restaurant?.opening_time_text}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        );
      })
      .otherwise(() => {
        return <div className="text-red-500">Failed to get Restuarant</div>;
      });
  },
});
