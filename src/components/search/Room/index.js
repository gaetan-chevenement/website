import map                        from 'lodash/map';
import { Link }                   from 'preact-router';
import { IntlProvider, Text }     from 'preact-i18n';
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
const bedNames = {
  double: 'Double couchage',
  simple: 'Lit simple',
  sofa: 'Canapé lit',
  multiple: '{n} couchages',
};

function Room() {
  const {
    lang,
    room: {
      availableAt,
      _currentPrice,
      beds,
      name,
      floorArea,
      createdAt,
      id,
      roomCount,
      galery,
    },
    isThumbnail,
  } = this.props;
  const { bedIcons, bedText } = getBedsDetails(beds);
  const classes = {
    common: style.availability,
    unavailable: style.unavailable,
    availableFrom: style.availableSoon,
    availableNow: style.available,
  };

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
            {name}
          </h4>
          <Availability availableAt={availableAt} classes={classes} />
          { /* NEW should not be translated */ }
          {!Utils.isNew(createdAt) ? <div className={style.isNew}>NEW</div> : ''}
          <div className={style.price}>
            {_currentPrice / 100}€/<Text id="month">month</Text>
          </div>
          <div className={style.roomAttributesIcons}>
            <div className={`${style.roomAttributesIcon} ${style.chambersCount}`}>
              {roomCount} {!isThumbnail ? <Text id="bedroom">Bedrooms</Text> : ''}
            </div>
            <div className={`${style.roomAttributesIcon} ${style.roomsCount}`}>
              {roomCount + 2} {!isThumbnail ? <Text id="room">Rooms</Text> : ''}
            </div>
            <div className={`${style.roomAttributesIcon} ${style.roomSize}`}>
              {floorArea} m²
            </div>
            <div className={`${style.roomAttributesIcon} ${style.roomBedText}`}>
              {bedIcons} {!isThumbnail ? bedText : ''}
            </div>
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
    bedText = (
      <span>
        {bedsList.length > 1 ?
          bedNames.multiple.replace('{n}', bedsList.length):
          bedNames[bedsList[0]]}
      </span>
    );
  }

  return { bedText, bedIcons };
}

const definition = { 'fr-FR': {
month: 'Mois',
bedroom : 'Chambre',
room : 'Pièce',
} };

// /!\ This component cannot used the state because it's used inside leaflet
// and apparently these things are incompatible.
export default Room;
