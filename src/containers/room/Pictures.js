import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider }       from 'preact-i18n';
import Portal                 from 'preact-portal';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import Carousel               from '~/components/Carousel';

import style from './style.css';

const Picture = ({ picture, onClick }) => {
  const st = {
    backgroundImage: `url(${picture.url})`,
  };
  return (
    <div style={st} className={'one-sixth'} onClick={onClick}>
      {picture.alt}
    </div>
  );
};

class Pictures extends PureComponent {
  @autobind
  handleSlideshowClick() {
    this.setState({ showSlideshow: !this.state.showSlideshow });
  }

  @autobind
  handleFloorplansSlideshowClick() {
    this.setState({ showFloorplansSlideshow: !this.state.showFloorplansSlideshow });
  }

  constructor() {
    super();
    this.state = {
      showSlideshow: false,
      showFloorplansSlideshow: false,
    };
  }

  render({ lang, pictures, visitUrl, floorplans }) {
    let cont = null, portal = null, visit = null;

    if (pictures.length > 4) {
      cont = (
        <div className={`${style.picturesCont} picto-photocamera_64px one-sixth`}
          onClick={this.handleSlideshowClick}
        >
          + {pictures.length - 4}
        </div>
      );
    }

    if (this.state.showSlideshow) {
      portal = (
        <Portal into="body">
          <div className={style.carouselOverlay} onClick={this.handleSlideshowClick}>
            <div className={style.carouselClose}>🗙</div>
            <Carousel lazy slide arrows>
              {pictures.map(({ url }) => (
                <div class={style.slideshowImg} style={`background-image: url(${url})`} />
              ))}
            </Carousel>
          </div>
        </Portal>
      );
    }
    else if (this.state.showFloorplansSlideshow) {
      portal = (
        <Portal into="body">
          <div className={style.carouselOverlay} onClick={this.handleFloorplansSlideshowClick}>
            <div className={style.carouselClose}>🗙</div>
            <Carousel lazy slide arrows>
              {floorplans.map(({ url }) => (
                <div class={style.slideshowImg} style={`background-image: url(${url})`} />
              ))}
            </Carousel>
          </div>
        </Portal>
      );
    }

    if (visitUrl != null) {
      visit = (
        <div className={`${style.visitCont} one-sixth`}>
          <a href={visitUrl} target="_blank">
            3d visit
          </a>
        </div>
      );
    }
    else {
      visit = (
        <div className={`${style.visitCont} one-sixth`}
          onClick={this.handleFloorplansSlideshowClick}
        >
          Floor plans
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section className={`${style.pictures} grid-12 has-gutter`}>
          {pictures.slice(0, 4).map((picture) => (
            <Picture picture={picture} onClick={this.handleSlideshowClick} />
          ))}
          {cont}
          {visit}
          {portal}
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
  const pictures = []
    .concat(Utils.getPictures(room), Utils.getPictures(apartment))
    .filter(({ alt }) => alt !== 'floorplan');

  const visitUrl = apartment.visitUrl;
  const floorplans = []
    .concat(Utils.getPictures(room), Utils.getPictures(apartment))
    .filter(({ alt }) => alt === 'floorplan');

  return {
    visitUrl,
    floorplans,
    lang,
    pictures,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
