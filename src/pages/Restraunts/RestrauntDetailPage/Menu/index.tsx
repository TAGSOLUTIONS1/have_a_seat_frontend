import { useEffect , useState } from "react";

interface MenuProps {
  restrauntDetail: any; 
}

const Menu: React.FC<MenuProps> = ({ restrauntDetail }) => {

  const [menuData , setMenuData]= useState<any>()
  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setMenuData(restrauntDetail?.menus?.menuInfo?.url)
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
        {menuData?.restaurant_flag === "yelp"
          ? <a href="">https://www.menu.com</a>
          : <a href={menuData} target="blank">{menuData}</a>}
      </div>
    </div>
  );
};

export default Menu;
