import { h }                  from 'preact';
import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { connect }            from 'react-redux';
import { SearchOptions }      from '~/content';
import Utils                  from '~/utils';
import Room                   from '~/containers/search/Room';
import {
  message,
  closeButton,
  roomsWrapper,
}                             from './style.css';

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
          <span class={`material-icons ${closeButton}`} onClick={this.closeMessage}>
            close
          </span>
          { title(this.props.city) }
        </h3>
        <p>
          { content(this.props.city, this.props.rooms.length) }
        </p>
      </div>
    );
  }

  @autobind
  renderRoom(room) {
    return (
      <Room
        lang={this.props.lang}
        room={room}
        onMouseOver={this.props.handleMouseOver}
        onMouseOut={this.props.handleMouseOut}
      />
    );
  }

  render() {
    return (
      <div>
        {this.renderMessage()}
        <div class="grid-3 has-gutter">
          {this.props.rooms.map(this.renderRoom)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ route: { lang }, rooms, search: { city } }) => ({
  lang,
  city,
  rooms: Utils.filterMatchingRooms(rooms),
});

export default connect(mapStateToProps)(SearchResults);
