import { IntlProvider, Text } from 'preact-i18n';
import Slideshow              from '~/components/home/Slideshow';
import Cities                 from '~/components/home/Cities';
import Services               from '~/components/home/Services';
import Testimonies            from '~/components/home/Testimonies';
import Guide                  from '~/components/home/Guide';
import SearchForm             from '~/components/SearchForm';
import style                  from './style.css';

export default function Home({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div class="home">
        <Slideshow>
          <div className={style.searchEngine}>
            <h1>
              <Text id="search.title">Your ready-to-live-in flatshares</Text>
            </h1>
            <h3>
              <Text id="search.subtitle">
                Find today your furnished, fully equipped, all-inclusive flatshare,
                in the heart of the city-centre.
              </Text>
            </h3>
            <SearchForm />
          </div>
        </Slideshow>
        <div class="content">
          <h2 class="text-center">
            <Text id="cities">Discover the cities with Chez Nestor</Text>
          </h2>
          <Cities />
        </div>
        <div>
          <h2 class="text-center">
            <Text id="services">A new way of flatsharing</Text>
          </h2>
          <Services />
        </div>
        <div style="background: #E1E1E1; padding: 1px 0;">
          <div class="content">
            <h2 class="text-center">
              <Text id="testimonies">Our housemates suggest you</Text>
            </h2>
            <Testimonies />
          </div>
        </div>
        <div class="content">
          <Guide />
        </div>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  search: {
    title: 'Votre colocation prête à vivre',
    subtitle: 'Trouvez aujourd'\'hui votre colocation meublée, équipée,
                tout inclus, en plein centre.',
  },
  cities: 'Découvrez les villes Chez Nestor'
  services: 'Une nouvelle expérience de la colocation'
  testimonies: 'Nos colocataires nous recommandent',
} };
