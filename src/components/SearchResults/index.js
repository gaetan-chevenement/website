import { Component } from 'preact';
import Room from './room.js';
import { SearchOptions } from '~/content';
import CSS from './style.css';

export default class SearchResults extends Component {
  closeMessage() {
    this.setState({
      openMessage: false,
    });
  }

  constructor() {
    super();
    this.state = {
      openMessage: true,
    };

    this.__closeMessage = this.closeMessage.bind(this);
  }

  renderMessage(roomsCount) {
    if (!this.state.openMessage) {
      return null;
    }

    return (
      <div className={CSS.message}>
        <h3>
          <span className={CSS.closeButton} onClick={this.__closeMessage}>
            x
          </span>
          {SearchOptions.texts.introduction.title.replace(
            '{{town}}',
            this.props.city,
          )}
        </h3>
        <p>
          {SearchOptions.texts.introduction.content
            .replace(/\{\{town\}\}/g, this.props.city)
            .replace('{{count}}', roomsCount)}
        </p>
      </div>
    );
  }

  render() {
    let { rooms, data } = this.props;
    return (
      <div>
        {this.renderMessage(rooms.length)}
        <div className={CSS.rooms}>
          {rooms.map(room =>
            <Room room={room} data={data} onOver={this.props.onRoomOver} />,
          )}
        </div>
      </div>
    );
  }
}
