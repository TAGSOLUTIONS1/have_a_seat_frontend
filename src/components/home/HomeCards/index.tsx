import Card1 from "./Card1"
import Card2 from "./Card2"
import Card3 from "./Card3"
import Card4 from "./Card4"


const HomeCards = () => {
  return (
    <div className="flex">
      <div>
        <Card1/>
      </div>
      <div className="mx-10">
        <Card2 />
        <div className="mt-20">
        <Card3 />
        </div>
      </div>
      <div >
        {/* <Card4/> */}
      </div>
    </div>
  )
}

export default HomeCards
