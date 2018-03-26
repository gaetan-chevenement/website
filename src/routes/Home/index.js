import { connect }      from 'react-redux';
import Slideshow        from '~/components/home/Slideshow';
import Towns            from '~/containers/home/Towns';
import Services         from '~/components/home/Services';
import Testimonies      from '~/components/home/Testimonies';
import Guide            from '~/components/home/Guide';
import SearchForm       from '~/components/SearchForm';
import style            from './style.css';

function Home({ lang }) {
  return (
    <div class="home">
      <Slideshow>
        <div className={style.searchEngine}>
          <h1>
            Votre colocation prête à vivre
          </h1>
          <h3 className>
            Trouvez aujourd'hui votre colocation meublée, équipée, tout inclus,
            en plein centre.
          </h3>
          <SearchForm lang={lang} />
        </div>
      </Slideshow>
      <div class="content">
        <h2 class="text-center">
          {' '}Découvrez les villes Chez Nestor{' '}
        </h2>
        <Towns />
      </div>
      <div>
        <h2 class="text-center">
          {' '}Une nouvelle expérience de la colocation{' '}
        </h2>
        <Services lang={lang} />
      </div>
      <div style="background: #E1E1E1; padding: 1px 0;">
        <div class="content">
          <h2 class="text-center">
            {' '}Nos colocataires nous recommandent{' '}
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

const mapStateToProps = ({ route: { lang } }) => ({
  lang,
});

export default connect(mapStateToProps)(Home);
