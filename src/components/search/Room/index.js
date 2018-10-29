import map                        from 'lodash/map';
import { Link }                   from 'preact-router';
import {
  IntlProvider,
  Text,
  Localizer,
}                                 from 'preact-i18n';
import Utils                      from '~/utils';
import Carousel                   from '~/components/Carousel';
import Availability               from '~/components/Availability';
import style                      from './style.css';

const _ = { map };
const pictos = {
  double: require('../../../assets/search/Picto description 4a.png'),
  simple: require('../../../assets/search/Picto description 4b.png'),
  sofa: require('../../../assets/search/Picto description 4c.png'),
};

function Room(args) {
  const {
    lang,
    arrivalDate,
    room: {
      availableAt,
      _currentPrice,
      beds,
      floorArea,
      createdAt,
      id,
      roomCount,
      galery,
      roomName,
    },
    isThumbnail,
  } = args;
  const { bedIcons, bedText } = getBedsDetails(beds);

  return (
    <IntlProvider definition={definition[lang]}>
      <Link
        className={`${style.room} ${isThumbnail ? style['is-thumbnail'] : ''}`}
        href={`/${lang}/room/${id}`}
      >
        <Carousel lazy slide arrows className={style.roomCarousel}>
          {_.map(galery, (url) => (
            <div className={style.roomPic} style={{ backgroundImage: `url(${url})` }} />
          ))}
        </Carousel>
        <div className={style.roomAttributes}>
          <h4 className={style.roomName}>
            {roomName}
          </h4>
          <Availability
            {...{ lang, arrivalDate, className: style.availability, availableAt }}
          />
          { /* NEW should not be translated */ }
          {!Utils.isNew(createdAt) ? <div className={style.isNew}>NEW</div> : ''}
          <div className={style.price}>
            {_currentPrice / 100}€ /m.
          </div>
          <div className={style.roomAttributesIcons}>
            <Localizer>
              <abbr className={`${style.roomAttributesIcon} ${style.chambersCount}`}
                title={<Text id="bedrooms">Bedrooms</Text>}
              >
                {roomCount}
              </abbr>
            </Localizer>
            <Localizer>
              <abbr className={`${style.roomAttributesIcon} ${style.roomsCount}`}
                title={<Text id="rooms">Rooms</Text>}
              >
                {roomCount + 2}
              </abbr>
            </Localizer>
            <Localizer>
              <span className={`${style.roomAttributesIcon} ${style.roomSize}`}>
                {floorArea} m²
              </span>
            </Localizer>
            <Localizer>
              <abbr className={`${style.roomAttributesIcon} ${style.roomBedText}`}
                title={bedText}
              >
                {bedIcons}
              </abbr>
            </Localizer>
          </div>
        </div>
      </Link>
    </IntlProvider>
  );
}

function getBedsDetails(beds) {
  let bedIcons = [];
  let bedText = null;
  const bedsList = beds !== null ? beds.split('+') : [];

  if (beds !== null && bedsList.length > 0) {
    bedIcons = bedsList.map((b) => (
      <img className={style.roomBedIcon} src={pictos[b]} />
    ));
    bedText = bedsList.length > 1 ? (
      <Text id="beds.multiple" fields={{ count: bedsList.length }} />
    ) : (
      <Text id={`beds.${bedsList[0]}`} />
    );
  }

  return { bedText, bedIcons };
}

const definition = {
  'fr-FR': {
    bedrooms: 'Chambres',
    rooms: 'Pièces',
    beds: {
      double: 'Lit double',
      simple: 'Lit simple',
      sofa: 'Canapé lit',
      multiple: '{{count}} couchages',
    },
  },
  'en-US': {
    beds: {
      double: 'Double bedding',
      simple: 'Single bed',
      sofa: 'Sofa',
      multiple: '{{count}} beddings',
    },
  },
  'es-ES': {
    bedrooms: 'Habitaciones',
    rooms: 'Cuartos',
    beds: {
      double: 'Cama doble',
      simple: 'Cama individual',
      sofa: 'Sofá cama',
      multiple: '{{count}} descanso',
    },
  },
};

// /!\ This component cannot use the state because it's used inside leaflet
// and apparently these things are incompatible.
export default Room;
