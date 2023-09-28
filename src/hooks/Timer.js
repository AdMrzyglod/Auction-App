import { useEffect, useState } from 'react';


export const Timer = ({destination}) => {
  const counterDate = new Date(formatDate(destination)).getTime();

  const [remainingTime, setRemainingTime] = useState('00:00:00:00');

  useEffect(() => {
    let dateInterval = setInterval(() => {

        let distance = counterDate - new Date().getTime();
        
        if(distance<=0){
            clearInterval(dateInterval);
        }
        else{
          let format= calculateTimeLeft(distance);
          setRemainingTime(        
            `${format[0].toString().padStart(2, '0')} : ${format[1].toString().padStart(2, '0')} : ${format[2].toString().padStart(2, '0')} : ${format[3].toString().padStart(2, '0')}`)
        }
    }, 1000);

    return () => clearInterval(dateInterval);
  }, [counterDate]);

  return <p>{remainingTime}</p>
};


function formatDate(dateString){
  const [date, time] = dateString.split(", ");
  const [day, month, year] = date.split(".");
  const [hour, minute, second] = time.split(":");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

function calculateTimeLeft(time){

    let timeArray=[0,0,0,0]

  timeArray[0] = Math.floor(time / (1000 * 60 * 60 * 24));
  timeArray[1] = Math.floor(
    (time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  timeArray[2] = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  timeArray[3] = Math.floor((time % (1000 * 60)) / 1000);

  return timeArray;
};

