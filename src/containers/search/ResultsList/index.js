import { h }                  from 'preact';
import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { connect }            from 'react-redux';
import orderBy                from 'lodash/orderBy';
import { SearchOptions }      from '~/content';
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

  renderMessage() {
    const { title, content } = SearchOptions.texts.introduction;
    if (!this.state.openMessage) {
      return null;
    }

    return (
      <div className={message}>
        <h3>
          <span class={`material-icons ${closeButton}`} onClick={this.closeMessage}>
            close
          </span>
          { title(this.props.city) }
        </h3>
        <p>
          { content(this.props.city, this.props.arrRooms.length) }
        </p>
      </div>
    );
  }

  render() {
    const {
      lang,
      arrRooms,
      handleMouseOver,
      handleMouseOut,
    } = this.props;

    return (
      <div>
        {this.renderMessage()}
        <div class="grid-3 has-gutter">
          {arrRooms.map((room) => (
            <Room
              lang={lang}
              room={room}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ route: { lang }, rooms, apartments, search: { city } }) => ({
  lang,
  city,
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
