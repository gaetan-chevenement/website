import { Component }          from 'react';
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

class Pictures extends Component {

  constructor() {
    super();
    this.state = {
      showSlideshow: false,
    };
    this.__onContClicked = () => this.setState({
      showSlideshow: !this.state.showSlideshow,
    });
  }

  renderPicture({ url, alt, order }, onClick) {

  }
  render() {
    const {
      lang,
      pictures,
    } = this.props;

    let cont = null, portal = null;

    if (pictures.length > 5) {
      cont = (
        <div className={[style.picturesCont, 'picto-photocamera_64px', 'one-sixth'].join(' ')}
          onClick={this.__onContClicked}
        >
          + {pictures.length - 5}
        </div>
      );
    }

    if (this.state.showSlideshow) {
      portal = (
        <Portal into="body">
          <div className={style.carouselOverlay} onClick={this.__onContClicked}>
            <Carousel lazy slide arrows className={style.coverPicture}>
              {pictures.map(({ url }) => <img src={url} />)}
            </Carousel>
          </div>
        </Portal>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section className={[style.pictures, 'grid-12', 'has-gutter'].join(' ')}>
          {pictures.slice(0, 5).map((picture) => (
            <Picture picture={picture} onClick={this.__onContClicked} />
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
  const pictures = [].concat(Utils.getPictures(room), Utils.getPictures(apartment));

  return {
    lang,
    pictures,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
