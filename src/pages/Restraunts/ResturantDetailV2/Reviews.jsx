import React from "react";
import { useEffect, useState } from "react";

import axios from "axios";
import { Base_Url } from "@/baseUrl";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";
import DetailRating from "../RestrauntDetailPage/Reviews/Rating";
import Comments from "../RestrauntDetailPage/Reviews/Comments";
const reviews = [
  {
    name: "Laura K., Miami",
    date: "30 August 2024",
    review:
      "This is easily one of the best spots I've been to in recent years. I go to man...",
    rating: 5,
  },
  {
    name: "Samantha R., Los Angeles",
    date: "10 September 2024",
    review:
      "I came here for a team dinner with colleagues. The restaurant is in a renovated ...",
    rating: 4.5,
  },
  {
    name: "Mark H., Houston",
    date: "11 October 2024",
    review:
      "Backroom was beautiful & moody. Sitting in the front wouldn't be such a vibe. S...",
    rating: 4,
  },
];

// Helper function to render stars
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<AiFillStar key={i} className="text-yellow-500" />);
    } else if (i - rating === 0.5) {
      stars.push(<AiTwotoneStar key={i} className="text-yellow-500" />);
    } else {
      stars.push(<AiOutlineStar key={i} className="text-gray-400" />);
    }
  }
  return stars;
};
const convertHtmlToText = (html) => {
  // Create a temporary element
  var tempElement = document.createElement("div");

  // Set the HTML content
  tempElement.innerHTML = html;

  // Append the temporary element to the document body
  document.body.appendChild(tempElement);

  // Extract text content
  var textContent = tempElement.textContent || tempElement.innerText;

  // Remove the temporary element
  document.body.removeChild(tempElement);

  return textContent;
};

export default function Reviews({ restrauntDetail }) {
  const [reviewsData, setReviewsData] = useState();
  const [yelpReviews, setYelpReviews] = useState();

  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setReviewsData(restrauntDetail);
    }
  }, [restrauntDetail]);

  const fetchReviews = async (alias) => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/yelp/get_restaurant_reviews/${alias}`
      );
      setYelpReviews(response.data.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (restrauntDetail?.alias) {
      fetchReviews(restrauntDetail?.alias);
    } else {
      null;
    }
  }, [restrauntDetail?.restaurant_flag]);

  // const firstAbout = Object.values(data)[0]?.content?.["en-us"]?.about?.body;
    const templates = restrauntDetail?.results?.venues[0]?.templates;
    const firstTemplate = Object.values(templates || {})[0];

  return (
    <div className="">
      
      {restrauntDetail?.restaurant_type!=="resy" ?
      (
        <div className=" py-8 lg:flex gap-10">
           <div className="lg:w-1/2">
        <h2 className="text-4xl font-bold font-agrandir text-shipGrey mb-4">
          About{" "}
          {restrauntDetail?.restaurant_type === "tableagent" || restrauntDetail?.restraunt_type === "tableagent"
            ? restrauntDetail?.name
            : restrauntDetail?.alias
            ? restrauntDetail?.name
            : restrauntDetail?.restaurant
            ? restrauntDetail?.restaurant?.name
            : restrauntDetail?.name
            ? restrauntDetail?.name
            : "Restaurant"}
        </h2>
        <p className="text-shipGrey font-roboto text-sm sm:text-base md:text-lg lg:text-xl font-normal">
          {
            restrauntDetail?.restaurant_type === "tableagent" && restrauntDetail?.description
              ? restrauntDetail.description
              : restrauntDetail?.restaurant_type === "tock" && restrauntDetail?.description
              ? restrauntDetail.description
              : restrauntDetail?.alias
              ? "Enjoy a delightful dining experience where exceptional cuisine, warm ambiance, and top-notch service come together. Whether you're looking for a casual meal or a special occasion, our restaurant offers a variety of dishes crafted to satisfy every palate."
              : restrauntDetail?.restaurant?.description
              ? convertHtmlToText(restrauntDetail.restaurant.description)
              : firstTemplate?.content?.['en-us']?.about?.body && (
              " " + convertHtmlToText(
                firstTemplate?.content?.['en-us']?.about?.body 
              )
            ) 
            // :" "
          }
        </p>
        <p className="text-shipGrey font-roboto text-sm sm:text-base md:text-lg lg:text-xl font-bold mt-5">
          {
            firstTemplate?.content?.['en-us']?.need_to_know?.body && (
              " " + convertHtmlToText(
                firstTemplate?.content?.['en-us']?.need_to_know?.body 
              )
            ) 
            // :" "
          }
        </p>

      </div>
      <div className="lg:w-1/2 mt-8 lg:mt-0 border-[0.4px] border-[#B9B9B9] shadow-lg bg-white p-5 rounded-[30px]">
        <h2 className="text-4xl text-shipGrey font-agrandir font-bold mb-4">Reviews</h2>
        <div className="space-y-4">
          {restrauntDetail?.restaurant_type === "tock" ? (
            <div className="py-10 text-center text-gray-500">
              <p className="text-lg font-roboto">No reviews available.</p>
            </div>
          ) : restrauntDetail?.restaurant_type === "tableagent" && restrauntDetail?.reviews ? (
            <div className="space-y-4">
              {restrauntDetail.reviews.aggregate_rating && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-shipGrey font-agrandir">
                      {Number(restrauntDetail.reviews.aggregate_rating).toFixed(1)}
                    </span>
                    <div className="flex">{renderStars(restrauntDetail.reviews.aggregate_rating)}</div>
                    <span className="text-sm text-gray-500 font-roboto">
                      ({restrauntDetail.reviews.total_reviews || 0} reviews)
                    </span>
                  </div>
                </div>
              )}
              {restrauntDetail.reviews.reviews && restrauntDetail.reviews.reviews.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {restrauntDetail.reviews.reviews.slice(0, 10).map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-shipGrey font-roboto">
                            {review.reviewer_name || "Anonymous"}
                          </span>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <span className="text-sm text-gray-500 font-roboto">
                          {review.date || ""}
                        </span>
                      </div>
                      {review.detailed_ratings && (
                        <div className="flex flex-wrap gap-3 mb-2 text-xs text-gray-600 font-roboto">
                          {review.detailed_ratings.food && (
                            <span>Food: {review.detailed_ratings.food.display}</span>
                          )}
                          {review.detailed_ratings.service && (
                            <span>Service: {review.detailed_ratings.service.display}</span>
                          )}
                          {review.detailed_ratings.ambience && (
                            <span>Ambience: {review.detailed_ratings.ambience.display}</span>
                          )}
                          {review.detailed_ratings.value && (
                            <span>Value: {review.detailed_ratings.value.display}</span>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-shipGrey font-roboto leading-relaxed">
                        {review.comment || ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500">
                  <p className="text-lg font-roboto">No reviews available.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {restrauntDetail?.restaurant ? (
                <DetailRating reviewsData={reviewsData} />
              ) : null}

              {restrauntDetail?.restaurant ? <hr className="mb-4 mt-4" /> : null}

              <Comments reviewsData={reviewsData} yelpReviews={yelpReviews} />
            </>
          )}
        </div>
      </div>
      </div>):
      (<div className="">
        <h2 className="text-4xl font-bold font-agrandir text-shipGrey mb-4">
          About{" "}
          {restrauntDetail?.restaurant_type === "tableagent" || restrauntDetail?.restraunt_type === "tableagent"
            ? restrauntDetail?.name
            : restrauntDetail?.alias
            ? restrauntDetail?.name
            : restrauntDetail?.restaurant
            ? restrauntDetail?.restaurant?.name
            : restrauntDetail?.name
            ? restrauntDetail?.name
            : "Restaurant"}
        </h2>
        <p className="text-shipGrey font-roboto text-sm sm:text-base md:text-lg lg:text-xl font-normal">
          {
            restrauntDetail?.restaurant_type === "tableagent" && restrauntDetail?.description
              ? restrauntDetail.description
              : restrauntDetail?.restaurant_type === "tock" && restrauntDetail?.description
              ? restrauntDetail.description
              : restrauntDetail?.alias
              ? "Enjoy a delightful dining experience where exceptional cuisine, warm ambiance, and top-notch service come together. Whether you're looking for a casual meal or a special occasion, our restaurant offers a variety of dishes crafted to satisfy every palate."
              : restrauntDetail?.restaurant?.description
              ? convertHtmlToText(restrauntDetail.restaurant.description)
              : firstTemplate?.content?.['en-us']?.about?.body && (
              " " + convertHtmlToText(
                firstTemplate?.content?.['en-us']?.about?.body 
              )
            ) 
            // :" "
          }
        </p>
        <p className="text-shipGrey font-roboto text-sm sm:text-base md:text-lg lg:text-xl mt-10">
          <p className="text-4xl font-bold font-agrandir text-shipGrey mb-4">Need to Know</p>
          {
            firstTemplate?.content?.['en-us']?.need_to_know?.body && (
              " " + convertHtmlToText(
                firstTemplate?.content?.['en-us']?.need_to_know?.body 
              )
            ) 
            // :" "
          }
        </p>

      </div>)}
    </div>
  );
}
