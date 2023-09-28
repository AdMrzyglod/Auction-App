import React,{ useRef,useContext, useLayoutEffect } from 'react';
import './auction-log.css'
import { AuthContext } from '../../contexts/AuthContext';


export default function AuctionLog({listOffers}){

  const currentUser = useContext(AuthContext);

   const scroll = useRef(null);

   useLayoutEffect(()=>{

       if (scroll.current) {
         scroll.current.scrollTop = scroll.current.scrollHeight;
       }

   })
    
    return(
        <div className="log-box" ref={scroll}>
            <div className="log-list">
                {
                  listOffers.map((offer)=>{

                    return (<div key={offer.id} className={["offer", currentUser && currentUser.uid===offer.uid ? "userOffer": "right"].join(' ')}>
                        <div>
                              <p>{offer.userName}</p>
                              <p>{offer.price} PLN</p>
                        </div>
                        {offer.createdAt ?
                        (<div>
                              <p>{offer.createdAt.toDate().toLocaleString()}</p>
                        </div>):
                        (<></>)
                        }
                    </div>)
                  })
                }
            </div>
        </div>
    )
}