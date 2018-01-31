import { Button }             from 'react-toolbox/lib/button';

import style from '~/containers/room/style.css';

const Guide = () => (
  <div className={style.guide}>
    <div className="grid-2">
      <div className="one-half">
        <h2>Guide logement gratuit</h2>
        <div className="grid-2">
          <ul className="one-half">
            <li className={style.guideBullet}>
              <i className="picto-picto_guide_logement" />
              Où chercher son logement
            </li>
            <li className={style.guideBullet}>
              <i className="picto-picto_guide_logement" />
              Agences, résidences...
            </li>
          </ul>
          <ul className="one-half">
            <li className={style.guideBullet}>
              <i className="picto-picto_guide_logement" />
              Les pièges à éviter
            </li>
            <li className={style.guideBullet}>
              <i className="picto-picto_guide_logement" />
              Les frais à prévoir
            </li>
          </ul>
        </div>
        <div>
          <Button raised icon="file_download">
            <span>Obtenir le guide logement</span>
          </Button>
        </div>
      </div>
      <div className="one-half">
        <div className={style.guideImg} />
      </div>
    </div>
  </div>
);


export default Guide;
