
import { IntlProvider, Text } from 'preact-i18n';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '~/actions';
import Utils                  from '~/utils';
import style                  from '~/containers/room/style.css';

function Housemates({ lang, housemates }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <section>
        <h3 className={style.heading}>
          <Text id="title">HouseMates</Text>
        </h3>
        <div className={style.housemates}>
          {housemates.map((housemate, index) => (
            <Housemate {...{ housemate, lang, index }} />
          ))}
        </div>
      </section>
    </IntlProvider>
  );
}

function Housemate({ lang, housemate, index }) {
  const pictoGender = housemate.gender === 'male' ? 'homme' : 'femme';
  const pictoClass = `picto-colocataire_${pictoGender}_${(index % 5) + 1}_256px`;

  return (
    <div className={style.housemate}>
      <div className={style.housemateTitle}>
        <Text id="room">Room</Text>&nbsp;{index + 1}
      </div>
      {('availableAt' in housemate) ? (
        <div>
          <div className={`${style.availableRoom} picto-colocataire_disponible_256px`} />
          <Button raised primary href={`/${lang}/room/${housemate.roomId}`}>
            <Text id="booking">Book</Text>
          </Button>
        </div>
      ) : (
        <div>
          <div className={`${style.housemateIcon} ${pictoClass}`} />
          <div>{housemate.description || housemate.firstName}</div>
        </div>
      )}
    </div>
  );
}

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
