import React, { useState, useEffect } from "react";
import { 
    getSingleProductBySku, 
    fetchProducts,
    GetAllSubs,
    GetSubById
} from "../../lib/api";
import styles from "../../styles/ProductDetails.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import BuySub from "../../components/BuySub";
import { useWallet} from "@solana/wallet-adapter-react";
// import Head from "next/head";
import Loading from "../../components/Loading";
import PaylinkComponent from "../../components/Paylink";
import { useRouter } from "next/router";


export default function SingleProductViewer({  }) {
    const { publicKey, connected } = useWallet();
    const router = useRouter();
    const [sub, setSub] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subId, setSubId] = useState("");
    

    useEffect(() => {
        const url = window.location.href;
        const urlArray = url.split("/");
        const subId = urlArray[urlArray.length - 1];
        // create async function called showProductDetails
        async function showProductDetails() {
            // console.log("subId", subId);
            const subData = await GetSubById(subId).then((subData) => {
                // // console.log("res", subData);
                const sub = {
                    id: subData.sub.id,
                    name: subData.sub.name,
                    description: subData.sub.description,
                    price: subData.sub.price,
                    token: subData.sub.token,
                    lifeCycleDays: subData.sub.lifeCycleDays,
                    imageUrl: subData.sub.imageUrl,
                    quantity: subData.sub.quantity,
                    owner: subData.sub.owner,
                    reqUserEmail: subData.sub.reqUserEmail,
                    reqUserShipping: subData.sub.reqUserShipping,
                    collections: {
                        projectName: subData.sub.collections.projectName,
                        website: subData.sub.collections.website,
                        twitterHandle: subData.sub.collections.twitterHandle,
                        discordServer: subData.sub.collections.discordServer,
                    }

                }
                return sub;
            });
            // subData returns an array of objects with the sub data in it so we need to get each object in the array and set it to the state
            // console.log("subData", subData);
            // once subData is returned, set the state of the sub to the subData after that we can use the sub state to display the data and set the loading state to false
            sub.push(subData);
            // console.log('this is the damn sub', sub);
            setLoading(false);
            // console.log('this is the damn sub', sub[0].id);

        }
        
        showProductDetails();

    }, []);

    const renderSingleProduct = () => (
        <div className={styles.product_details_container}>
            <div className={styles.product_details_row}>
                <div className={styles.product_details_col}>
                    <div className={styles.back_wrapper}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <button className={styles.prod_back_to_shop} onClick={() => router.back()}><a><p className={styles.prod_back_to_shop}>Back</p></a></button>
                    </div>
                    <div className={styles.product_details_img}>
                        <div className={styles.prod_img}>
                            <img src={sub[0].imageUrl} alt={sub[0].name} />
                        </div>
                    </div>
                </div>
                <div className={styles.product_details_col}>
                    <div className={styles.product_details_owner}>Owner: {sub[0].owner}</div>
                    <div className={styles.product_details_name}>{sub[0].name}</div>
                    <div className={styles.product_details_description}>{sub[0].description}</div>
                    <div className={styles.product_details_price}>Price: {sub[0].price} {sub[0].token}</div>
                    <div className={styles.product_details_price}># of Subs left: {sub[0].quantity}</div>
                    <div className={styles.product_details_price}>Term: {sub[0].lifeCycleDays} Days</div>
                    {sub[0].reqUserEmail ? (<div className={styles.product_details_price}>Requires Email</div>) : null}
                    {sub[0].reqUserShipping ? (<div className={styles.product_details_price}>Requires Shipping</div>) : null}
                    <div className={styles.product_details_buy}>
                    {publicKey && !loading ? <BuySub sub={sub[0]}/> : null}
                    </div>
                </div>
            </div>
        </div>
    );


    const renderLoading = () => (
        <Loading />
    );
    return (
        <>
        {loading ? renderLoading() : renderSingleProduct()}
        </>
    );
}

// Specify dynamic routes to pre-render pages based on data.
// The HTML is generated at build time and will be reused on each request.
export async function getStaticProps({ params }) {
    const data = await getSingleProductBySku(params.slug);
    return {
        props: {
            product: data,
        },
    };
}  
  
export async function getStaticPaths() {
    const data = await fetchProducts("ABC");
    const paths = data.map(product => ({
        params: {
            slug: product.id,
        },
    }));
    return {
        paths,
        fallback: true,
    };
        
}