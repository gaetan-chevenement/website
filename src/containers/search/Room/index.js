import { h }                      from 'preact';
import { PureComponent }          from 'react';
import { connect }                from 'react-redux';
import { SearchResultsOptions }   from '~/content';
import Carousel                   from '~/components/Carousel';
import style                      from './style.css';

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
  return [style.roomAttributesIcon, cssClass].join(' ');
}

function isNew(createdAt) {
  let oneDay = 24 * 60 * 60 * 1000;
  let diffDays = Math.round(
    Math.abs((Date.now() - new Date(createdAt)) / oneDay),
  );
  return diffDays > DAYS_COUNT_FOR_NEW;
}

function getBedsDetails(beds, bedNames, pictos) {
  let bedIcons = [];
  let bedText = null;
  const bedsList = beds !== null ? beds.split('+') : [];

  if (beds !== null && bedsList.length > 0) {
    bedIcons = bedsList.map(b =>
      <img className={style.roomBedIcon} src={pictos[b]} />,
    );
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

class Room extends PureComponent {
  renderAvailability() {
    const date = new Date(this.props.availableAt);

    if ( this.props.availableAt === null ) {
      return (
        <div class={`{style.availability} ${style.notAvailable}`}>
          Non disponible
        </div>
      );
    }
    else if ( +date > +Date.now() ) {
      return (
        <div class={`{style.availability} ${style.availableSoon}`}>
          Disponible le {date.getDate()} {MONTHS[date.getMonth()]}
        </div>
      );
    }

    return (
      <div class={`${style.availability} ${style.available}`}>
        Disponible immédiatement
      </div>
    );
  }

  renderCarousel() {
    // const { 'cover picture': coverPicture } = this.props.room;
    // const baseUrl = SearchResultsOptions.imagesBaseUrl;
    // let images = pictures.map((pic) => (
    //   <div
    //     className={style.image}
    //     onMouseOver={onOver}
    //     style={{
    //       backgroundImage: `url('${baseUrl}${pic.attributes.href}')`,
    //     }}
    //   />
    // ));

    return (
      <Carousel lazy slide className={style.coverPicture}>
        <img src="https://s3-eu-west-1.amazonaws.com/pictures.chez-nestor.com/10cf4563-4aa7-4347-8b43-f7ae6eec78fd" />
      </Carousel>
    );
  }

  render() {
    const {
      room: {
        basePrice,
        beds,
        name,
        floorArea,
        createdAt,
        id,
      },
      roomCount,
      fromMap,
    } = this.props;

    const { pictos, bedNames } = SearchResultsOptions;
    const newElement = isNew(createdAt) ?
      null :
      <div className={style.isNew}>NEW</div>;
    const { bedIcons, bedText } = getBedsDetails(beds, bedNames, pictos);
    let mainClasses = [style.room];

    if (!fromMap) {
      mainClasses.push(style.roomSplit);
    }

    return (
      <a
        className={mainClasses.join(' ')}
        href={`/fr/room/${id}`}
      >
        {this.renderCarousel()}
        <div className={style.roomAttributes}>
          <h4 className={style.roomName}>
            {name}
          </h4>
          {this.renderAvailability()}
          {newElement}
          <div className={style.price}>
            {basePrice / 100}€/mois
          </div>
          <div className={style.roomAttributesIcons}>
            <div className={getClassForRoomAttribute(style.chambersCount)}>
              {roomCount} {fromMap ? '' : 'chambres'}
            </div>
            <div className={getClassForRoomAttribute(style.roomsCount)}>
              {roomCount + 2} {fromMap ? '' : 'pièces'}
            </div>
            <div className={getClassForRoomAttribute(style.roomSize)}>
              {floorArea} m²
            </div>
            <div className={getClassForRoomAttribute(style.roomBedText)}>
              {bedIcons} {fromMap ? '' : bedText}
            </div>
          </div>
        </div>
      </a>
    );
  }
}

const mapStateToProps = ({ rooms, apartments, pictures }, { roomId }) => ({
  room: rooms[roomId],
  roomCount: apartments[rooms[roomId].ApartmentId].roomCount,
  pictures,
});

export default connect(mapStateToProps)(Room);
