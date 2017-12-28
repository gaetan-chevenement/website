import { IntlProvider }       from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import { bindActionCreators } from 'redux';
import { batch }              from 'redux-act';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import FeaturesDetails        from '~/containers/roomAdmin/FeaturesDetails';
import * as actions           from '~/actions';


class Room extends PureComponent {
  async loadData(roomId) {
    const { actions } = this.props;

    const { response: {
      data: [roomData],
      included: [apartmentData],
    } } = await actions.getRoom(roomId);
    const districtId = apartmentData.attributes._DistrictId;

    if ( roomData.id !== roomId ) {
      return route(window.location.pathname.replace(/[\w-]+$/, roomData.id));
    }

    // We need to fetch the district before we fetch its terms, otherwise
    // they're going to be lost
    await actions.getDistrict(districtId);

    return batch(
      actions.listTerms([roomId, apartmentData.id, districtId]),
      actions.listPictures([roomId, apartmentData.id]),
      actions.getHouseMates(apartmentData.id),
    );
  }

  componentWillMount() {
    const { roomId } = this.props;
    return this.loadData(roomId);
  }

  render() {
    const {
      lang,
      isLoading,
    } = this.props;

    if ( isLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content">
          <section>
            <FeaturesDetails />
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang, roomId }, apartments, rooms, districts }) {
  const room = rooms[roomId];
  const apartment = room && apartments[room.ApartmentId];
  const district = apartment && districts[apartment._DistrictId];

  if (
    !room || room.isLoading ||
    !apartment || apartment.isLoading ||
    !district || district.isLoading
  ) {
    return { isLoading: true };
  }

  return {
    lang,
    roomId,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
