import CSS from './style.css';
import { SearchResultsOptions } from '~/content';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import { listPictures } from '~/actions';

const DAYS_COUNT_FOR_NEW = 10;
const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

function getClassForRoomAttribute(cssClass) {
  return [CSS.roomAttributesIcon, cssClass].join(' ');
}

function isNew(createdAt) {
  let oneDay = 24 * 60 * 60 * 1000;
  let diffDays = Math.round(
    Math.abs((Date.now() - new Date(createdAt)) / oneDay),
  );
  return diffDays > DAYS_COUNT_FOR_NEW;
}

function getAvailabilityDiv(availableAt) {
  let availabilityEl = (
    <div className={[CSS.availability, CSS.available].join(' ')}>
      Disponible immédiatement
    </div>
  );
  const date = new Date(availableAt);

  if (availableAt === null) {
    availabilityEl = (
      <div className={[CSS.availability, CSS.notAvailable].join(' ')}>
        Non disponible
      </div>
    );
  }
  else if (+date > +Date.now()) {
    availabilityEl = (
      <div className={[CSS.availability, CSS.availableSoon].join(' ')}>
        Disponible le {date.getDate()} {MONTHS[date.getMonth()]}
      </div>
    );
  }

  return availabilityEl;
}

function getSlider(pictures, onOver) {
  const baseUrl = SearchResultsOptions.imagesBaseUrl;
  let images = pictures.map(pic =>
    (<div
      className={CSS.image}
      onMouseOver={onOver}
      style={{
        backgroundImage: `url('${baseUrl}${pic.attributes.href}')`,
      }}
    />),
  );

  return (
    <div>
      <Slider
        autoplay
        autoplaySpeed={3000}
        fade
        infinite
        className={CSS.coverPicture}
      >
        {images}
      </Slider>
    </div>
  );
}

function getBedsDetails(beds, bedNames, pictos) {
  let bedIcons = [];
  let bedText = null;
  const bedsList = beds !== null ? beds.split('+') : [];

  if (beds !== null && bedsList.length > 0) {
    bedIcons = bedsList.map(b =>
      <img className={CSS.roomBedIcon} src={pictos[b]} />,
    );
    bedText = (
      <span>
        {bedsList.length > 1
          ? bedNames.multiple.replace('{n}', bedsList.length)
          : bedNames[bedsList[0]]}
      </span>
    );
  }

  return { bedText, bedIcons };
}

function Room({ room, data, fromMap, onOver, dispatch, pictures }) {
  const {
    basePrice,
    beds,
    name,
    floorArea,
    createdAt,
    availableAt,
    id,
  } = room.attributes;

  let roomPictures = [
    {
      attributes: {
        href: room.attributes['cover picture'],
      },
    },
  ];

  if (pictures.data !== null && pictures.data[id] !== undefined) {
    roomPictures = pictures.data[id];
  }

  const aptId = room.relationships.Apartment.data.id;
  const apt = data.included.filter(i => i.id === aptId)[0];
  const { pictos, bedNames } = SearchResultsOptions;
  const newElement = isNew(createdAt)
    ? null
    : <div className={CSS.isNew}>NEW</div>;
  const availabilityEl = getAvailabilityDiv(availableAt);
  let picturesUrl = room.relationships.Pictures.links.related.href;

  const sliderImages = getSlider(roomPictures, () => {
    if (pictures.data === null || pictures.data[id] === undefined) {
      dispatch(listPictures({ roomId: id, picturesUrl }));
    }
  });
  const { bedIcons, bedText } = getBedsDetails(beds, bedNames, pictos);

  let mainClasses = [CSS.room];
  if (!fromMap) {
    mainClasses.push(CSS.roomSplit);
  }

  return (
    <a
      className={mainClasses.join(' ')}
      href={`/fr/room/${room.id}`}
      onMouseOver={() => onOver(room)}
      onMouseOut={() => onOver(null)}
    >
      {sliderImages}
      <div className={CSS.roomAttributes}>
        <h4 className={CSS.roomName}>
          {name}
        </h4>
        {availabilityEl}
        {newElement}
        <div className={CSS.price}>
          {basePrice / 100}€/mois
        </div>
        <div className={CSS.roomAttributesIcons}>
          <div className={getClassForRoomAttribute(CSS.chambersCount)}>
            {apt.attributes.roomCount} {fromMap ? '' : 'chambres'}
          </div>
          <div className={getClassForRoomAttribute(CSS.roomsCount)}>
            {apt.attributes.roomCount + 2} {fromMap ? '' : 'pièces'}
          </div>
          <div className={getClassForRoomAttribute(CSS.roomSize)}>
            {floorArea} m²
          </div>
          <div className={getClassForRoomAttribute(CSS.roomBedText)}>
            {bedIcons} {fromMap ? '' : bedText}
          </div>
        </div>
      </div>
    </a>
  );
}

const mapStateToProps = state => ({
  pictures: state.pictures,
});

export default connect(mapStateToProps)(Room);
