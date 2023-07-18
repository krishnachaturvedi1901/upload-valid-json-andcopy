import React, { useEffect, useRef, useState } from "react";
import "../Styles/JsonSubmitForm.css";
import { Popup } from "../Components/JsonFormCompo/Popup";
import { MdOutlineDone, MdOutlineUploadFile } from "react-icons/md";
import { LiaSpinnerSolid } from "react-icons/lia";
import { PiCopySimpleThin } from "react-icons/pi";

const JsonSubmitForm = () => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [type, setType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [validating, setValidating] = useState(false);
  const [startCopy, setStartCopy] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // This checks if same file has been uploded it should again be validated.
    if (file && selectedFile.name === file.name) {
      setFile(null);
      setFile(selectedFile);
    } else {
      setFile(selectedFile);
    }

    // Validate the file type
    const fileType = selectedFile.type;
    if (fileType !== "application/json") {
      setErrorMessage("Error: Please upload a JSON file.");
      setValidating(false);
      setType("Error");
      setFileContent("");
      return;
    }

    // Read the file content and process the JSON data
    const filecontentreader = new FileReader();
    filecontentreader.onload = (e) => {
      try {
        /* I found a error in JSON.parse validater it not validate the onlu first uploded json file in one go when you 
        uploded after refresh first time so its better we use some other json validator - but iam not tring it due to time 
        constraint - jsonschema.validate(jsondata,schema) method to do that- but this method is not dynamic you have to find better. */

        const jsonData = JSON.parse(e.target.result);
        setFileContent(JSON.stringify(jsonData, null, 2));
        setErrorMessage(`${file.size} entries successfully loaded`);
        setType("Success");
        setValidating(false);
      } catch (error) {
        setErrorMessage("Error: Invalid JSON file format.");
        setType("Error");
        setFileContent("");
        setValidating(false);
      }
    };
    filecontentreader.readAsText(selectedFile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowPopup(true);
  };

  // We need to first nullify the value so that when you pic same file again onchange function must trigger
  // handleFileChange() function if we selects same file again without nullifying already exist value
  // so onchange not trigger handleFileChange() function.
  const handleFileClick = () => {
    setValidating(true);
    if (file) {
      document.getElementById("jsonInputId").value = null;
    }
  };

  // This function got triggred from <Popup function when someone cliks cancle button and <Popup function got
  // unmounted .
  const activatePopupUnmount = () => {
    setShowPopup(false);
  };

  const handleCopyToClipboard = () => {
    setStartCopy(true);
    const ele = document.getElementById("filecontentdiv");
    navigator.clipboard
      .writeText(ele.textContent)
      .then(() => {
        const timer = setTimeout(() => {
          setStartCopy(false);
          return () => {
            clearTimeout(timer);
          };
        }, [1000]);
        console.log("Copy to clipboard success");
      })
      .catch(() => {
        console.log("Error in copy to clipboard");
      });
  };
  return (
    <section className="formSection">
      <form className="form" onSubmit={handleSubmit}>
        <label className="label-class" htmlFor="fullnameid">
          Full Name
        </label>
        <br />
        <input
          className="input-class"
          type="text"
          placeholder="Full Name"
          id="fullnameid"
        />
        <br />
        <label className="label-class" htmlFor="emailid">
          Email
        </label>
        <br />
        <input
          className="input-class"
          type="email"
          id="emailid"
          placeholder="Email"
        />
        <br />
        <label className="label-class" htmlFor="jsoninputid">
          Upload JSON File
        </label>
        <br />
        <div className="input-file-container">
          <input
            type="file"
            id="jsonInputId"
            onClick={handleFileClick}
            onChange={handleFileChange}
          />
          {!validating ? (
            <div className="browseFileIconDiv">
              <span id="icon-span">
                <MdOutlineUploadFile size={30} color="#3062c8" />
              </span>
              <span id="browseFile-text-span">Browse File</span>
            </div>
          ) : (
            <div className="browseFileIconDiv">
              <span id="icon-span">
                <LiaSpinnerSolid size={30} color="#3062c8" />
              </span>
              <span id="browseFile-text-span" style={{ color: "#3062c8" }}>
                Validating...
              </span>
            </div>
          )}
        </div>
        <label className="label-class" htmlFor="filecontentdiv">
          File Contents
        </label>
        <br />
        <div className="filecontentdivFather">
          <textarea
            id="filecontentdiv"
            className="filecontentdiv"
            readOnly
            value={type === "Error" ? errorMessage : fileContent}
          />
          <div className="copyIconDiv" >
            {!startCopy ? (
              <div onClick={handleCopyToClipboard}>
                <PiCopySimpleThin />
              </div>
            ) : (
              <div>
                <MdOutlineDone />
              </div>
            )}
          </div>
        </div>
        <button className="submitBtn" type="submit">
          Submit
        </button>
      </form>
      {showPopup ? (
        <Popup
          message={errorMessage}
          type={type}
          activatePopupUnmount={activatePopupUnmount}
        />
      ) : null}
    </section>
  );
};

export default JsonSubmitForm;
