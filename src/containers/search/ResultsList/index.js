import { PureComponent }      from 'react';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { connect }            from 'react-redux';
import orderBy                from 'lodash/orderBy';
import Utils                  from '~/utils';
import Room                   from '~/components/search/Room';
import {
  message,
  closeButton,
}                             from './style.css';

const _ = { orderBy };

class ResultsList extends PureComponent {
  @autobind
  closeMessage() {
    this.setState({
      openMessage: false,
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      openMessage: true,
    };
  }

  render(args) {
    const {
      lang,
      city,
      arrRooms,
      handleMouseOver,
      handleMouseOut,
    } = args;
    const count = arrRooms.length;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          {this.state.openMessage ? (
            <div className={message}>
              <h3>
                <span class={`material-icons ${closeButton}`} onClick={this.closeMessage}>
                  🗙
                </span>
                <Text id="title" fields={{ city }}>{`Flat-share in ${city}`}</Text>
              </h3>
              <p>
                <Text id="content" fields={{ city, count }}>{`
                  Discover and compare our selection of ${count} shared rooms
                  in ${city}. All our apartments in ${city} are fully
                  furnished, equipped, all included and in the city center.
                  Book online or visit our apartments and just bring your
                  suitcase: for 1 month, 1 semester, 1 year… Renting a shared
                  apartment in ${city} has never been easier with Chez Nestor!
                `}</Text>
              </p>
            </div>
          ) : ''}
          <div class="grid-3 has-gutter">
            {arrRooms.map((room) => (
              <Room
                room={room}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              />
            ))}
          </div>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Colocations à {{city}}',
  content: `
    Découvrez et comparez notre sélection de {{count}} chambres en
    colocation à {{city}}. Tous nos logements à {{city}} sont
    entièrement meublés, équipé, tout inclus et en centre ville.
    Réservez en ligne ou visitez nos appartements et apportez
    juste votre valise : pour 1 mois, 1 semestre, 1 an...
    Louer une colocation à {{city}} n'a jamais été aussi simple avec
    Chez Nestor !
  `,
} };

const mapStateToProps = ({ route: { lang, city }, rooms, apartments }) => ({
  lang,
  city: city.replace(/ \d.*/, ''),
  arrRooms: _.orderBy(rooms, ['availableAt'])
    .filter((room) => typeof room === 'object')
    .map((room) => ({
      ...room,
      latLng: Utils.getApartmentLatLng(apartments[room.ApartmentId]),
      roomCount: apartments[room.ApartmentId].roomCount,
      pictures: [].concat(
        Utils.getPictures(room),
        Utils.getPictures(apartments[room.ApartmentId])
      ),
    })),
});

export default connect(mapStateToProps)(ResultsList);
