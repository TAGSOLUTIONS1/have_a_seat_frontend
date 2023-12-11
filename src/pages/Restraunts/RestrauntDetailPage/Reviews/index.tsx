import Comments from './Comments'
import DetailRating from './Rating'

const Reviews = () => {
  return (
    <div className=" grid grid-cols-8 space-x-4 mb-8 ">
      <div className="col-span-1"></div>
      <div className=" border rounded-lg shadow-lg mt-4 p-4 col-span-4 mr-4 ">
        <DetailRating/>
        <hr className="mb-4 mt-4" />
        <Comments/>
      </div>
    </div>
  )
}

export default Reviews
