import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import * as actions           from '~/actions';

import style from './style.css';

class Header extends PureComponent {
  render() {
    const {
      lang,
      pictures,
      roomName
    } = this.props;

    if ( pictures.length === 0 ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    const localStyle = {
      backgroundImage: `url(${pictures[0].url})`,
    };

    return (
      <IntlProvider definition={definition[lang]}>
        <section className={style.coverPicture} style={localStyle}>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
    title: 'Photos',
} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];
  const pictures = [].concat(...[
    (room && room.Pictures || []),
    (apartment && apartment.Pictures || []).filter(({ alt }) => alt !== 'floorPlan'),
  ].map((pics) => pics.sort((a, b) => a.order - b.order)));

  return {
    lang,
    pictures,
    roomName: room.name,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
