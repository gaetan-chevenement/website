import {
  SlideshowOptions,
}                           from '~/content';
import Carousel             from '~/components/Carousel';
import {
  carousel,
  image,
  searchEngineContainer,
}                           from './style.css';

export default function Slideshow({ children }) {
  return (
    <div>
      <Carousel autoplay autoplayInterval={7000} fade className={carousel}>
        {SlideshowOptions.images.map(imgUrl =>
          <div class={image} style={{ backgroundImage: `url(${imgUrl})` }} />,
        )}
      </Carousel>
      <div class={searchEngineContainer}>
        {children}
      </div>
    </div>
  );
}
