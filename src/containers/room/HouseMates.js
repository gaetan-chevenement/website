import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Button }             from 'react-toolbox/lib/button';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import D                      from 'date-fns';
import * as actions           from '~/actions';

const _ = { capitalize };

import style from './style.css';

/*const MALE_ICONS_CLASSES = [
  'picto-colocataire_homme_1_256px',
  'picto-colocataire_homme_2_256px',
  'picto-colocataire_homme_3_256px',
  'picto-colocataire_homme_4_256px',
  'picto-colocataire_homme_5_256px',
];*/

const FEMALE_ICONS_CLASSES = [
  'picto-colocataire_femme_1_256px',
  'picto-colocataire_femme_2_256px',
  'picto-colocataire_femme_3_256px',
  'picto-colocataire_femme_4_256px',
  'picto-colocataire_femme_5_256px',
];

class HouseMates extends PureComponent {

  // TODO Missing gender prop
  renderHouseMate(houseMate, idx) {
    const { lang } = this.props;
    const _lang = _.capitalize(lang.split('-')[0]);

    let content = null;

    // TODO Remove this stub
    if (idx === 1) {
      houseMate.availableAt = Date.now();
    }

    if (houseMate.availableAt) {
      content = (
        <div>
          <div>
            <div className={[style.availableRoom, 'picto-colocataire_disponible_256px'].join(' ')} />
            <Text id="available">Available</Text>&nbsp;
            {D.differenceInDays(houseMate.availableAt, new Date()) === 0 ?
              lang === 'en-US' ? 'now' : 'immédiatement' :
              lang === 'en-US' ? `at ${D.format(houseMate.availableAt, 'DD/MM/YYYY')}`: `le ${D.format(houseMate.availableAt, 'DD/MM/YYYY')}`}
          </div>
          <Button raised primary
            label={<Text id="book">Book</Text>}
            href={`/${lang}/room/${houseMate.roomId}`}
          />
        </div>
      );
    }
    else {
      content = (
        <div>
          <div className={[style.housemateIcon, FEMALE_ICONS_CLASSES[idx % 5]] . join(' ')} />
          <div>{houseMate.client[`description${_lang}`] ? houseMate.client[`description${_lang}`] : houseMate.client.name}</div>
        </div>
      );
    }
    return (
      <div className={style.housemate}>
        <div className={style.housemateTitle}>
          <Text id="room">Room</Text>&nbsp;
          {houseMate.name.split('-')[1].trim().split(' ')[1]}
        </div>
        {content}
      </div>
    );
  }
  render() {
    const {
      lang,
      roomId,
      HouseMates,
    } = this.props;
    if ( !HouseMates ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h3 className={style.heading}><Text id="title">HouseMates</Text></h3>
          <div class="grid-6 has-gutter">
            {HouseMates.filter((data) => data.roomId !== roomId).map((houseMate, idx) => (
              this.renderHouseMate(houseMate, idx)
            ))}
          </div>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Colocataires',
  available: 'Disponible',
  book: 'Résever',
  room: 'Chambre',
} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const apartment = apartments[apartmentId];

  return {
    lang,
    roomId,
    HouseMates: apartment && apartment.HouseMates,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseMates);
