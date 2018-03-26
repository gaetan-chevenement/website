import { h }                      from 'preact';
import { PureComponent }          from 'react';
import autobind                   from 'autobind-decorator';
import { Link }                   from 'preact-router';
import map                        from 'lodash/map';
import { SearchResultsOptions }   from '~/content';
import Carousel                   from '~/components/Carousel';
import style                      from './style.css';

const _ = { map };

// TODO: get rid of this
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
const DAYS_COUNT_FOR_NEW = 10;
const { pictos, bedNames } = SearchResultsOptions;

function isNew(createdAt) {
  let oneDay = 24 * 60 * 60 * 1000;
  let diffDays = Math.round(
    Math.abs((Date.now() - new Date(createdAt)) / oneDay),
  );
  return diffDays > DAYS_COUNT_FOR_NEW;
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

function Availability({ availableAt }) {
  if ( availableAt === null ) {
    return (
      <div class={`${style.availability} ${style.unavailable}`}>
        Non disponible
      </div>
    );
  }
  else if ( +availableAt > +Date.now() ) {
    return (
      <div class={`${style.availability} ${style.availableSoon}`}>
        Dispo. le {availableAt.getDate()} {MONTHS[availableAt.getMonth()]}
      </div>
    );
  }

  return (
    <div class={`${style.availability} ${style.available}`}>
      Dispo. immédiate
    </div>
  );
}

export default class Room extends PureComponent {
  @autobind
  renderCarousel() {
    return (
      <Carousel lazy slide arrows className={style.roomCarousel}>
        {_.map(this.props.room.galery, (url) => (
          <div className={style.roomPic} style={{ backgroundImage: `url(${url})` }} />
        ))}
      </Carousel>
    );
  }

  render() {
    const {
      lang,
      room: {
        availableAt,
        basePrice,
        beds,
        name,
        floorArea,
        createdAt,
        id,
        roomCount,
      },
      isThumbnail,
    } = this.props;

    const newElement = isNew(createdAt) ?
      null :
      <div className={style.isNew}>NEW</div>;
    const { bedIcons, bedText } = getBedsDetails(beds);
    let mainClasses = [style.room];

    if (isThumbnail) {
      mainClasses.push(style['is-thumbnail']);
    }

    return (
      <Link
        className={mainClasses.join(' ')}
        href={`/${lang}/room/${id}`}
      >
        {this.renderCarousel()}
        <div className={style.roomAttributes}>
          <h4 className={style.roomName}>
            {name}
          </h4>
          <Availability availableAt={availableAt} />
          {newElement}
          <div className={style.price}>
            {basePrice / 100}€/mois
          </div>
          <div className={style.roomAttributesIcons}>
            <div className={`${style.roomAttributesIcon} ${style.chambersCount}`}>
              {roomCount} {isThumbnail ? '' : 'chambres'}
            </div>
            <div className={`${style.roomAttributesIcon} ${style.roomsCount}`}>
              {roomCount + 2} {isThumbnail ? '' : 'pièces'}
            </div>
            <div className={`${style.roomAttributesIcon} ${style.roomSize}`}>
              {floorArea} m²
            </div>
            <div className={`${style.roomAttributesIcon} ${style.roomBedText}`}>
              {bedIcons} {isThumbnail ? '' : bedText}
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

// /!\ This component cannot used the state because it's used inside leaflet
// and apparently these things are incompatible.
