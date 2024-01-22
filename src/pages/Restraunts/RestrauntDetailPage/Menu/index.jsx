import { useEffect, useState } from "react";

import { ResyRestrauntDetail } from "@/mockData";

const Menu = ({ restrauntDetail }) => {
  const [menuData, setMenuData] = useState();

  useEffect(() => {
    console.log(restrauntDetail);
    if (Object.keys(restrauntDetail).length !== 0) {
      if (restrauntDetail?.menus?.menuData?.length === 0) {
        setMenuData(restrauntDetail?.menus?.menuData[0]?.sections[0]?.items);
      } else {
        setMenuData(restrauntDetail?.menus?.menuInfo?.url);
      }
      return;
    }
  }, [restrauntDetail]);

  return (
    <div className=" w-[full] ml-10 mt-8 md:ml-0 lg:ml-0 md:grid lg:grid md:grid-cols-8 lg:grid-cols-8 md:space-x-4 lg:space-x-4">
      <div className="col-span-1"></div>
      <div className="w-full md:col-span-4 mt-4 shadow-lg rounded-lg p-4 lg:col-span-4 mr-4 ">
        <h1 className="text-xl">
          <strong>Menu</strong>
        </h1>
        <hr className="mb-4 mt-4" />
        {restrauntDetail ? (
          Array.isArray(menuData) ? (
            menuData.map((data) => <p key={data.title}>{data.title}</p>)
          ) : (
            <a href={menuData} target="_blank">
              {menuData}
            </a>
          )
        ) : (
          <a className="text-lg" href={menuData} target="blank">
            {
              ResyRestrauntDetail.data.results.venues[0].templates[900634].menu[
                "en-us"
              ]
            }
          </a>
        )}
      </div>
    </div>
  );
};

export default Menu;