import "./AboutUs.css";
import Navbar from "../components/Navbar";
export default function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <div className="about-box">
          <h1 className="about-title">About Us</h1>
          <p className="about-text">
            Welcome to <span className="about-brand">EStylist</span>, your
            personal fashion assistant! We help you find the perfect outfit by
            recommending tops and bottoms tailored to your age, size, occasion,
            body type and your colour preference. Our expert-driven approach
            ensures that every suggestion enhances your personal style and
            comfort.
          </p>

          <h2 className="about-subtitle">Our Mission</h2>
          <p className="about-text">
            We believe that fashion should be accessible, inclusive and
            empowering for everyone. Whether you're dressing up for a special
            occasion or just picking out a casual outfit, we make sure you
            always look and feel your best.
          </p>

          <h2 className="about-subtitle">Why Choose Us?</h2>
          <ul className="about-list">
            At EStylist, we offer expert-curated outfit recommendations tailored
            to your unique preferences. Our inclusive fashion choices cater to
            all body types and genders, ensuring that everyone finds something
            that suits them. Whether you're looking for the perfect outfit for a
            special occasion or something stylish for everyday wear, we provide
            seamless outfit selection through an easy-to-use interface, making
            fashion effortless and enjoyable.
          </ul>

          <h2 className="about-subtitle">Get in Touch</h2>
          <p className="about-text">
            Have questions or suggestions? Reach out to us at
            <span className="about-contact"> contactestylist@gmail.com</span>.
          </p>
        </div>
      </div>
    </>
  );
}
