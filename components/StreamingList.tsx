import React from 'react';

const StreamingList: React.FC = () => {
  const platforms = [
    { id: 'netflix', img: 'https://i.postimg.cc/tgJx8ZQr/image.png' },
    { id: 'disney', img: 'https://i.postimg.cc/JhNfVnN3/disney_+.png' },
    { id: 'iqiyi', img: 'https://i.postimg.cc/sXc9rF0F/iqiyi.png' },
    { id: 'extra1', img: 'https://i.postimg.cc/tgJx8ZQr/image.png' }, 
  ];

  const movies = [
    { id: 'movie_parasite', img: 'https://i.postimg.cc/c1rFfCvf/ชนชั้นปรสิต.png' },
    { id: 'movie1', img: 'https://i.postimg.cc/Rh63bccM/KPop_Demon_Hunters.png' },
    { id: 'movie2', img: 'https://i.postimg.cc/jjxDrVHt/love_untangled.png' },
    { id: 'movie3', img: 'https://i.postimg.cc/Rh63bccM/KPop_Demon_Hunters.png' },
  ];

  return (
    <div className="pb-24 pt-2">
      {/* Section 1: Select Streaming */}
      <div className="mb-6">
        <h3 className="px-6 text-slate-700 font-bold text-base mb-3">เลือกสตรีมมิ่ง</h3>
        <div className="flex overflow-x-auto gap-4 px-6 pb-2 scrollbar-hide snap-x">
          {platforms.map((platform) => (
            <div 
              key={platform.id} 
              className="min-w-[150px] aspect-square bg-black rounded-[35px] overflow-hidden shadow-sm flex items-center justify-center cursor-pointer transition-transform active:scale-95 snap-start"
            >
              <img 
                src={platform.img} 
                className="w-full h-full object-cover" 
                alt={platform.id} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Select Movies */}
      <div>
        <h3 className="px-6 text-slate-700 font-bold text-base mb-3">เลือกภาพยนตร์</h3>
        <div className="flex overflow-x-auto gap-4 px-6 pb-2 scrollbar-hide snap-x">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="min-w-[150px] aspect-[2/3] rounded-[35px] overflow-hidden shadow-sm cursor-pointer transition-transform active:scale-95 snap-start"
            >
              <img 
                src={movie.img} 
                className="w-full h-full object-cover" 
                alt={movie.id} 
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default StreamingList;