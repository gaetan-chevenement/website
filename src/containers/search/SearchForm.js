import { h }                  from 'preact';
import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { connect }            from 'react-redux';

import { listRooms }          from '~/actions';
import SearchEngineForm       from '~/components/SearchEngineForm';
import SameSearchCount        from '~/components/SameSearchCount';
import SearchResults          from '~/containers/search/ResultsList';
import ResultsMap             from '~/containers/search/ResultsMap';
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

  componentWillMount() {
    this.props.dispatch(listRooms({ city: this.props.city }));
  }

  // componentWillReceiveProps({ city }) {
  //   if (this.props.city !== city) {
  //     this.props.dispatch(listRooms({ city }));
  //     this.setState({
  //       sameSearchCounter: this.getUsersCount(),
  //     });
  //   }
  // }

  render() {
    const { rooms, city } = this.props;
    let searchResultsContent = <div>...</div>;

    if (!rooms.isLoading && rooms.error !== false) {
      searchResultsContent = <div>Une erreur a eu lieu</div>;
    }
    if (!rooms.isLoading && rooms.error === false) {
      searchResultsContent = (
        <SearchResults onRoomOver={this.onRoomOver} />
      );
    }

    return (
      <div className={viewport}>
        <div
          className={this.state.mobilePane !== 'map' ? mobileHide : mobileShow}
        >
          <div className={mapPane}>
            <ResultsMap
              highlightedRoomId={this.state.overRoom}
              currentlyShowing={this.state.mobilePane}
            />
          </div>
        </div>
        <div
          className={this.state.mobilePane !== 'list' ? mobileHide : mobileShow}
        >
          <div className={leftPane}>
            <div className={searchEngineAndAlerts}>
              <SearchEngineForm mode="small" defaultCity={city} />
              <CreateAlertButton />
            </div>
            <SameSearchCount count={this.state.sameSearchCounter} />
            {searchResultsContent}
          </div>
        </div>
        <div className={switchMapList}>
          <span
            onClick={this.switchToList}
            className={this.state.mobilePane === 'list' ? selected : null}
          >
            Liste
          </span>
          <span
            onClick={this.switchToMap}
            className={this.state.mobilePane === 'map' ? selected : null}
          >
            Plan
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ rooms, route: { lang } }, { city }) => ({
  lang,
  city,
  rooms,
});

export default connect(mapStateToProps)(SearchContainer);
