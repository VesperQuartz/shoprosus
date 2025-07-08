import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatToNaira } from "@/lib/utils";
import { MenuItem2 } from "@/types";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { match } from "ts-pattern";

export const RestuarantMenuUi = makeAssistantToolUI<
  { name: string; id: number },
  MenuItem2[]
>({
  toolName: "getRestuarantMenus",
  render: ({ status, result, args }) => {
    console.log("STATUS", status);
    if (status.type === "incomplete" && status.error === "error") {
      console.log("INCOMPLETE");
      return <div className="text-red-500">Failed to get Restuarant Menu</div>;
    }
    return match(status.type)
      .with("running", () => {
        return (
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin" />
            <span>Checking for Available Menu in {args.name}...</span>
          </div>
        );
      })
      .with("complete", () => {
        return (
          <div className="mt-4 px-8 w-full">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4 flex gap-3">
                {result?.map((menu) => (
                  <CarouselItem
                    key={menu?.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2"
                  >
                    <Card
                      className="cursor-pointer border-none hover-scale hover:shadow-md transition-all w-[15rem]"
                      onClick={() => null}
                    >
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="h-[70%] w-full">
                          <Image
                            src={menu?.images ?? "/no_image.png"}
                            alt={menu?.name ?? ""}
                            className="w-full h-full rounded-t-lg object-cover"
                            width={500}
                            height={500}
                          />
                        </div>

                        <div className="p-3 h-[30%] flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold text-foreground text-sm truncate">
                                {menu?.name}
                              </h3>
                            </div>
                            <h4>{menu?.description}</h4>

                            <div className="flex flex-wrap gap-1 mb-2">
                              {menu?.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag.id}
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 h-auto"
                                >
                                  {tag.name}
                                </Badge>
                              ))}
                              {menu!.tags.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1.5 py-0.5 h-auto"
                                >
                                  +{menu!.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                            <div className="flex justify-center text-xl text-green-600">
                              {formatToNaira(menu.price ?? 0)}
                            </div>
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
        return (
          <div className="text-red-500">Failed to get Restuarent menu</div>
        );
      });
  },
});
