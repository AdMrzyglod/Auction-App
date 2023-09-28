import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './auction-add.css'
import { db, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AuctionFile from '../auction-flie/auction-file';
import { collection, addDoc, serverTimestamp, getDocs, query } from "firebase/firestore"; 
import {  Navigate  } from 'react-router-dom';


export default function AuctionAdd(){

    const currentUser = useContext(AuthContext);

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [brand, setBrand] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [startPrice, setStartPrice] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);

    let conditions=["Nowy","Używany"]


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
    


    const handleFileChange = (event) => {
        event.preventDefault();
        const selectedFiles = Array.from(event.target.files);
        let listFiles=[...files, ...selectedFiles]
        setFiles(listFiles);
      };

      const handleRemoveFile = (event,index) => {
        event.preventDefault();
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
      };

      async function addAuction(auction) {
        await addDoc(collection(db, "auctions"),auction);
      }



    const uploadFilesAndGetURLs = async (files) => {
        const urls = [];
      

        for (const file of files) {

          const storageRef = ref(storage, file.name);
      
          await uploadBytes(storageRef, file);
      
          const url = await getDownloadURL(storageRef);
      
          urls.push(url);
        }
    
        return urls;
      };

      const handleInputChangeMoney = (event) => {

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

        setStartPrice(formattedValue);
      };


    const handleSubmit = async (e) => {
        e.preventDefault();

        let urls = await uploadFilesAndGetURLs(files);

        const formData = {
            name: name,
            category: category,
            condition: condition,
            brand: brand,
            endDate: new Date(endDate).toLocaleString(),
            location: location,
            startPrice: parseFloat(startPrice),
            description: description,
            files: urls,
            endPrice: parseFloat(startPrice),
            uid: currentUser.uid,
            createDate: serverTimestamp()
        };
        
        await addAuction(formData);

        return <Navigate to="/auction-history" replace/>
    };


    return (
        <form className="box-add" onSubmit={handleSubmit}>
          <h2>Dodaj aukcje</h2>
          <div className="input-box">
              <label>Nazwa:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
          </div>
          <div className="flex-container">
             <div className="input-box content">
                 <label>Kategoria:</label>
                 <select className="select-add" value={category} onChange={(e) => setCategory(e.target.value)} required>
                     <option></option>
                     {categories.map((category,index)=>{
                        return (<option key={index}>{category}</option>)
                     })}
                 </select>
             </div>
             <div className="input-box content">
                 <label>Stan:</label>
                 <select className="select-add" value={condition} onChange={(e) => setCondition(e.target.value)} required>
                     <option></option>
                     {conditions.map((condition,index)=>{
                        return (<option key={index}>{condition}</option>)
                     })}
                 </select>
             </div>
          </div>
          <div className="input-box">
              <label>Marka:</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required/>
          </div>
          <div className="flex-container">
             <div className="input-box content">
                 <label>Data zakończenia:</label>
                 <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required/>
             </div>
          </div>
          <div className="input-box">
              <label>Lokalizacja:</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required/>
          </div>
          <div className="input-box">
              <label>Cena startowa:</label>
              <input type="text" value={startPrice} onChange={handleInputChangeMoney} required/>
          </div>
          <div className="input-box">
              <label>Opis:</label>
              <textarea className="areabox" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
          <div className="input-box content">
              <label>Zdjęcia:</label>
              <input type="file" onChange={handleFileChange} multiple/>
              <AuctionFile files={files} handleRemoveFile={handleRemoveFile}/>
          </div>
          <button type="submit" className="add-button">Dodaj</button>
        </form>
    )
}