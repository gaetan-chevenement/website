import { IntlProvider, Text } from 'preact-i18n';
import Utils                  from '~/utils';
import _const                 from '~/const';
import style                  from './style';

const { SEARCHABLE_CITIES } = _const;

function Cities({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <section class={`grid-3-large-1 has-gutter ${style.towns}`}>
        {SEARCHABLE_CITIES
          .filter(({ image }) => Boolean(image))
          .map((town) => (
            <City
              lang={lang}
              name={town.name}
              roomsCount={town.roomsCount}
              image={town.image}
            />
          ))
        }
      </section>
    </IntlProvider>
  );
}

function City({ lang, name, roomsCount, image }) {
  return (
    <a
      href={`/${lang}/search/${name}`}
      className={style.town}
      style={{ backgroundImage: `url(${image})` }}
    >
      <h3>
        {' '}{name}{' '}
      </h3>
      <div>
        {' '}{roomsCount} <Text id="bedrooms">bedrooms</Text>{' '}
      </div>
    </a>
  );
}

const definition = {
  'fr-FR': {
    bedrooms: 'Chambres',
  },
  'es-ES': {
    bedrooms: 'Habitaciones',
  },
};

export default Utils.connectLang(Cities);
