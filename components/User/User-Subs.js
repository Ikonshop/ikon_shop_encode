import React, {useState, useEffect} from "react";
import { CheckWalletSubOrders } from "../../lib/api";
import styles from "../../styles/Merchant.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import Buy from "../../components/BuySub";


const UserSubs = () => {
    const { publicKey } = useWallet();
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSubs = async () => {
        var currentSubs = [];
        const subData = await CheckWalletSubOrders(publicKey.toString());
        // iterate through the subData.subOrders for any subData.subOrders[i].sub.id that are dupilcates and only add the most recent one based on the subData.subOrders[i].sub.purchaseDate to the currentSubs array along with it's purchaseDate
        if(subData.subOrders.length > 0){
            for (var i = 0; i < subData.subOrders.length; i++) {
                console.log("subData.subOrders[i].sub.id", subData.subOrders[i]);
                var subOrder = subData.subOrders[i];
                var sub = subOrder.sub;
                var purchaseDate = subOrder.purchaseDate;
                if(subData.subOrders[i].sub){
                    var subId = sub.id;
                }else{
                    var subId = "null";
                }

                var subExists = false;
                for (var j = 0; j < currentSubs.length; j++) {
                    var currentSub = currentSubs[j];
                    if (currentSub.sub.id == subId) {
                        subExists = true;
                        if (currentSub.purchaseDate < purchaseDate) {
                            currentSubs[j] = subOrder;
                        }
                    }
                }
                if (!subExists) {
                    currentSubs.push(subOrder);
                }
            }
        }

        // console.log("currentSubs: ", currentSubs);
        setSubs(currentSubs);
        




        // setSubs(subData.subOrders);
        setLoading(false);
        // console.log("subs are", subs);
    };

    useEffect(() => {
        if(publicKey) {
        setTimeout(() => {
            getSubs(publicKey.toString());
        }, 1000);
    }
    }, [publicKey]);


    return (
        <div>
            {loading ? (
                <div className={styles.loading}>
                    <p>Loading...</p>
                </div>
            ) : (
                <div className={styles.user_container}>
                    <h4 className={styles.order_header}>Subscriptions</h4>
                    <table className={styles.sub_table}>

                        {/* <h4 className={styles.paylink_header}>Subscriptions</h4> */}
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Term</th>
                                <th>Cost</th>
                                <th>Actions</th>
                            </tr>
                            {subs.length > 0 ? (
                                
                            subs.map((sub) => (
                                <tr>
                                    <td data-th="Name">{sub.sub.name}</td>
                                    {/* set sub.expireDate to date string */}

                                    <td data-th="Due Date">
                                        {new Date(sub.expireDate).toDateString()}
                                    </td>
                                    <td data-th="Status">
                                        {/* check to see if expireDate is less than current date, if it is then set status as inactive, else set it as active */}
                                        {new Date(sub.expireDate) < new Date() ? (
                                            <>
                                                <span className={styles.overdue_status}></span>
                                                Over Due
                                            </>
                                        ) : (
                                            <>
                                                <span className={styles.active_status}></span>
                                                Active
                                            </>
                                        )}
                                        
                                    </td>
                                    <td data-th="Term">{sub.sub.lifeCycleDays} Day(s)</td>
                                    <td data-th="Cost">{sub.sub.price} {sub.token.toUpperCase()}</td>
                                    <td data-th="Actions">
                                        {new Date(sub.expireDate) < new Date() ? (
                                            <>
                                                <Buy 
                                                    sub={sub.sub}
                                                />
                                            </>
                                        ) : (
                                            <p className={styles.actions}>Cancel</p>
                                        )}
                                    </td>
                                </tr>
                            ))): (null)}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};



export default UserSubs;