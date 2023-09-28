import React from 'react';
import './auction-card.css'
import { Link, useLocation } from "react-router-dom";


export default function AuctionCard(props){

    let timeLeft='00:00:00:00'

    let url= useLocation().pathname;

    return(
        <div className="card">
            <div className="content-box">
                <picture className="pictrue-card">
                    <img className="img-card" src={props.images && props.images.length>0 ? props.images[0] : ""} alt="product"/>
                </picture>
                <div className="content-details">
                    <h2>{props.name}</h2>
                    <div>
                        <div>
                            <p>Kategoria:</p>
                            <p>{props.category}</p>
                        </div>
                        <div>
                            <p>Rozpoczęcie:</p>
                            <p>{props.startDate.toDate().toLocaleString()}</p>
                        </div>
                        <div>
                            <p>Zakończenie:</p>
                            <p>{props.endDate}</p>
                        </div>
                        <div>
                            <p>Lokalizacja:</p>
                            <p>{props.location}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="price-box">
                <div className="product-price">
                    <p>Cena aktualna:</p>
                    <p>{props.endPrice}</p>
                </div>
                <div className='auction-details'>
                    <Link to={!url.includes("auction-history") ? `/auction-details/${props.id}` : `/auction-history/auction-details/${props.id}`}>Szczegóły</Link>
                </div>
            </div>
        </div>
    )
}