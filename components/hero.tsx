import Image from "next/image";

interface HeroProps {
  title?: string;
  description?: string;
  accentColor: string;
  backgroundImage?: string;
  showPoster?: boolean;
  posterImage?: string;
}

export function Hero({ 
  title, 
  description, 
  accentColor, 
  backgroundImage,
  showPoster = false,
  posterImage
}: HeroProps) {
  return (
    <section className="mt-6 md:mt-8 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto relative">
          <div className="relative h-75 md:h-100 rounded-3xl md:rounded-[40px] overflow-hidden">
            {backgroundImage ? (
              <Image
                src={backgroundImage}
                alt={title || "Banner"}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${accentColor} 0%, rgba(24, 24, 27, 0.9) 100%)`
                }}
              />
            )}
            
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 pb-6 md:pb-10 px-6 md:px-10 flex gap-6 items-end">
              {showPoster && posterImage && (
                <div className="hidden md:block shrink-0">
                  <div className="w-32 md:w-40 overflow-hidden rounded-lg shadow-2xl ring-1 ring-zinc-800">
                    <Image
                      src={posterImage}
                      alt={title || "Poster"}
                      width={160}
                      height={240}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}
              
              {title && (
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-gray-200 text-sm md:text-base max-w-2xl">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}