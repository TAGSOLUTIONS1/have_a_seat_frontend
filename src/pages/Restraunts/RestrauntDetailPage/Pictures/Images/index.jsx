import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Images = ({ pictures }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  let imageUrls = [];

  if (pictures?.alias) {
    imageUrls = pictures?.photos || [];
  } else if (pictures?.restaurant) {
    const galleryPhotos = pictures?.restaurant?.photos?.gallery?.photos;
    if (galleryPhotos && galleryPhotos.length > 0) {
      imageUrls = galleryPhotos.map((photo) => {
        const firstThumbnailUrl = photo.thumbnails[2]?.url;
        return firstThumbnailUrl;
      });
    }
  } else {
    const getRandomKey = (obj) => {
      const keys = Object.keys(obj);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      return randomKey;
    };

    const randomTemplateKey = pictures?.templates
      ? getRandomKey(pictures?.templates)
      : null;

    const randomTemplate =
      randomTemplateKey && pictures?.templates[randomTemplateKey];

    imageUrls = randomTemplate?.images || [];
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const getAdjacentIndex = (offset) => {
    let index = currentImageIndex + offset;
    if (index < 0) {
      index = imageUrls?.length - 1;
    } else if (index >= imageUrls?.length) {
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
        {imageUrls.length > 0 ? (
          <>
            <img
              src={imageUrls[getAdjacentIndex(-1)]}
              alt={`Image ${getAdjacentIndex(-1) + 1}`}
              className="hidden sm:block md:hidden lg:block w-24 h-24 object-cover rounded-lg absolute left-0 shadow-md ml-16 select-none" 
            />
            <img
              src={imageUrls[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="w-44 h-44 md:w-64 md:h-48 lg:w-64 lg:h-48 object-cover rounded-lg shadow-md select-none" 
            />
            <img
              src={imageUrls[getAdjacentIndex(1)]}
              alt={`Image ${getAdjacentIndex(1) + 1}`}
              className="hidden sm:block md:hidden lg:block w-24 h-24 object-cover rounded-lg absolute right-0 shadow-md mr-16 select-none" 
            />
          </>
        ) : (
          <p>No images available</p>
        )}
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
