import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-[10px] top-1/2 transform -translate-y-1/2 bg-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer shadow-lg z-10"
  >
    <ChevronLeft className="text-gray text-base" />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer shadow-lg z-10"
  >
    <ChevronRight className="text-gray text-base" />
  </div>
);

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
};

export default function ImageSlider({ restrauntDetail }) {
  const [pictures, setPictures] = useState({});

  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setPictures(restrauntDetail);
    }
  }, [restrauntDetail]);

  let imageUrls = [];
  
  // Handle Tock restaurants - use logo
  if (restrauntDetail?.restaurant_type === "tock" || restrauntDetail?.restraunt_type === "tock") {
    if (restrauntDetail?.logo) {
      imageUrls = [restrauntDetail.logo];
    } else if (restrauntDetail?.image_url) {
      imageUrls = [restrauntDetail.image_url];
    }
  }
  // Handle Table Agent restaurants - use gallery_photos, images, or image_url
  else if (restrauntDetail?.restaurant_type === "tableagent" || restrauntDetail?.restraunt_type === "tableagent") {
    if (restrauntDetail?.gallery_photos && restrauntDetail.gallery_photos.length > 0) {
      // Use gallery_photos with original_url or thumbnail_url
      imageUrls = restrauntDetail.gallery_photos.map(photo => 
        photo.original_url || photo.thumbnail_url || photo
      );
    } else if (restrauntDetail?.images && restrauntDetail.images.length > 0) {
      // Fallback to images array
      imageUrls = restrauntDetail.images;
    } else if (restrauntDetail?.image_url) {
      // Final fallback to single image_url
      imageUrls = [restrauntDetail.image_url];
    }
  }
  // Handle other restaurant types
  else if (pictures?.images || pictures?.photos) {
    const galleryPhotos = pictures?.images || pictures?.photos;

    if (galleryPhotos && galleryPhotos.length > 0) {
      imageUrls = galleryPhotos.map((photo) => {
        const firstThumbnailUrl = photo;
        return firstThumbnailUrl;
      });
    }
  } 
  else if (restrauntDetail?.results?.venues[0]?.venue?.responsive_images?.originals) {
    const galleryPhotos = restrauntDetail?.results?.venues[0]?.venue?.responsive_images?.originals;      
    imageUrls = Object.values(galleryPhotos).map(photo => photo.url);

  } else {
    imageUrls = pictures?.images || [];
  }

  return (
    <div>
      {imageUrls.length > 0 ? (
        <Slider {...settings}>
          {imageUrls.slice(0, 3).map((img, index) => (
            <div key={index} className="rounded-lg w-full relative">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="h-[250px] md:h-[370px] lg:h-[450px] w-full object-cover rounded-lg"
              />
            </div>
          ))}
        </Slider>
      ) : (
        "No images available"
      )}
    </div>
  );
}
