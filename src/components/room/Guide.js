import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button';
import _const                 from '~/const';
import Utils                  from '~/utils';
import style                  from './style.css';

const { HOUSING_GUIDE_URL } = _const;

function Guide({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div className={style.guide}>
        <div className="grid-2">
          <div className="one-half">
            <h2>
              <Text id="guide">Free accommodation guide</Text>
            </h2>
            <div className="grid-2">
              <ul className="one-half">
                <li className={style.guideBullet}>
                  <i className="picto-picto_guide_logement" />
                  <Text id="where">Find your accommodation</Text>
                </li>
                <li className={style.guideBullet}>
                  <i className="picto-picto_guide_logement" />
                  <Text id="agency">Agencies, residences...</Text>
                </li>
              </ul>
              <ul className="one-half">
                <li className={style.guideBullet}>
                  <i className="picto-picto_guide_logement" />
                  <Text id="traps">Traps to avoid</Text>
                </li>
                <li className={style.guideBullet}>
                  <i className="picto-picto_guide_logement" />
                  <Text id="fees">Costs to plan</Text>
                </li>
              </ul>
            </div>
            <div>
              <Button href={HOUSING_GUIDE_URL} target="_blank"
                raised
                icon="file_download"
                className={style.guideBtn}
              >
                <Text id="download">Get the accommodation guide</Text>
              </Button>
            </div>
          </div>
          <div className="one-half">
            <div className={style.guideImg} />
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  guide: 'Mon Guide logement offert',
  where: 'Où chercher son logement',
  agency: 'Agences, résidences…',
  traps: 'Les pièges à éviter',
  fees: 'Les frais à prévoir',
  download: 'Je télécharge mon Guide Logement',
} };

export default Utils.connectLang(Guide);
