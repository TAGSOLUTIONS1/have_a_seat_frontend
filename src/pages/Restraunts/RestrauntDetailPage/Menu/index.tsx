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
    <div className=" grid grid-cols-8 space-x-4">
      <div className="col-span-1"></div>
      <div className="col-span-4 mr-4 border mt-4 rounded-lg p-4 shadow-lg">
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
