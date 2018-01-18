import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Button }             from 'react-toolbox/lib/button';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import D                      from 'date-fns';

const _ = { capitalize };

import style from '~/containers/room/style.css';

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

const HouseMate = ({ houseMate, idx, lang }) => {
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
          className={style.housemateBookBtn}
          label={'Book'}
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
};

const HouseMates = ({ lang, roomId, houseMates }) => {
  if ( !houseMates ) {
    return (
      <div class="content text-center">
        <ProgressBar type="circular" mode="indeterminate" />
      </div>
    );
  }

  return (
    <IntlProvider definition={definition[lang]}>
      <section>
        <h3 className={style.heading}>
          <Text id="title">HouseMates</Text>
        </h3>
        <div  className={style.housemates}>
          {houseMates.filter((data) => data.roomId !== roomId).map((houseMate, idx) => (
            <HouseMate idx={idx} houseMate={houseMate} lang={lang} />
          ))}
        </div>
      </section>
    </IntlProvider>
  );
};

const definition = { 'fr-FR': {
  title: 'Colocataires',
  available: 'Disponible',
  book: 'Résever',
  room: 'Chambre',
} };

export default HouseMates;
