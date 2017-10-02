import { h }                  from 'preact';
import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { connect }            from 'react-redux';
import map                    from 'lodash/map';
import { SearchOptions }      from '~/content';
import Utils                  from '~/utils';
import Room                   from '~/containers/search/Room';
import {
  message,
  closeButton,
  roomsWrapper,
}                             from './style.css';

const _ = { map };

class SearchResults extends PureComponent {
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
          <span className={closeButton} onClick={this.closeMessage}>
            x
          </span>
          { title(this.props.city) }
        </h3>
        <p>
          { content(this.props.city, Object.keys(this.props.rooms).length) }
        </p>
      </div>
    );
  }

  renderRooms() {
    return _.map(this.props.rooms, (room) => (
      <Room
        id={room.id}
        onMouseOver={this.props.handleMouseOver}
        onMouseOut={this.props.handleMouseOut}
      />
    ));
  }

  render() {
    return (
      <div>
        {this.renderMessage()}
        <div className={roomsWrapper}>
          {this.renderRooms()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ rooms }) => ({
  rooms: Utils.filterMatchingRooms(rooms),
});

export default connect(mapStateToProps)(SearchResults);
