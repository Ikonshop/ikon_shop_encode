import React, { useState, useEffect } from "react";
import { getCollectionProducts } from "../../lib/api";
import styles from "../../styles/Product.module.css";
import Product from "../../components/Product/Product";
import Header from "../../components/Header";
import Container from "react-bootstrap/Container";
import { LogoTwitter, LogoDiscord, LogoYoutube, LogoMedium, LogoWebComponent, LogoInstagram } from "react-ionicons";

function SlabzIo() {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [discordServer, setDiscordServer] = useState("");
  const [website, setWebsite] = useState("");
  const [youtube, setYoutube] = useState("");

  const getAllProducts = async () => {
    const collection = await getCollectionProducts("SLABZIO");
    const products = collection.collection.products;
    console.log("product type", collection.collection.products);
    for (let i = 0; i < products.length; i++) {
      if (products[i].type === "product") {
        setProducts((prevState) => [...prevState, products[i]]);
      }
    }
    console.log("product", products);
    setBanner(collection.collection.banner);
    setProjectName(collection.collection.projectName);
    setProjectDesc(collection.collection.description);
    setTwitterHandle(collection.collection.twitterHandle);
    setInstagramHandle(collection.collection.instagramHandle);
    setDiscordServer(collection.collection.discordServer);
    setWebsite(collection.collection.website);
    setYoutube(collection.collection.youtube);

    console.log("banner", collection);
  };

  useEffect(() => {
    setTimeout(() => {
      getAllProducts();
    }, 1000);
  }, []);

  return (
    <>
      <div className="store_hero">
        <div className="containers">
          <div className="row1">
            <div className="p_title">
              <span>Project name:</span>
              <h4>{projectName}</h4>
            </div>

            <div className="p_desc">
              <span>Description:</span>
              <p>
                {projectDesc}
              </p>
            </div>
            <div className="hero_socials">
                <a
                    href={twitterHandle}
                    target="_blank"
                    rel="noreferrer"
                >
                    <LogoTwitter
                      style={{
                        color: "#fff",
                        background: "#dadada",
                        width: "50px",
                        height: "50px",
                        borderRadius: "24px",
                        fontSize: "16px",
                        padding: "10px",
                        cursor: "pointer",
                      }}
                    />
                </a>
                <a
                    href={discordServer}
                    target="_blank"
                    rel="noreferrer"
                >
                    <LogoDiscord

                        style={{
                            color: "#fff",
                            background: "#dadada",
                            width: "50px",
                            height: "50px",
                            borderRadius: "24px",
                            fontSize: "16px",
                            padding: "10px",
                            cursor: "pointer",
                        }}
                    />
                </a>
                <a
                    href={instagramHandle}
                    target="_blank"
                    rel="noreferrer"
                >
                    <LogoInstagram
                      style={{
                        color: "#fff",
                        background: "#dadada",
                        width: "50px",
                        height: "50px",
                        borderRadius: "24px",
                        fontSize: "16px",
                        padding: "10px",
                        cursor: "pointer",
                      }}
                    />
                </a>
                <a
                  href={youtube}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LogoYoutube
                    style={{
                      color: "#fff",
                      background: "#dadada",
                      width: "50px",
                      height: "50px",
                      borderRadius: "24px",
                      fontSize: "16px",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                  />
                </a>
                    <a
                        href={website}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <LogoWebComponent
                            style={{
                            color: "#fff",
                            background: "#dadada",
                            width: "50px",
                            height: "50px",
                            borderRadius: "24px",
                            fontSize: "16px",
                            padding: "10px",
                            cursor: "pointer",
                            }}
                        />
                    </a>
            </div>
          </div>
          {banner !== "" && ( 
            <div className="row2">
              <img src={banner} alt="banner" />
              <div className="overlay"></div>
            </div>
          )}
        </div>
      </div>
      {/* <div className="banner_hero">
            <div className="hero_text">
              <h1>Welcome to Ikon's Store.</h1>
              <button className="hero-button">Shop Now</button>
            </div>
            <div className="hero_overlay"></div>
            <img className="banner-container" src={banner} alt="banner" />
          </div> */}
      <Container>
        {/* <div className="search_container">
          <div className="input_wrap">
            <input
              type="text"
              name="product_search"
              placeholder="Search products"
            />
          </div>
        </div> */}
        <div className="products-container">
          {products.map((product, index) => (
            <Product key={index} product={product} />
          ))}
        </div>
      </Container>
    </>
  );
}
export default SlabzIo;