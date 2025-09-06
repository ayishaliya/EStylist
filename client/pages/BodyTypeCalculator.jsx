import { useState } from "react";
import "./BodyTypeCalculator.css";
import Navbar from "../components/Navbar";

export default function BodyTypeCalculator() {
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [highHip, setHighHip] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState(null);

  const validateInput = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 30 && num < 200;
  };

  const calculateBodyType = () => {
    if (![bust, waist, highHip, hip].every(validateInput)) {
      setResult({
        error: "Please enter realistic values between 30 and 200 cm.",
      });
      return;
    }

    const bustNum = parseFloat(bust);
    const waistNum = parseFloat(waist);
    const highHipNum = parseFloat(highHip);
    const hipNum = parseFloat(hip);
    const highHipRatio = highHipNum / waistNum;
    let bodyType = "";

    if (
      hipNum - bustNum > 5.08 &&
      hipNum - waistNum >= 17.78 &&
      highHipRatio >= 1.193
    ) {
      bodyType = "Spoon";
    }
    // Bottom Hourglass
    else if (
      hipNum - bustNum >= 9.14 &&
      hipNum - bustNum < 25.4 &&
      hipNum - waistNum >= 22.86 &&
      highHipRatio < 1.193
    ) {
      bodyType = "Bottom Hourglass";
    }
    // Top Hourglass
    else if (
      bustNum - hipNum > 2.54 &&
      bustNum - hipNum < 25.4 &&
      bustNum - waistNum >= 22.86
    ) {
      bodyType = "Top Hourglass";
    }
    // Hourglass
    else if (
      (Math.abs(bustNum - hipNum) <= 2.54 &&
        hipNum - bustNum < 9.14 &&
        bustNum - waistNum >= 22.86) ||
      hipNum - waistNum >= 25.4
    ) {
      bodyType = "Hourglass";
    }
    // Inverted Triangle
    else if (hipNum - bustNum >= 9.14 && hipNum - waistNum < 22.86) {
      bodyType = "Inverted Triangle";
    } else if (bustNum - hipNum >= 9.14 && bustNum - waistNum < 22.86) {
      bodyType = "Inverted Triangle";
    }
    // Rectangle
    else if (
      hipNum - bustNum < 9.14 &&
      bustNum - hipNum < 9.14 &&
      bustNum - waistNum < 22.86 &&
      hipNum - waistNum < 25.4
    ) {
      bodyType = "Rectangle";
    } else {
      bodyType = "Unknown";
    }

    setResult({ bodyType });
  };

  return (
    <div className="type-wrapper">
      <Navbar />
      <div className="calculator-container">
        <h2>Body Type Calculator</h2>
        <p className="type-para">
          The Body Type Calculator helps determine your body shape based on key
          measurements. This can be useful for finding clothes that fit well and
          understanding your body's proportions. The inputs required are bust
          size, waist size, high hip size, and hip size.
        </p>
        <div className="box">
          <div className="inputs">
            <div className="input-group">
              <label>Bust Size (cm):</label>
              <input
                type="number"
                placeholder="cm"
                value={bust}
                onChange={(e) => setBust(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Waist Size (cm):</label>
              <input
                type="number"
                placeholder="cm"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>High Hip Size (cm):</label>
              <input
                type="number"
                placeholder="cm"
                value={highHip}
                onChange={(e) => setHighHip(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Hip Size (cm):</label>
              <input
                type="number"
                placeholder="cm"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                required
              />
            </div>
            <button onClick={calculateBodyType} className="calculate-btn">
              Calculate
            </button>
            {result && (
              <div className="result">
                {result.error ? (
                  <p style={{ color: "black" }}>{result.error}</p>
                ) : (
                  <div>
                    <p className="result-info">
                      Body Shape: <strong>{result.bodyType}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="body-image">
            <img
              src="/image.png"
              alt="Body Types"
              className="reference-image"
            />
          </div>
        </div>
        <p className="type-para">
          <strong>Bust size:</strong> Measured around the fullest part of your
          chest.
          <br />
          <strong>Waist size:</strong> The smallest circumference around your
          natural waist.
          <br />
          <strong>High hip size:</strong> The upper swell of the hip, around 7
          inches below the waist.
          <br />
          <strong>Hip size:</strong> The widest part of your hips over the
          buttocks.
        </p>
        <h3>Body Types</h3>
        <p className="type-para">
          <strong>Apple or inverted triangle:</strong> This body shape describes
          a person who has broader shoulders and bust than they do hips.
          <br />
          <strong>Rectangle or banana:</strong> This body shape describes a
          person who typically has waist measurements that are less than 9
          inches smaller than the hip or bust measurements.
          <br />
          <strong>Pear or spoon:</strong> This body shape describes a person who
          has hip measurements greater than their bust measurements.
          <br />
          <strong>Hourglass:</strong> This body shape (typically presented as
          the "ideal") describes a person with hip and bust measurements nearly
          equal in size, with a narrower waist measurement.
        </p>
        <img src="/image2.png" alt="Body Types" className="reference-image" />
      </div>
    </div>
  );
}
