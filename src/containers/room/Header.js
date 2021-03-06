import { Component }          from 'preact';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import { Button }             from 'react-toolbox/lib/button';
import Portal                 from 'preact-portal';
import Carousel               from '~/components/Carousel';
import style                  from '~/containers/room/style.css';

// https://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome
function getDocumentScrollTop() {
  return typeof window !== 'object' ?
    0 :
    window.scrollY
    || window.pageYOffset
    || document.body.scrollTop + (document.documentElement
      && document.documentElement.scrollTop || 0);
}

class Header extends Component {
  @autobind
  handleScroll() {
    // This function will never get called server-side
    let $el = document.getElementById('bookBtn');
    if ( $el !== null ) {
      const maxPos = $el.offsetTop + window.innerHeight;
      const showBookBtn = getDocumentScrollTop() > maxPos;
      if (this.state.showBookBtn !== showBookBtn) {
        this.setState({ showBookBtn });
      }
    }
    $el = document.getElementById('room-anchors');
    if ( $el !== null ) {
      const maxPos = $el.offsetTop + window.innerHeight;
      const showLinks = getDocumentScrollTop() > maxPos;
      if (this.state.showLinks !== showLinks) {
        this.setState({ showLinks });
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
      libSpyScroll: null,
      showLinks: false,
    };

    if ( typeof window === 'object' ) {
      import('react-spy-scroll')
        .then(spyScroll => {
          this.setState({ libSpyScroll: spyScroll });

          return true;
        })
        .catch(() => console.error('leaflet loading failed'));
    }
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
    let AnchorLink = 'a';

    if ( this.state.libSpyScroll ) {
      AnchorLink = this.state.libSpyScroll.AnchorLink;
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          {this.state.showLinks ? (
            <div className={[style.links, style.fixedLinks].join(' ')}>
              <ul>
                <li>
                  <AnchorLink href="overview"><Text id="overview">Overview</Text></AnchorLink>
                </li>
                <li>
                  <AnchorLink href="housemates"><Text id="housemates">Housemates</Text></AnchorLink>
                </li>
                <li>
                  <AnchorLink href="location"><Text id="location">Location</Text></AnchorLink>
                </li>
              </ul>
            </div>
          ): null }
          {this.state.showSlideshow ? (
            <Portal into="body">
              <div className={style.carouselOverlay} onClick={this.toggleSlideshow}>
                <div className={style.carouselClose}>🗙</div>
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
              <Text id="book">Book this accomodation</Text>
            </Button>
          </div>
          <section className={style.coverPicture} style={localStyle}>
            <div className={style.coverPictureRoomName}>{ roomName }</div>
            <Button className={style.allPicsBtn} onClick={this.toggleSlideshow}>
              <Text id="galery">See all pictures</Text>
            </Button>
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    book: 'Réserver ce logement',
    galery: 'Voir toutes les photos',
  },
  'es-ES': {
    book: 'Reservar este alojamiento',
    galery: 'Ver todas las fotos',
  },
};

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const pictures = Utils.getPictures(room);

  return {
    lang,
    pictures,
    roomId,
    roomName: Utils.localizeRoomName(room.name, lang),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
