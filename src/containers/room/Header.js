import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider }       from 'preact-i18n';
import Utils                  from '~/utils';
import * as actions           from '~/actions';

import style from '~/containers/room/style.css';

const Header = ({ lang, pictures, roomName }) => {
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
  const pictures = Utils.getPictures(room);

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
