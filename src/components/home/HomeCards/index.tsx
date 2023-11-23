// import React from "react"
import Card1 from "./Card1"
import Card2 from "./Card2"
import Card3 from "./Card3"
import Card4 from "./Card4"

const HomeCards = () => {
  return (
    <>
  <div className="grid grid-cols-12 gap-8">
    <div className="col-span-12 sm:col-span-6">
      <Card1 />
    </div>
    <div className="col-span-12 sm:col-span-6">
      <Card2 />
    </div>
  </div>
  <div className="grid grid-cols-12 gap-8 mt-10">
    <div className="col-span-12 sm:col-span-6">
      <Card3 />
    </div>
    <div className="col-span-12 sm:col-span-6">
      <Card4 />
    </div>
  </div>
</>
  )
}

export default HomeCards
