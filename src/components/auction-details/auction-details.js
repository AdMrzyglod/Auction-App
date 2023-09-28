import React, { useState, useContext,useEffect } from 'react';
import './auction-details.css'
import { Link, useParams } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext';
import {  query, collection, where, getDoc,doc, getDocs, serverTimestamp, addDoc, orderBy,onSnapshot,limit  } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AuctionLog from '../auction-log/auction-log';
import { useLocation } from 'react-router-dom';
import ImageGallery from "react-image-gallery";
import {Timer} from "../../hooks/Timer"


export default function AuctionDetails(){

   const currentUser = useContext(AuthContext);

   let url=useLocation().pathname;

   let increaseOffer= 5;

    const {id} = useParams();
    const [offer, setOffer] = useState('');
    const [maxOffer, setMaxOffer] = useState(0);
    const [problemOffer,setProblemOffer] = useState(false);

    const [details,setDetails] = useState({});
    const [userData,setUserData] = useState({});
    const [clientUser,setClientUser] = useState({});
    const [saved, setSaved] = useState(false);
    const [listOffers, setListOffers] = useState([]);
    const [numberOfUsers,setNumberOfUsers]=useState(0);


    useEffect(() => {

      const fetchData = async () => {
        try {
          const documentSnapshot = await getDoc(doc(db, "auctions", id));
         
          if (documentSnapshot.exists()) {
            setDetails({...documentSnapshot.data(),id: documentSnapshot.id });

            setOffer(documentSnapshot.data().startPrice+increaseOffer);

            setMaxOffer(parseFloat(documentSnapshot.data().startPrice));

            const userSnapshot = await getDocs(
              query(collection(db, "users"), where("uid", "==", documentSnapshot.data().uid))
            );

            if (!userSnapshot.empty) {
              setUserData({ ...userSnapshot.docs[0].data(), id: userSnapshot.docs[0].id });
            }
            
            if(documentSnapshot.data().endDate<new Date().toLocaleString()){

                let clientSnapshot= await getDocs(query(
                  collection(db, "auctions",id,"offers"),
                  orderBy("price", "asc"),
                  orderBy("createdAt","asc"),
                  limit(1)
                ))


                if(!clientSnapshot.empty){

                    let clientDataSnapshot = await getDocs(query(collection(db,"users"),where("uid","==",clientSnapshot.docs[0].data().uid)));
                    
                    if(!clientDataSnapshot.empty){
                      setClientUser({...clientDataSnapshot.docs[0].data(),id: clientDataSnapshot.docs[0].id});
                    }
                }
            }
          } 
        } catch (error) {
          console.error(error);
        }
      };

      fetchData()

    }, [id]);


    useEffect(() => {
      const unsubscribe = onSnapshot(query(
        collection(db, "auctions",id,"offers"),
        orderBy("price", "asc"),
        orderBy("createdAt","asc"),
        limit(30)
      ), (querySnapshot) => {

          const offers = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));

        setListOffers(offers);
        setMaxOffer(offers.length>0 ? parseFloat(offers[offers.length-1].price) : maxOffer);

        if(offers.length>0){
          setClientUser(offers[offers.length-1]);
        }
      });
      return unsubscribe;
    }, [id]);


    useEffect(() => {
      const unsubscribe = onSnapshot(query(collection(db, "auctions-history"), where("auctionid","==",id))
      , (querySnapshot) => {
        
        if(querySnapshot.docs.length>0){
          setNumberOfUsers(querySnapshot.docs.length);
        }

      });
      return unsubscribe;
    }, [id]);

    const handleInputOffer = (event) => {

      const value = event.target.value;

      const numericValue = value.replace(/[^\d.]/g, '');

      const [integerPart, decimalPart] = numericValue.split('.');

      let formattedDecimalPart = decimalPart || "00";
      if (formattedDecimalPart.length > 2) {
        formattedDecimalPart = formattedDecimalPart.slice(0, 2);
      }

      let formattedIntegerPart = integerPart || "0";
      if (formattedIntegerPart.length > 1 && formattedIntegerPart.startsWith("0")) {
        formattedIntegerPart = formattedIntegerPart.replace(/^0+/, "");
      }
    
      const formattedValue = `${formattedIntegerPart}.${formattedDecimalPart}`;

      setOffer(formattedValue);
      setProblemOffer(parseFloat(maxOffer)+increaseOffer>parseFloat(formattedValue));
    };


    async function addOfferToAuction(userOffer) {
      await addDoc(collection(db, "auctions",details.id,"offers"),userOffer);
    }




    async function updateAuctionHistory(){
      await addDoc(collection(db, "auctions-history"),{
        uid: currentUser.uid,
        auctionid: details.id
      });
    }


    const handleSubmit = async (e) => {
      e.preventDefault();

      setProblemOffer(parseFloat(maxOffer)+increaseOffer>parseFloat(offer));

      if(!(parseFloat(maxOffer)+increaseOffer>parseFloat(offer))){
        
          const sendOffer = {
            uid: currentUser.uid,
            userName: currentUser.userName,
            price: parseFloat(offer),
            createdAt: serverTimestamp()
          }

          await addOfferToAuction(sendOffer)


          if(!saved){
            const savedSnapshot = await getDocs(
              query(collection(db, "auctions-history"), where("uid", "==", currentUser.uid), where("auctionid", "==", id))
            );

            if(savedSnapshot.empty){
              await updateAuctionHistory();
            }
            setSaved(true);
          }
       }

    };



    return (
         <div className="box-auction">
             <Link to={ !url.includes("auction-history")? '/auction-list': '/auction-history'} className="backButton">Wstecz</Link>
             <div className="first-box">
                 <div className="inform">
                     <h2>{details.name}</h2>
                        {details && details.files && details.files.length !== 0 ? 
                        (

                          <ImageGallery items={details.files.map((file)=>{
                            return {
                              original: file,
                              thumbnail: file
                            }
                          })}  showPlayButton={false} showFullscreenButton={false}/>
      
                        ):
                          (<></>)
                        }
                 </div>
                 <div className="inform-details">
                   <p><span>Kategoria: </span> {details.category}</p>
                   <p><span>Marka: </span> {details.brand}</p>
                   <p><span>Stan: </span> {details.condition}</p>
                   <p><span>Start: </span> {details && details.createDate ? details.createDate.toDate().toLocaleString() : ""}</p>
                   <p><span>Koniec: </span> {details.endDate}</p>
                   <p><span>Lokalizacja: </span> {details.location}</p>
                   <p><span>Cena wywoławcza: </span> {details.startPrice} PLN</p>
                 </div>
                 <div className="inform-desc">
                   <p>Opis:</p>
                   <p>{details.description}</p>
                 </div>
             </div>
             <div className="second-box">
               <div className="auction-panel">
                   <h2>Licytacja</h2>
                   <div className="auction-panel-box">
                     <p>Aktualna cena:</p>
                     <p>{ Math.max(maxOffer,(details ? details.startPrice : 0))} PLN</p>
                   </div>
                   <div className="auction-panel-box">
                     <p>Pozostało czasu:</p>
                     {details && details.endDate && details.endDate>=new Date().toLocaleString() ? 
                        (<Timer destination={details.endDate} />)  :
                        <p>00:00:00:00</p>
                    }
                   </div>
                   <AuctionLog listOffers={listOffers} />
                   {(details && currentUser && currentUser.uid===details.uid) || (!currentUser) || (details.endDate && details.endDate<new Date().toLocaleString()) ?
                    (<></>): 
                    (
                     <form onSubmit={handleSubmit} className="auction-panel-input">
                     <label>
                       Twoja oferta (PLN):
                     </label>
                     <input
                         type="text"
                         value={offer}
                         onChange={handleInputOffer}
                       />
                     {problemOffer && <p className="offerError">Twoja cena musi być nie mniejsza niż {maxOffer+increaseOffer}</p>}
                     <button type="submit">Licytuj</button>
                   </form>
                    )}
                   <p>Licytuje: {numberOfUsers} użytkowników</p>
               </div>
               <div className="user-box">
                 <div>
                   <p>Sprzedawca:</p>
                   <p>{userData.userName}</p>
                 </div>
                 <div>
                    <p>Telefon:</p>
                    <p>{userData.phone}</p>
                 </div>
                 <div>
                   <p>Email:</p>
                   <p>{userData.email}</p>
                 </div>
               </div>
               {details && details.endDate<new Date().toLocaleString() && clientUser ? (
                    <div className="user-box">
                     <div>
                       <p>Kupujący:</p>
                       <p>{clientUser.userName}</p>
                     </div>
                     {clientUser.uid!==currentUser.uid && details.uid!==currentUser.uid ? (<></>):
                      (
                        <>
                         <div>
                           <p>Telefon:</p>
                           <p>{clientUser.phone}</p>
                        </div>
                        <div>
                          <p>Email:</p>
                          <p>{clientUser.email}</p>
                        </div>
                        </>
                      )
                     }
                     <div>
                       <p>Cena:</p>
                       <p>{listOffers.length>0 ? listOffers[listOffers.length-1].price+" PLN" : ""}</p>
                     </div>
                   </div>
               ): <></>}
             </div>
         </div>
    )
 
}