import React,{useState, useEffect, useContext} from 'react';
import './auction-history.css'
import {  query, collection, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AuctionCard from '../auction-card/auction-card';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AuthContext } from '../../contexts/AuthContext';
import AuctionFilters from '../auction-filters/auction-filters';

export default function AuctionHistory(){

     const currentUser = useContext(AuthContext);

     const [selectedOption, setSelectedOption] = useState("1");
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
         return patternParts.some((part) => offer.name.toLowerCase().includes(part.toLowerCase())) || pattern === "";
       });

       setFilterList(filterOffersPattern);

    },[selectedCategories,pattern,listItems])


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

     const handleOptionChange = (event, newOption) => {
        
        if(newOption===null){
            return;
        }

        if(newOption==="1"){
          fetchDataAuctioned(true)
        }
        else if(newOption==="2"){
          fetchDataAuctioned(false);
        }
        else if(newOption==="3"){
          fetchDataCreated(true);
        }
        else if(newOption==="4"){
          fetchDataCreated(false);
        }
        
        
        setSelectedOption(newOption);
    };


    const fetchDataAuctioned = async (isActive) => {
        const q = query(collection(db, 'auctions-history'),where("uid","==",currentUser.uid));
        const querySnapshot = await getDocs(q);

        let list = [];
        await Promise.all(querySnapshot.docs.map(async (content) => {
            let document = { ...content.data(), id: content.id };
        
            const documentSnapshot = await getDoc(doc(db, "auctions", document.auctionid));
        
            if (documentSnapshot.exists()){
                if(documentSnapshot.data().endDate>new Date().toLocaleString() && isActive){
                    list.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
                }

                if(documentSnapshot.data().endDate<=new Date().toLocaleString() && !isActive){
                    list.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
                }
            }
          }));
        

        setListItems(list);
        setFilterList(list);
      };



      const fetchDataCreated = async (isActive) => {
        const q = query(collection(db, 'auctions'),where("uid","==",currentUser.uid));
        const querySnapshot = await getDocs(q);

        let list = [];
        querySnapshot.docs.forEach((content) => {
            let document = { ...content.data(), id: content.id };
        
            if(document.endDate>new Date().toLocaleString() && isActive){
                    list.push(document);
               }

            if(document.endDate<=new Date().toLocaleString() && !isActive){
                 list.push(document);
              }
            
          });
        

          setListItems(list);
          setFilterList(list);
      };


      useEffect(() => {

        fetchDataAuctioned(true);
     }, []);


  

    return(
         <div className="history-box">
           <div className="options">
             <ToggleButtonGroup
                orientation="vertical"
               value={selectedOption}
               exclusive
               onChange={handleOptionChange}
             >
               <ToggleButton value="1" aria-label="Option 1">
                    Licytowane aktywne
               </ToggleButton>
               <ToggleButton value="2" aria-label="Option 2">
                    Licytowane archiwalne
               </ToggleButton>
               <ToggleButton value="3" aria-label="Option 3">
                    Stworzone aktywne
               </ToggleButton>
               <ToggleButton value="4" aria-label="Option 4">
                    Stworzone archiwalne
               </ToggleButton>
               <ToggleButton value="5" aria-label="Option 5">
                    Dane konta
               </ToggleButton>
             </ToggleButtonGroup>
            </div>
            { selectedOption!=="5"?
                (<>
                  <AuctionFilters pattern={pattern} setPattern={setPattern} selectedCategories={selectedCategories} handleCategoryChange={handleCategoryChange} categories={categories} />
                  <div className="list-history">
                         {filerList.map(product =>
                         <AuctionCard key={product.id} id={product.id} name={product.name}
                         startDate={product.createDate} endDate={product.endDate} location={product.location}
                          images={product.files}
                          category={product.category}  endPrice={product.endPrice} />
                       )}
                  </div>
                </>
                ):
                (
                  <div className="user-data">
                     <div>
                       <p>Nazwa użytkownika:</p>
                       <p>{currentUser.userName}</p>
                     </div>
                     <div>
                        <p>Telefon:</p>
                        <p>{currentUser.phone}</p>
                     </div>
                     <div>
                       <p>Email:</p>
                       <p>{currentUser.email}</p>
                     </div>
                  </div>
                )
            }
         </div>
    )
}

