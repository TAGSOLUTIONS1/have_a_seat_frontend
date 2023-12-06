import { useState } from 'react';
import { ArrowLeft , ArrowRight } from 'lucide-react';

const Images = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/assets/restraunt-wallpaper2.jpg',
    '/assets/main-page.jpg',
    '/assets/reserved-header.jpg',
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const getAdjacentIndex = (offset:any) => {
    // Calculate adjacent image indexes
    let index = currentImageIndex + offset;
    if (index < 0) {
      index = images.length - 1;
    } else if (index >= images.length) {
      index = 0;
    }
    return index;
  };

  return (
    <div className="border p-6 rounded-lg shadow-lg">
      <h1 className="text-xl">
        <strong>Pictures</strong>
      </h1>
      <div className="max-w-6xl mt-8 mx-auto relative flex items-center justify-center">
        <img
          src={images[getAdjacentIndex(-1)]}
          alt={`Image ${getAdjacentIndex(-1) + 1}`}
          className="w-24 h-24 object-cover rounded-lg absolute left-0 shadow-md ml-16"
        />
        <img
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          className="w-64 h-48 object-cover rounded-lg shadow-md"
        />
        <img
          src={images[getAdjacentIndex(1)]}
          alt={`Image ${getAdjacentIndex(1) + 1}`}
          className="w-24 h-24 object-cover rounded-lg absolute right-0 shadow-md mr-16"
        />
        <ArrowLeft
          onClick={prevImage}
          size={34}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-purple-600 px-2 py-1  rounded-full focus:outline-none"
        >
          Prev
        </ArrowLeft>
        <ArrowRight
          onClick={nextImage}
          size={34}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-purple-600 px-2 py-1 rounded-full focus:outline-none"
        >
          Next
        </ArrowRight>
      </div>
    </div>
  );
};

export default Images;
