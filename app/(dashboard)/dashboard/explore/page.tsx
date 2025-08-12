"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

// Dummy catalog data
const genres = [
  {
    title: "Trending Now",
    items: Array.from({ length: 12 }).map((_, i) => ({
      id: `trend-${i + 1}`,
      title: `Trending #${i + 1}`,
      // Placeholder images from picsum
      image: `https://picsum.photos/seed/trend${i + 1}/600/340`,
    })),
  },
  {
    title: "Popular Dramas",
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `drama-${i + 1}`,
      title: `Drama ${i + 1}`,
      image: `https://picsum.photos/seed/drama${i + 1}/600/340`,
    })),
  },
  {
    title: "Sci‑Fi & Fantasy",
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `scifi-${i + 1}`,
      title: `Sci‑Fi ${i + 1}`,
      image: `https://picsum.photos/seed/scifi${i + 1}/600/340`,
    })),
  },
  {
    title: "Comedies",
    items: Array.from({ length: 10 }).map((_, i) => ({
      id: `comedy-${i + 1}`,
      title: `Comedy ${i + 1}`,
      image: `https://picsum.photos/seed/comedy${i + 1}/600/340`,
    })),
  },
];

function Row({ title, items }: { title: string; items: Array<{ id: string; title: string; image: string }> }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg lg:text-xl font-semibold mb-3 px-4 lg:px-0">{title}</h2>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto px-4 lg:px-0 pb-2 snap-x snap-mandatory">
          {items.map((item) => (
            <Link
              href={`#${item.id}`}
              key={item.id}
              className="min-w-[220px] lg:min-w-[260px] snap-start"
            >
              <div className="relative rounded-md overflow-hidden group">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={340}
                  className="h-[124px] w-[220px] lg:h-[150px] lg:w-[260px] object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ExplorePage() {
  // Pick a hero from trending for the banner
  const hero = useMemo(() => genres[0].items[0], []);

  return (
    <div className="flex-1">
      {/* Hero */}
      <div className="relative h-[38vh] min-h-[260px] w-full">
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
        <div className="absolute bottom-6 left-4 lg:left-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-white drop-shadow">{hero.title}</h1>
          <div className="mt-3 flex gap-3">
            <Button className="bg-white text-gray-900 hover:bg-gray-200">Play</Button>
            <Button variant="outline" className="border-white/70 text-white hover:bg-white/10">More Info</Button>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="p-4 lg:p-8">
        {genres.map((row) => (
          <Row key={row.title} title={row.title} items={row.items} />
        ))}
      </div>
    </div>
  );
}
