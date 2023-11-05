"use client";

import React from "react";
import {
  Card,
  Skeleton,
} from "@nextui-org/react";

export default function Loading() {
  let items = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
      <div key={items[0]} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4 min-[1350px]:grid-cols-6 min-[1650px]:grid-cols-8 gap-4">
          {items?.map((item: any, index: any) => (
            <div key={item} className="aspect-square rounded-lg ">
              <Card className="w-[200px] h-[400px} space-y-5 p-4" radius="lg">
                <Skeleton className="rounded-lg">
                  <div className="h-48 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                  </Skeleton>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
