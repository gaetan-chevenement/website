import Carousel             from '~/components/Carousel';
import {
  carousel,
  image,
  searchEngineContainer,
}                           from './style.css';

export default function Slideshow({ children }) {
  return (
    <div>
      <Carousel lazy autoplay autoplayInterval={4000} fade className={carousel}>
        {Array.from(Array(7)).map((val, i) => (
          <div
            class={image}
            style={{ backgroundImage: `url(/assets/home/gallery/home-gallery-${i+1}-o.jpg)` }}
          />
        ))}
      </Carousel>
      <div class={searchEngineContainer}>
        {children}
      </div>
    </div>
  );
}
