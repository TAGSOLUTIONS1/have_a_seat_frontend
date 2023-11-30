import React from 'react'
import OverviewCards from './OverviewCards'
import Pictures from './Pictures'
import Menu from './Menu'
import TimingHours from './TimingHours'
import Reviews from './Reviews'

const RestrauntDetail = () => {
  return (
    <>
    <section className="max-w-full p-4">
        <div className="max-w-full relative w-[1300px] lg:p-0 lg:mx-auto my-4  h-[220px] sm:h-[320px] md:h-[500px] bg-white bg-[url('/assets/main-page.jpg')] bg-no-repeat bg-cover rounded-lg object-cover bg-center">
        </div>
      </section>
      <section>
        <OverviewCards/>
      </section>
      <section>
        <Pictures />
      </section>
      <section>
        <Menu/>
      </section>
      <section>
        <TimingHours/>
      </section>
      <section>
        <Reviews/>
      </section>
      </>
  )
}

export default RestrauntDetail
