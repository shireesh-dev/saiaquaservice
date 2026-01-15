import React from "react";
import { Link, useParams } from "react-router-dom";
import { navItems } from "../../static/data";
import styles from "../../styles/styles";

const Navbar = ({ active }) => {
  const { agencyId } = useParams(); // Capture agencyId from URL

  return (
    <div className={`block 800px:${styles.noramlFlex}`}>
      {navItems &&
        navItems.map((item, index) => {
          // Dynamically replace :agencyId in URLs
          const finalUrl = item.url.includes(":agencyId")
            ? item.url.replace(":agencyId", agencyId || "")
            : item.url;

          return (
            <div className="flex" key={index}>
              <Link
                to={finalUrl}
                className={`${
                  active === index + 1
                    ? "text-[#17dd1f]"
                    : "text-black 800px:text-[#fff]"
                } pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
              >
                {item.title}
              </Link>
            </div>
          );
        })}
    </div>
  );
};

export default Navbar;
