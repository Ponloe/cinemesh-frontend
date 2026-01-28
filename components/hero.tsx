"use client"

import Image from "next/image"

export function Hero({ accentColor = "rgb(220, 40, 40)" }) {
  return (
    <>
      <div 
        className="absolute top-0 left-0 right-0 h-600 -z-10 opacity-30 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accentColor} 0%, rgba(220, 40, 40, 0.4) 40%, transparent 80%)`
        }}
      />
      
      <section className="relative mt-6 md:mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto relative">
            <Image 
              src="/images/avatar.jpg" 
              alt="avatar" 
              width={1920} 
              height={1080} 
              className="rounded-3xl md:rounded-[40px] w-full h-auto object-cover max-h-100 md:max-h-125"
            />
            
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent rounded-3xl md:rounded-[40px]" />
            
            <div className="absolute bottom-0 left-0 right-0 pb-6 md:pb-10 px-6 md:px-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
                Avatar: Fire and Ash
              </h1>
              <p className="text-gray-300 text-xs md:text-sm max-w-xl lg:max-w-5xl">
                Jake and Neytiri&apos;s family grapples with grief, encountering a new antagonistic Na&apos;vi tribe, the Ash People, who lived by the fiery Vowing, as the conflict on Pandora escalates and a new moral focus emerges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}