import React, { useEffect, useRef } from "react";
import "./Popup.css";
import {RxCrossCircled} from "react-icons/rx"
import {ImCross} from 'react-icons/im'
import {MdCloudDone} from "react-icons/md"


export const Popup = ({message,type,activatePopupUnmount}) => {

  const popupRef=useRef(null)

// Let me explain what this useEffect do this useEffect having function which got triggered when  event mousedown happend
// but !event.target.closest('.box') means whene ever you are doing mousedown(means click down ) at particular place 
// its takes the html from that place and checks if that html not contains .box class inside its any of parent or child
// then actvatePopupUnmount() means close the popup- this basically says close popup when clicked outside of popup.
// and at last as usual removeEventListner- this helps re trigger same function again and also important to prevent memory leak if enough memory is 
// leaked and not released, the application's performance can suffer, leading to slowdowns or crashes. 

useEffect(()=>{
    const handleoutsidePopupClick=(event)=>{
        if( !event.target.closest('.box')){
            activatePopupUnmount()
        }
    }
    document.addEventListener('mousedown',handleoutsidePopupClick)
    return(()=>{
        document.removeEventListener('mousedown',handleoutsidePopupClick)
    })

  },[activatePopupUnmount])

// Sorry i used here html from figma (only here),iam trying figma this feature first time to just test but i found
// its plugin are so bad in creating auto html , i will never use it next time if u hire me, i know this decreases code readbility
//  hope you pardon me for this time.

  return (
    <div className="box" ref={popupRef} >
      <div className="success-card-wrapper">
        <div className="success-card">
          <div className="group">
            {type=='Success'?<MdCloudDone className="img"  color={'#3062c8'} />:<RxCrossCircled className="img2"  color={'red'} />}
            <div className="text-wrapper">{type}</div>
          </div>
          <div className="div">{message}</div>
          <div className="group-wrapper">
            <div className="overlap-group-wrapper">
              <div className="overlap-group">
                <div className="text-wrapper-2">Go to My Entries</div>
              </div>
            </div>
          </div>
          <div className="div-wrapper" onClick={()=>activatePopupUnmount()} >
            <div className="group-2">
              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">
                  <div className="text-wrapper-3"  >Cancel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
