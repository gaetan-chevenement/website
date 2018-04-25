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
  handleClick() {
    this.setState({ showSlideshow: !this.state.showSlideshow });
  }

  constructor() {
    super();
    this.state = {
      showSlideshow: false,
    };
  }

  render({ lang, pictures }) {
    let cont = null, portal = null;

    if (pictures.length > 5) {
      cont = (
        <div className={`${style.picturesCont} picto-photocamera_64px one-sixth`}
          onClick={this.handleClick}
        >
          + {pictures.length - 5}
        </div>
      );
    }

    if (this.state.showSlideshow) {
      portal = (
        <Portal into="body">
          <div className={style.carouselOverlay} onClick={this.handleClick}>
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

    return (
      <IntlProvider definition={definition[lang]}>
        <section className={`${style.pictures} grid-12 has-gutter`}>
          {pictures.slice(0, 5).map((picture) => (
            <Picture picture={picture} onClick={this.handleClick} />
          ))}
          {cont}
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

  return {
    lang,
    pictures,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
