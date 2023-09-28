import React,{ useEffect,useState } from 'react';
import './auction-list.css'
import AuctionCard from '../auction-card/auction-card';
import {  query, collection, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';

import AuctionFilters from '../auction-filters/auction-filters';




export default function AuctionList(){

     const [listItems, setListItems] = useState([]);
     const [filerList, setFilterList] = useState([]);
     const [selectedCategories, setSelectedCategories] = useState([]);
     const [pattern, setPattern] = useState('');
     const [categories, setCategories] = useState([]);


     const handleCategoryChange = (event) => {
       setSelectedCategories(event.target.value);
     };


     useEffect(()=>{

        if(selectedCategories.length===0 && pattern===""){
            setFilterList(listItems);
            return;
        }

        let filterOffers=listItems.filter((offer)=>{
            return selectedCategories.includes(offer.category) || selectedCategories.length===0;
        })

        let filterOffersPattern = filterOffers.filter((offer)=>{
          let patternParts = pattern.split(" ").filter((part)=> {return part!==""});
          console.log(patternParts)
          return patternParts.some((part) => offer.name.toLowerCase().includes(part.toLowerCase())) || pattern === "";
        });

        setFilterList(filterOffersPattern);

     },[selectedCategories,pattern])


     useEffect(()=>{

          async function fetchCategories(){
            const categoriesSnapshot = await getDocs(
              query(collection(db, "categories"))
            );
  
            if (!categoriesSnapshot.empty) {

                let data = categoriesSnapshot.docs.map((category)=>{
                    return category.data().name;
                })

                setCategories(data);
            }
          }

         fetchCategories();

      },[])

    useEffect(() => {
        const fetchData = async () => {
          const q = query(collection(db, 'auctions'), where('endDate', '>=', new Date().toLocaleString()));
          const querySnapshot = await getDocs(q);

          let list = [];
          

          await Promise.all(
            querySnapshot.docs.map( async (doc)=>{
              let document = {...doc.data(),id: doc.id };
                
              let maxPrice= await getDocs(query(
                collection(db, "auctions",document.id,"offers"),
                orderBy("price", "desc"),
                limit(1)));
              
                if(!maxPrice.empty){
                  document.endPrice = maxPrice.docs[0].data().price;
                }
              
                list.push(document);
            })
          )

          setListItems(list);
          setFilterList(list);
        };
    
        fetchData();
      }, []);
    

   

    return(
        <div className="flex-box">
            <AuctionFilters pattern={pattern} setPattern={setPattern} selectedCategories={selectedCategories} handleCategoryChange={handleCategoryChange} categories={categories} />
            <div className="list">
                {filerList.map(product =>
                  <AuctionCard key={product.id} id={product.id} name={product.name}
                  startDate={product.createDate} endDate={product.endDate} location={product.location}
                   images={product.files}
                   category={product.category}  endPrice={product.endPrice} />
                )}
            </div>
        </div>
    )
}