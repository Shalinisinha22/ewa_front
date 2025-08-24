import React from "react";
import { Link } from "react-router-dom";
import bannerImg from "../../assets/header.png"
const Banner = () => {
  return (
    <div className="section__container header__container">
      <div className="header__content z-30">
        <h4 className="uppercase">UP To 20% Discount on</h4>
        <h1>Girl's Fashion</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
          explicabo architecto odit autem esse consequatur quaerat natus optio
          ullam, rem, laudantium distinctio nostrum, necessitatibus quo debitis
          aut tempore ex amet ea adipisci!
        </p>
        <button className="btn"><Link to="/shop">Explore Now</Link></button>
      </div>
      <div className="header__image">
        <img src={bannerImg} alt="banner"></img>
      </div>
    </div>
  );
};

export default Banner;
