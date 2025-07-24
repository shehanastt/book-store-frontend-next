'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const banners = [
  {
    id: 1,
    src: '/images/banner7.jpg',
    title: 'Welcome to KITHAAB',
    subtitle: 'Your friendly neighbor-hood book store',
  },
  {
    id: 2,
    src: '/images/banner5.jpg',
    title: '50% Off for Students',
    subtitle: 'Use your student ID to get exclusive discounts',
  },
  {
    id: 3,
    src: '/images/banner6.jpg',
    title: 'Discover New Books Every Day',
    subtitle: 'Explore fiction, non-fiction, and more',
  },
];

const AutoSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden shadow-lg">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
          src={banner.src}
          alt={banner.title}
          fill
          className="object-cover"
          priority={index === 0}
        />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow">
              {banner.title}
            </h2>
            <p className="text-sm md:text-lg text-gray-200 drop-shadow">
              {banner.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AutoSlider;
