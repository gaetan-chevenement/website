
import { IntlProvider, Text } from 'preact-i18n';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

import style from '~/containers/room/style.css';

const ICONS = {
  male: [
    'picto-colocataire_homme_1_256px',
    'picto-colocataire_homme_2_256px',
    'picto-colocataire_homme_3_256px',
    'picto-colocataire_homme_4_256px',
    'picto-colocataire_homme_5_256px',
  ],
  female: [
    'picto-colocataire_femme_1_256px',
    'picto-colocataire_femme_2_256px',
    'picto-colocataire_femme_3_256px',
    'picto-colocataire_femme_4_256px',
    'picto-colocataire_femme_5_256px',
  ],
};

const Housemate = ({ housemate, index, lang }) => {
  let content;

  if ('availableAt' in housemate) {
    content = (
      <div>
        <div className={`${style.availableRoom} picto-colocataire_disponible_256px`} />
        <Button raised primary href={`/${lang}/room/${housemate.roomId}`}>
          Book
        </Button>
      </div>
    );
  }
  else {
    content = (
      <div>
        <div className={`${style.housemateIcon} ${ICONS[housemate.gender || 'female'][index % 5]}`} />
        <div>{housemate.description || housemate.firstName}</div>
      </div>
    );
  }
  return (
    <div className={style.housemate}>
      <div className={style.housemateTitle}>
        <Text id="room">Room</Text>&nbsp;{index + 1}
      </div>
      {content}
    </div>
  );
};

const Housemates = ({ lang, housemates }) => (
  <IntlProvider definition={definition[lang]}>
    <section>
      <h3 className={style.heading}>
        <Text id="title">HouseMates</Text>
      </h3>
      <div className={style.housemates}>
        {housemates.map((housemate, i) => (
          <Housemate index={i} housemate={housemate} />
        ))}
      </div>
    </section>
  </IntlProvider>
);

const definition = { 'fr-FR': {
  title: 'Colocataires',
  available: 'Disponible',
  book: 'Résever',
  room: 'Chambre',
} };

function mapStateToProps({ route: { lang }, apartments, rooms }, { apartmentId }) {
  const apartment = apartments[apartmentId];
  const housemates = Utils.parseHouseMates(apartment.housemates, lang);

  return {
    lang,
    housemates,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Housemates);
