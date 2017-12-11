import Slideshow        from '~/components/home/Slideshow';
import SearchEngine     from '~/components/SearchEngine';
import Towns            from '~/containers/home/Towns';
import Services         from '~/components/home/Services';
import Testimonies      from '~/components/home/Testimonies';
import Guide            from '~/components/home/Guide';
import {
  ContentTowns,
  ContentServices,
  ContentTestimonies,
}                       from '~/content.js';

export default function Home() {
  return (
    <div class="home">
      <Slideshow>
        <SearchEngine />
      </Slideshow>
      <div class="content">
        <h2 class="text-center">
          {' '}{ContentTowns.texts.title}{' '}
        </h2>
        <Towns />
      </div>
      <div>
        <h2 class="text-center">
          {' '}{ContentServices.texts.title}{' '}
        </h2>
        <Services />
      </div>
      <div style="background: #E1E1E1; padding: 1px 0;">
        <div class="content">
          <h2 class="text-center">
            {' '}{ContentTestimonies.texts.title}{' '}
          </h2>
          <Testimonies />
        </div>
      </div>
      <div class="content">
        <Guide />
      </div>
    </div>
  );
}
