import { Component }          from 'preact';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import { Button }             from 'react-toolbox/lib/button';
import Portal                 from 'preact-portal';
import Carousel               from '~/components/Carousel';
import style                  from '~/containers/room/style.css';

class Header extends Component {
  @autobind
  handleScroll() {
    // This function will never get called server-side
    const $el = document.getElementById('bookBtn');
    if ( $el !== null ) {
      const maxPos = $el.offsetTop + window.innerHeight;
      const showBookBtn = document.documentElement.scrollTop > maxPos;
      if (this.state.showBookBtn !== showBookBtn) {
        this.setState({ showBookBtn });
      }
    }
  }

  @autobind
  toggleSlideshow() {
    this.setState({ showSlideshow: !this.state.showSlideshow });
  }

  constructor(props) {
    super(props);
    this.state = {
      showBookBtn: false,
      showSlideshow: false,
    };
  }

  componentDidMount() {
    typeof window !== 'undefined' &&
      window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    typeof window !== 'undefined' &&
      window.removeEventListener('scroll', this.handleScroll);
  }

  render({ lang, pictures, roomName, roomId }) {
    const localStyle = pictures.length ?
      { backgroundImage: `url(${pictures[0].url})` } :
      {};
    const btnState =  this.state.showBookBtn ?
      style.fixedHeaderShown :
      style.fixedHeaderHidden;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          {this.state.showSlideshow ? (
            <Portal into="body">
              <div className={style.carouselOverlay} onClick={this.toggleSlideshow}>
                <Carousel lazy slide arrows className="slideshow-full">
                  {pictures.map(({ url }) =>
                    <div className={style.slideshowImg} style={`background-image: url(${url})`} />
                  )}
                </Carousel>
              </div>
            </Portal>
          ) : ''}
          <div className={`${style.fixedHeader} ${btnState}`}>
            <Button href={`/${lang}/booking/${roomId}`}
              raised primary id="bookBtn" style="width: 100%"
            >
              Réserver ce logement
            </Button>
          </div>
          <section className={style.coverPicture} style={localStyle}>
            <div className={style.coverPictureRoomName}>{ roomName }</div>
            <Button className={style.allPicsBtn} onClick={this.toggleSlideshow}>
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
