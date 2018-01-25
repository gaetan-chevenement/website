import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider } from 'preact-i18n';
import * as actions           from '~/actions';

import style from '~/containers/room/style.css';

const Header = ({ lang, pictures, roomName }) => {
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
      <section className={style.coverPicture} style={localStyle} />
    </IntlProvider>
  );
};

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
