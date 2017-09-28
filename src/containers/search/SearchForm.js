import { PureComponent }      from 'preact';
import autobind               from 'autobind-decorator';
import { connect }            from 'react-redux';

import { listRooms }          from '~/actions';
import SearchEngineForm       from '~/components/SearchEngineForm';
import SameSearchCount        from '~/components/SameSearchCount';
import SearchResults          from '~/components/SearchResults';
import ResultsMap             from '~/components/ResultsMap';
import {
  SameSearchCountOptions,
}                             from '~/content';
import {
  CreateAlertButton,
}                             from '~/components/CreateAlertButton';
import {
  mapPane,
  leftPane,
  searchEngineAndAlerts,
  switchMapList,
  mobileHide,
  selected,
  viewport,
  mobileShow,
}                             from './theme.css';

export class SearchContainer extends PureComponent {
  @autobind
  onRoomOver(room) {
    this.setState({ overRoom: room });
  }

  @autobind
  switchToList() {
    this.setState({ mobilePane: 'list' });
  }

  @autobind
  switchToMap() {
    this.setState({ mobilePane: 'map' });
  }

  getUsersCount() {
    const { min, max } = SameSearchCountOptions;
    return min + Math.ceil((max - min) * Math.random());
  }

  constructor( ...args ) {
    super( args );

    this.state = {
      overRoom: null,
      sameSearchCounter: this.getUsersCount(),
      mobilePane: 'list',
    };
  }

  componentDidMount() {
    this.props.dispatch(listRooms({ city: this.props.city }));
  }

  componentWillReceiveProps({ city }) {
    if (this.props.city !== city) {
      this.props.dispatch(listRooms({ city }));
      this.setState({
        sameSearchCounter: this.getUsersCount(),
      });
    }
  }

  render() {
    const { rooms } = this.props;
    let data = [];

    let searchResultsContent = <div>...</div>;

    if (!rooms.loading && rooms.error !== null) {
      searchResultsContent = <div>Une erreur a eu lieu</div>;
    }
    if (!rooms.loading && rooms.error === null) {
      data = rooms.data.data;
      searchResultsContent = (
        <SearchResults
          rooms={data}
          data={rooms.data}
          city={this.props.city}
          onRoomOver={this.__onRoomOver}
        />
      );
    }

    return (
      <div className={viewport}>
        <div
          className={this.state.mobilePane !== 'map' ? mobileHide : mobileShow}
        >
          <div className={mapPane}>
            <ResultsMap
              rooms={data}
              data={rooms.data}
              highlightRoom={this.state.overRoom}
              currentlyShowing={this.state.mobilePane}
            />
          </div>
        </div>
        <div
          className={this.state.mobilePane !== 'list' ? mobileHide : mobileShow}
        >
          <div className={leftPane}>
            <div className={searchEngineAndAlerts}>
              <SearchEngineForm mode="small" defaultCity={this.props.city} />
              <CreateAlertButton />
            </div>
            <SameSearchCount count={this.state.sameSearchCounter} />
            {searchResultsContent}
          </div>
        </div>
        <div className={switchMapList}>
          <span
            onClick={this.__switchToList}
            className={this.state.mobilePane === 'list' ? selected : null}
          >
            Liste
          </span>
          <span
            onClick={this.__switchToMap}
            className={this.state.mobilePane === 'map' ? selected : null}
          >
            Plan
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.rooms,
});

export default connect(mapStateToProps)(SearchContainer);
