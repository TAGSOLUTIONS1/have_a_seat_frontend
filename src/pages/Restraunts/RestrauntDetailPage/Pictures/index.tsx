import Images from './Images'

const Pictures = () => {
  return (
    <div className=" grid grid-cols-8 space-x-4">
      <div className="col-span-1"></div>
      <div className="col-span-4 mr-4 ">
        <Images />
      </div>
      {/* <div className="col-span-2">
        <OverviewCard2 />
      </div>
      <div className="col-span-1"></div> */}
    </div>
  )
}

export default Pictures
