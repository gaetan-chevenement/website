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
              <Text id="search.title">Votre colocation prête à vivre</Text>
            </h1>
            <h3>
              <Text id="search.subtitle">
                Trouvez aujourd'hui votre colocation meublée, équipée,
                tout inclus, en plein centre.
              </Text>
            </h3>
            <SearchForm />
          </div>
        </Slideshow>
        <div class="content">
          <h2 class="text-center">
            <Text id="cities">Découvrez les villes Chez Nestor</Text>
          </h2>
          <Cities />
        </div>
        <div>
          <h2 class="text-center">
            <Text id="services">Une nouvelle expérience de la colocation</Text>
          </h2>
          <Services />
        </div>
        <div style="background: #E1E1E1; padding: 1px 0;">
          <div class="content">
            <h2 class="text-center">
              <Text id="testimonies">Nos colocataires nous recommandent</Text>
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
    title: '',
    subtitle: '',
  },
} };
