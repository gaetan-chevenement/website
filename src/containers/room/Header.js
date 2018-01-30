import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider }       from 'preact-i18n';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import { Button }             from 'react-toolbox/lib/button';
import Portal                 from 'preact-portal';
import Carousel               from '~/components/Carousel';

import style from '~/containers/room/style.css';
import { Component } from 'preact';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showBookBtn: false,
      showSlideshow: false
    };
    this._handleScroll = this.handleScroll.bind(this);
    this._toggleSlideshow = () => this.setState({showSlideshow: !this.state.showSlideshow});
  }

  componentDidMount() {
    window.addEventListener('scroll', this._handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll);
  }

  handleScroll() {
    const $el = document.getElementById('bookBtn');
    if ($el !== null) {
      const maxPos = $el.offsetTop + window.innerHeight;
      const showBookBtn = document.documentElement.scrollTop > maxPos;
      if (this.state.showBookBtn !== showBookBtn) {
        this.setState({ showBookBtn });
      }
    }
  }

  render() {
    const { lang, pictures, roomName, roomId } = this.props;
    const localStyle = {
      backgroundImage: `url(${pictures[0].url})`,
    };
    const btnState =  this.state.showBookBtn ? style.fixedHeaderShown : style.fixedHeaderHidden;

    let portal = null;
    if (this.state.showSlideshow) {
      portal = (
        <Portal into="body">
          <div className={style.carouselOverlay} onClick={this._toggleSlideshow}>
            <Carousel lazy slide arrows className={style.coverPicture}>
              {pictures.map(({ url }) => <img src={url} />)}
            </Carousel>
          </div>
        </Portal>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          {portal}
          <div className={[style.fixedHeader, btnState].join(' ')}>
            <Button className={style.bookThisRoom} href={`/${lang}/booking/${roomId}`}>
              Réserver ce logement
            </Button>
          </div>
          <section className={style.coverPicture} style={localStyle}>
            <div className={style.coverPictureRoomName}>{ roomName }</div>
            <Button className={style.allPicsBtn} onClick={this._toggleSlideshow}>
              Voir toutes les photos
            </Button>
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Photos',
} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const pictures = Utils.getPictures(room);

  return {
    lang,
    pictures,
    roomId,
    roomName: room.name,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
