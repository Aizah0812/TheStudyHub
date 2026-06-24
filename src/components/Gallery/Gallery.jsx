import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Gallery.css";

const images = [
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80",
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="gallery" id="gallery">
      {/* Header */}
      <div className="gallery-header">
        <h1>
          Explore Our <span>Library Space</span>
        </h1>

        <p>
          Take a look inside our modern self-study center designed for focus,
          comfort, and productivity.
        </p>
      </div>

      {/* Gallery */}
      <div className="gallery-carousel-section">
        {/* <div className="gallery-title-row">
          <h2>Library Gallery</h2>
          <span>Click any image to view full screen</span>
        </div> */}

        <div className="gallery-carousel">
          {images.map((image, index) => (
            <Motion.div
              className="carousel-card"
              key={index}
              whileHover={{ y: -8 }}
            >
              <img
                src={image}
                alt={`Library ${index + 1}`}
                onClick={() => setSelectedImage(image)}
              />
            </Motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="gallery-cta">
        <h2>Ready to Join Our Study Community?</h2>

        <p>
          Reserve your seat today and experience a calm, focused environment
          built for productivity and success.
        </p>

        <Link to="/admission" className="gallery-cta-btn">
          Reserve Your Seat
        </Link>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>

            <img src={selectedImage} alt="Library Preview" />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
