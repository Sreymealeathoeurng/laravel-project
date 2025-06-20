import React from 'react';
import './styling/carousel.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomCarousel = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      alt: "Writing workspace",
      caption: "Your Story Starts Here",
      description: "Powerful tools for authors of all genres",
      features: [
        "Genre-specific writing templates",
        "Real-time collaboration with editors",
        "AI-powered story development",
        "Chapter-by-chapter organization"
      ],
      genres: [
        { name: "Fantasy", icon: "🧙" },
        { name: "Sci-Fi", icon: "🚀" },
        { name: "Romance", icon: "💖" },
        { name: "Mystery", icon: "🕵️" }
      ],
      contact: {
        email: "support@storyforge.com",
        phone: "+1 (800) WRITE-NOW",
        hours: "24/7 Author Support"
      },
      cta: {
        text: "Begin Your Manuscript",
        link: "/writing-dashboard"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      alt: "Genre communities",
      caption: "Genre-Specific Communities",
      description: "Connect with writers and readers in your genre",
      stats: [
        { value: "50+", label: "Genre Groups" },
        { value: "10K+", label: "Active Members" },
        { value: "24/7", label: "Discussions" }
      ],
      popularGenres: [
        "Fantasy Writers Guild",
        "Sci-Fi Worldbuilders",
        "Romance Authors Network",
        "Mystery & Thriller Collective"
      ],
      contact: {
        email: "community@storyforge.com",
        phone: "+1 (800) GENRE-HQ",
        hours: "Always Open"
      },
      cta: {
        text: "Join Your Genre Community",
        link: "/genre-communities"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Genre writing guides",
      caption: "Genre Mastery Courses",
      description: "Learn the craft specific to your genre",
      courses: [
        "Worldbuilding for Fantasy",
        "Tech in Sci-Fi Writing",
        "Romantic Tension Development",
        "Plotting Mystery Novels"
      ],
      testimonials: [
        "The fantasy worldbuilding course transformed my writing!",
        "Finally understand how to write believable sci-fi tech",
        "My romance novels have improved dramatically"
      ],
      contact: {
        email: "academy@storyforge.com",
        phone: "+1 (800) LEARN-NOW",
        hours: "Mon-Fri: 9AM-6PM"
      },
      cta: {
        text: "Explore Genre Courses",
        link: "/genre-courses"
      }
    },
    {
      image: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      alt: "Genre book publishing",
      caption: "Genre-Targeted Publishing",
      description: "Get your book to the right readers",
      services: [
        "Genre-specific editing",
        "Market-appropriate cover design",
        "Genre-focused marketing",
        "Distribution to genre readers"
      ],
      publishingPackages: [
        { 
          name: "Fantasy", 
          includes: ["Map design", "Glossary formatting", "Series setup"] 
        },
        { 
          name: "Romance", 
          includes: ["Trope optimization", "Couple photography", "Series branding"] 
        }
      ],
      contact: {
        email: "publishing@storyforge.com",
        phone: "+1 (800) PUBLISH-NOW",
        hours: "Mon-Fri: 10AM-5PM"
      },
      cta: {
        text: "Publish Your Genre Masterpiece",
        link: "/genre-publishing"
      }
    }
  ];

  return (
    <div id="bookCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#bookCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
      
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
            <img 
              src={slide.image} 
              className="d-block w-100 carousel-image" 
              alt={slide.alt}
            />
            <div className="carousel-caption">
              <div className="content-wrapper">
                <h2>{slide.caption}</h2>
                <p className="lead">{slide.description}</p>
                
                <div className="additional-content">
                  {slide.features && (
                    <div className="features">
                      <h4>Key Features:</h4>
                      <ul>
                        {slide.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {slide.stats && (
                    <div className="stats">
                      <div className="stats-grid">
                        {slide.stats.map((stat, i) => (
                          <div key={i} className="stat-item">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {slide.courses && (
                    <div className="courses">
                      <h4>Popular Courses:</h4>
                      <ul>
                        {slide.courses.map((course, i) => (
                          <li key={i}>{course}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {slide.services && (
                    <div className="services">
                      <h4>Our Services:</h4>
                      <ul>
                        {slide.services.map((service, i) => (
                          <li key={i}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="contact-section">
                  <div className="contact-info">
                    <h4>Contact Us:</h4>
                    <div className="contact-item">
                      <i className="bi bi-envelope"></i>
                      <span>{slide.contact.email}</span>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-telephone"></i>
                      <span>{slide.contact.phone}</span>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-clock"></i>
                      <span>{slide.contact.hours}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="cta-button"
                    onClick={() => window.location.href = slide.cta.link}
                  >
                    {slide.cta.text} <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <section className="control-btn">
        <button className="carousel-control-prev" type="button" data-bs-target="#bookCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#bookCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </section>
    </div>
  );
};

export default CustomCarousel;