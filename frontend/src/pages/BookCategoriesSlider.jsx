import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import '../assets/styling/slider.scss';
import pic4 from '../assets/images/facsy.png'; // Import your image here

const BookCategoriesSlider = () => {
  const categories = [
    {
      title: 'Mystery & Thrillers',
      description: 'Dive into suspenseful plots and unexpected twists that keep you on the edge of your seat.',
      img: pic4, // Directly reference the imported image
    },
    {
      title: 'Romance',
      description: 'Experience heartwarming tales of love and connection that will sweep you off your feet.',
      img: pic4, // Use the same image or import others for variety
    },
    {
      title: 'Science Fiction',
      description: 'Explore imaginative worlds and futuristic adventures that challenge reality and ignite curiosity.',
      img: pic4, // Use the same image or import others for variety
    },
    {
      title: 'Non-Fiction',
      description: 'Gain insights and knowledge through captivating stories based on real events and experiences.',
      img: pic4, // Use the same image or import others for variety
    },
  ];

  return (
    <section className='book-categories-slide'>
      <h1>
        Find Your Favorite Genre
        <br />
        Whether you love fiction or non-fiction, our categories are designed to help you find your next favorite book!
      </h1>
      <Swiper
          spaceBetween={30}
          slidesPerView={2} // Adjust based on your design
          navigation
          pagination={{ clickable: true }}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <div className="category-card">
              <img src={category.img} alt={category.title} />
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BookCategoriesSlider;