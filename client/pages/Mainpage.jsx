import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Mainpage.css";

export default function App() {
  const [style, setStyle] = useState("");
  const [color, setColor] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [outfits, setOutfits] = useState([]);
  const [selectedOutfits, setSelectedOutfits] = useState([]);
  const [saved, setSaved] = useState(false);
  const [gender, setGender] = useState("");

  const femaleColorOptions = [
    "Blue",
    "White",
    "Green",
    "Black",
    "Orange",
    "Grey",
    "Beige",
    "Pink",
    "Red",
    "Yellow",
    "Brown",
    "Silver",
    "Purple",
    "Multicolor",
    "Gold",
  ];
  const femaleStyleOptions = [
    "Active",
    "Business",
    "Dressed-up",
    "Everyday",
    "Formal",
    "Statement",
  ];

  const maleColorOptions = [
    "Navy Blue",
    "Blue",
    "Black",
    "Grey",
    "Green",
    "Purple",
    "Brown",
    "White",
    "Off White",
    "Red",
    "Silver",
    "Khaki",
    "Pink",
    "Yellow",
    "Beige",
    "Gold",
    "Tan",
    "Olive",
    "Maroon",
    "Charcoal",
    "Orange",
    "Steel",
    "Cream",
    "Mustard",
    "Lavender",
    "Grey Melange",
    "Rust",
    "Teal",
  ];
  const maleStyleOptions = [
    "Casual",
    "Ethnic",
    "Formal",
    "Sports",
    "Smart Casual",
  ];

  // Choose based on gender
  const currentColorOptions =
    gender === "M" ? maleColorOptions : femaleColorOptions;
  const currentStyleOptions =
    gender === "M" ? maleStyleOptions : femaleStyleOptions;

  const topwearCategories = [
    "Blouses",
    "Tops",
    "Sweaters",
    "Vests",
    "Knitwear",
    "Shirts",
  ];
  const bottomwearCategories = ["Trousers", "Skirts", "Shorts"];
  const outerwearCategories = ["Coats", "Blazers", "Cardigans", "Jackets"];
  const accessoryCategories = ["Jewelry", "Bags", "Accessories", "Shoes"];
  const dressCategories = ["Dresses"];
  const jumpsuitCategories = ["Jumpsuits"];
  const miniMidiMaxiFits = ["Mini", "Midi", "Maxi"];

  const setKeywords = ["set", "suit"];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
      setGender(user.gender);
    }

    const datasetUrl =
      user?.gender === "F" ? "/outfits.json" : "/outfits_men.json";

    fetch(datasetUrl)
      .then((res) => res.json())
      .then((data) => setOutfits(data))
      .catch((err) => console.error("Error loading outfits:", err));
  }, []);

  function handleSubmit() {
    setSaved(false);
    if (!style || !color) {
      alert("Please select both style and color.");
      return;
    }

    if (gender === "F") {
      return handleFemaleRecommendation();
    } else if (gender === "M") {
      return handleMaleRecommendation();
    } else {
      alert("Gender not recognized.");
    }
  }

  function handleFemaleRecommendation() {
    console.log("Selected Style:", style);
    console.log("Selected Color:", color);
    console.log("Available Outfits:", outfits);

    //  Exclude accessories for the first item
    const firstItemCandidates = outfits.filter((item) => {
      const occasions = item.Occasion
        ? item.Occasion.split(",").map((o) => o.trim().toLowerCase())
        : [];
      return (
        occasions.includes(style.trim().toLowerCase()) &&
        item.Color?.trim().toLowerCase() === color.trim().toLowerCase() &&
        !accessoryCategories.includes(item.Category)
      );
    });

    console.log("Matching First Item Outfits:", firstItemCandidates);

    if (firstItemCandidates.length === 0) {
      alert("No outfits found for the selected style and color.");
      return;
    }

    const firstItem =
      firstItemCandidates[
        Math.floor(Math.random() * firstItemCandidates.length)
      ];

    //  Check if the first item is a "set" or "suit"
    const isSetOrSuit = setKeywords.some((keyword) =>
      firstItem.description.toLowerCase().includes(keyword)
    );

    if (isSetOrSuit) {
      // If it's a set, display only this item and label it as "Set"
      setSelectedOutfits([{ ...firstItem, Category: "Set" }]);
      setSubmitted(true);
      return;
    }

    let secondItemCandidates = outfits.filter(
      (item) =>
        item.Occasion?.split(",")
          .map((o) => o.trim().toLowerCase())
          .includes(style.trim().toLowerCase()) &&
        item.file_name !== firstItem.file_name
    );

    let secondItem = null;

    //  Matching logic with outerwear + jumpsuit exclusion
    if (topwearCategories.includes(firstItem.Category)) {
      secondItemCandidates = secondItemCandidates.filter((item) =>
        bottomwearCategories.includes(item.Category)
      );
    } else if (bottomwearCategories.includes(firstItem.Category)) {
      secondItemCandidates = secondItemCandidates.filter((item) =>
        topwearCategories.includes(item.Category)
      );
    } else if (outerwearCategories.includes(firstItem.Category)) {
      secondItemCandidates = secondItemCandidates.filter(
        (item) =>
          !outerwearCategories.includes(item.Category) &&
          !jumpsuitCategories.includes(item.Category)
      );
    } else if (dressCategories.includes(firstItem.Category)) {
      secondItemCandidates = secondItemCandidates.filter(
        (item) =>
          accessoryCategories.includes(item.Category) ||
          outerwearCategories.includes(item.Category)
      );
    } else if (jumpsuitCategories.includes(firstItem.Category)) {
      secondItemCandidates = secondItemCandidates.filter(
        (item) => !outerwearCategories.includes(item.Category)
      );
    } else if (firstItem.Category === "Shoes") {
      secondItemCandidates = secondItemCandidates.filter(
        (item) =>
          item.Category === "Jumpsuits" ||
          item.Category === "Dresses" ||
          miniMidiMaxiFits.includes(item.Fit)
      );
    }

    if (miniMidiMaxiFits.includes(firstItem.Fit)) {
      secondItemCandidates = secondItemCandidates.filter((item) =>
        accessoryCategories.includes(item.Category)
      );
    }

    if (secondItemCandidates.length > 0) {
      secondItem =
        secondItemCandidates[
          Math.floor(Math.random() * secondItemCandidates.length)
        ];
    }

    // Add third item for outerwear + top/bottom combo
    let thirdItem = null;
    const isOuterwear = outerwearCategories.includes(firstItem.Category);
    if (
      (isOuterwear && topwearCategories.includes(secondItem?.Category)) ||
      (isOuterwear && bottomwearCategories.includes(secondItem?.Category))
    ) {
      const thirdItemCandidates = outfits.filter(
        (item) =>
          item.Occasion?.split(",")
            .map((o) => o.trim().toLowerCase())
            .includes(style.trim().toLowerCase()) &&
          item.file_name !== firstItem.file_name &&
          item.file_name !== secondItem?.file_name
      );

      if (secondItem && topwearCategories.includes(secondItem.Category)) {
        thirdItem = thirdItemCandidates.find((item) =>
          bottomwearCategories.includes(item.Category)
        );
      } else if (
        secondItem &&
        bottomwearCategories.includes(secondItem.Category)
      ) {
        thirdItem = thirdItemCandidates.find((item) =>
          topwearCategories.includes(item.Category)
        );
      }
    }

    const outfitCombo = [firstItem, secondItem, thirdItem].filter(Boolean);
    setSelectedOutfits(outfitCombo);
    setSubmitted(true);
  }

  function handleMaleRecommendation() {
    console.log("Selected Style (Usage):", style);
    console.log("Selected Color:", color);
    console.log("Available Outfits:", outfits);

    // Get normalized version of usage/style
    const selectedStyle = style.trim().toLowerCase();
    const selectedColor = color.trim().toLowerCase();

    const firstItemCandidates = outfits.filter((item) => {
      const itemUsage = item.usage?.toLowerCase();
      const itemColor = item.baseColour?.toLowerCase();
      const isAccessoryOrFootwear = ["Accessories", "Footwear"].includes(
        item.masterCategory
      );

      return (
        itemUsage === selectedStyle &&
        itemColor === selectedColor &&
        !isAccessoryOrFootwear
      );
    });

    if (firstItemCandidates.length === 0) {
      alert("No outfits found for the selected style and color.");
      return;
    }

    const firstItem =
      firstItemCandidates[
        Math.floor(Math.random() * firstItemCandidates.length)
      ];
    const selectedSeason = firstItem.season;

    console.log("Selected First Item:", firstItem);

    // Determine if first is top or bottom
    const topwear = ["Topwear"];
    const bottomwear = ["Bottomwear"];
    const isTop = topwear.includes(firstItem.subCategory);
    const isBottom = bottomwear.includes(firstItem.subCategory);

    let secondItemCandidates = outfits.filter((item) => {
      const itemUsage = item.usage?.toLowerCase();
      const sameSeason = item.season === selectedSeason;
      const notFirstItem = item.filename !== firstItem.filename;

      // Match usage and season
      if (itemUsage !== selectedStyle || !sameSeason || !notFirstItem)
        return false;

      if (isTop) {
        return bottomwear.includes(item.subCategory);
      } else if (isBottom) {
        return topwear.includes(item.subCategory);
      }
      return false;
    });

    let secondItem = null;
    if (secondItemCandidates.length > 0) {
      secondItem =
        secondItemCandidates[
          Math.floor(Math.random() * secondItemCandidates.length)
        ];
    }

    console.log("Selected Second Item:", secondItem);

    // Third item (optional): accessories or footwear with same usage and season
    let thirdItem = null;
    const thirdItemCandidates = outfits.filter((item) => {
      const itemUsage = item.usage?.toLowerCase();
      const sameSeason = item.season === selectedSeason;
      const notUsed =
        item.filename !== firstItem.filename &&
        item.filename !== secondItem?.filename;
      const isAccessoryOrFootwear = ["Accessories", "Footwear"].includes(
        item.masterCategory
      );

      const isTieInEthnic =
        selectedStyle === "ethnic" && item.articleType === "Ties";

      return (
        itemUsage === selectedStyle &&
        sameSeason &&
        notUsed &&
        isAccessoryOrFootwear &&
        !isTieInEthnic
      );
    });

    if (thirdItemCandidates.length > 0) {
      thirdItem =
        thirdItemCandidates[
          Math.floor(Math.random() * thirdItemCandidates.length)
        ];
    }

    console.log("Selected Third Item (Accessory/Footwear):", thirdItem);

    const outfitCombo = [firstItem, secondItem, thirdItem].filter(Boolean);
    setSelectedOutfits(outfitCombo);
    setSubmitted(true);
  }

  const handleSave = async () => {
    if (!loginUser || !selectedOutfits.length) {
      alert("No outfits to save.");
      return;
    }

    const getFilename = (item) =>
      gender === "M" ? item?.link || "" : item?.file_name || "";
    const getDescription = (item) =>
      gender === "M" ? item?.productDisplayName || "" : item?.description || "";

    const outfitData = {
      userid: loginUser._id,
      img1_filename: getFilename(selectedOutfits[0]),
      img1_description: getDescription(selectedOutfits[0]),
      img2_filename: getFilename(selectedOutfits[1]),
      img2_description: getDescription(selectedOutfits[1]),
      img3_filename: getFilename(selectedOutfits[2]),
      img3_description: getDescription(selectedOutfits[2]),
    };

    try {
      const response = await fetch("/api/main/save-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outfitData),
      });

      if (response.ok) {
        alert("Outfit saved successfully!");
        setSaved(true);
      } else {
        alert("Failed to save outfit.");
      }
    } catch (error) {
      console.error("Error saving outfit:", error);
    }
  };

  const getSingularCategory = (category) => {
    if (topwearCategories.includes(category)) return "Top";
    if (bottomwearCategories.includes(category)) return "Bottom";
    if (outerwearCategories.includes(category)) return "Outerwear";
    if (accessoryCategories.includes(category)) return "Accessory";
    return category; // Keep other categories as is
  };

  return (
    <div className="main-App">
      <Header loginUser={loginUser} />

      <div className="main-form-container">
        <div className="main-field">
          <label className="main-label">Style</label>
          <select
            className="main-input"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="">Select Style</option>
            {currentStyleOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="main-field">
          <label className="main-label">Color</label>
          <select
            className="main-input"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="">Select Color</option>
            {currentColorOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button className="main-button" onClick={handleSubmit}>
          SUGGEST
        </button>
      </div>

      {submitted && (
        <div className="results-container">
          {selectedOutfits.map((outfit, index) => (
            <div className="card" key={index}>
              <h3>{gender === "M" ? outfit.articleType : outfit.Category}</h3>

              <img
                src={
                  gender === "M" ? outfit.link : `/images/${outfit.file_name}`
                }
                alt={
                  gender === "M"
                    ? outfit.productDisplayName
                    : outfit.description
                }
                className="card-image"
              />

              <p>
                {gender === "M"
                  ? outfit.productDisplayName
                  : outfit.description}
              </p>
            </div>
          ))}

          <button className="save-button" onClick={handleSave} disabled={saved}>
            {saved ? "✔" : "💾"}
          </button>
        </div>
      )}
    </div>
  );
}
