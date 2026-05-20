import React from "react";
import { motion } from "framer-motion";

const Testimoni = () => {
  const testimonials = [
    {
      type: "text",
      quote: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin amet nulla morbi eu non gravida.",
      name: "James Brown",
      role: "CEO Design Company - @YourHashtag",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      type: "rating",
      stars: 5,
      title: "I really appreciate!!",
      text: "Congue mauris rhoncus deaenean vel elit Morbi non arcu risus quis varius Tincidunt.",
      name: "Hindley Earnshaw",
      handle: "@Hindley.Es",
    },
    {
      type: "image-large",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500", 
      caption: "Morbi non arcu risus quis varius. Tincidunt augue interdum velit euismod.",
      signature: "Linda Brown",
    },
    {
      type: "top-avatar",
      avatar: "https://i.pravatar.cc/150?u=2",
      title: "Good Job!",
      stars: 5,
      text: "Semper feugiat nibh sed pulvinar proin gravida facilisi morbi tempus iaculis pharetra convallis posuere fermentum iaculis facilisi morbi.",
    },
    {
      type: "wide-quote",
      title: "I was very impressed!",
      text: "Diam maecenas ultricies mi eget. In nulla posuere sollicitudin aliquam. Adiscing enim eu turpis egestas pretium aenean. Vitae ultricies leo integer malesuada nunc vel.",
      name: "WILKINS MICAWBER",
    },
    {
      type: "rating-center",
      avatar: "https://i.pravatar.cc/150?u=3",
      stars: 5,
      text: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin amet nulla morbi eu non gravida",
      signature: "Isabella Linton"
    }
  ];

  // Helper untuk render bintang
  const renderStars = (count) => (
    <div className="flex gap-1 mb-3">
      {[...Array(count)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-sm">★</span>
      ))}
    </div>
  );

  return (
    <section className="relative w-full bg-white pt-32 pb-64 px-6 md:px-10 overflow-hidden min-h-screen">
      {/* Content Container */}
      <div className="max-w-7xl mx-auto z-20 relative">
        
        {/* Layout Masonry */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="break-inside-avoid bg-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300"
            >
              
              {/* 1. Tipe Text + Small Profile */}
              {item.type === "text" && (
                <>
                  <span className="text-4xl font-serif text-gray-200 mb-2 block">“</span>
                  <p className="text-gray-700 text-base italic leading-relaxed mb-8">
                    {item.quote}
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full grayscale hover:grayscale-0 transition-all object-cover border-2 border-gray-100" />
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider">{item.role}</p>
                    </div>
                  </div>
                </>
              )}

              {/* 2. Tipe Rating */}
              {item.type === "rating" && (
                <div className="text-center flex flex-col items-center">
                  {renderStars(item.stars)}
                  <h3 className="font-bold text-xl mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">
                    "{item.text}"
                  </p>
                  <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                  <p className="text-xs text-blue-400 font-medium">{item.handle}</p>
                </div>
              )}

              {/* 3. Tipe Image Large */}
              {item.type === "image-large" && (
                <div className="flex flex-col">
                  <div className="overflow-hidden rounded-2xl mb-6">
                    <img src={item.image} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" alt="profile" />
                  </div>
                  <p className="text-gray-500 text-sm italic mb-4 leading-relaxed">
                    {item.caption}
                  </p>
                  <p className="font-serif text-right text-2xl text-gray-300 pr-2">{item.signature}</p>
                </div>
              )}

              {/* 4. Tipe Top Avatar (Bursa Efek Style) */}
              {item.type === "top-avatar" && (
                <div className="text-center pt-4">
                  <div className="relative inline-block mb-6">
                     <img src={item.avatar} className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-xl object-cover" alt="" />
                  </div>
                  <h3 className="font-bold text-xl mb-1 text-gray-900">{item.title}</h3>
                  <div className="flex justify-center">{renderStars(item.stars)}</div>
                  <p className="text-gray-500 text-sm leading-relaxed px-2 italic">{item.text}</p>
                </div>
              )}

              {/* 5. Tipe Wide Quote */}
              {item.type === "wide-quote" && (
                <div className="text-center py-4">
                    <h3 className="font-bold text-2xl mb-6 text-gray-900">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-loose px-4 mb-8">{item.text}</p>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{item.name}</p>
                </div>
              )}

            </motion.div>
          ))}
        </div>
      </div>

      {/* Silhouette Background - Diatur agar mepet ke bawah */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10 select-none">
         <img 
            src="/assets/images/sillluet-beach.svg" // Pastikan pakai / diawal agar path dari root public
            alt="Beach Silhouette" 
            className="w-auto h-full object-bottom translate-y-1" // translate-y-1 untuk nutup celah pixel paling bawah
         />
      </div>
    </section>
  );
};

export default Testimoni;