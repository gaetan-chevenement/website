
import { IntlProvider, Text } from 'preact-i18n';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '~/actions';
import Utils                  from '~/utils';
import style                  from '~/containers/room/style.css';

function Housemates({ lang, housemates, roomId }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <section>
        <h3 className={style.heading}>
          <Text id="title">HouseMates</Text>
        </h3>
        <div className={style.housemates}>
          {housemates.map((housemate, index) => (
            <Housemate {...{ lang, housemate, roomId, index }} />
          ))}
        </div>
      </section>
    </IntlProvider>
  );
}

function Housemate({ lang, housemate, roomId, index }) {
  const pictoClass =
    `picto-colocataire_${housemate.gender || 'booked'}_${(index % 5) + 1}_256px`;

  return (
    <div className={style.housemate}>
      <div className={style.housemateTitle}>
        <Text id="bedroom">Bedroom</Text>&nbsp;{housemate.roomNumber}
      </div>
      {('availableAt' in housemate) ? (
        <div>
          <div className={`${style.availableRoom} picto-colocataire_disponible_256px`} />
          { housemate.roomId !== roomId ? (
            <Button raised primary href={`/${lang}/room/${housemate.roomId}`}>
              <Text id="view">view</Text>
            </Button>
          ) : (
            <Text id="available">Available</Text>
          ) }
        </div>
      ) : (
        <div>
          <div className={`${style.housemateIcon} ${pictoClass}`} />
          <div>
            { housemate.description || (<Text id="booked">Booked</Text>) }
          </div>
        </div>
      )}
    </div>
  );
}

const definition = {
  'fr-FR': {
    title: 'Colocataires',
    available: 'Disponible',
    booked: 'Réservé',
    view: 'voir',
    bedroom: 'Chambre',
  },
  'es-ES': {
    title: 'Compañeros de cuarto',
    available: 'Disponible',
    booked: 'Reservado',
    view: 'decir',
    bedroom: 'Habitación',
  },
};

function mapStateToProps({ route: { lang, roomId }, apartments, rooms }, { apartmentId }) {
  const apartment = apartments[apartmentId];
  const housemates = Utils.parseHouseMates(apartment.housemates, lang);

  return {
    lang,
    roomId,
    housemates,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Housemates);
