import { Button }             from 'react-toolbox/lib/button';
import style from '~/containers/room/style.css';

const Questions = () => (
  <div className={style.questions}>
    <div className="content">
      <h2 className="text-center">Une question ?</h2>
      <div className={['text-center', style.questionsSubtitle].join(' ')}>
        Notre équipe sera ravie de vous aider !
      </div>
      <div className="grid-2">
        <div className={'one-half ' + style.questionsButtons}>
          <Button className={style.questionsButton}>
            <i className="icon-24 picto-questionmark" />
            <span>Poser une question</span>
          </Button>
          <Button className={style.questionsButton}>
            <i className="icon-24 picto-photocamera" />
            <span>Demander une visite</span>
          </Button>
        </div>
        <div className={'one-half ' + style.questionsInfos}>
          <i className={'picto-smartphonecall_64px ' + style.questionsInfosPicto} />
          <div className={style.questionsInfosText}>
            <div className={style.questionsPhone}>0 972 323 102</div>
            <div className={style.questionsCoords}>International +33 972 323 102</div>
            <div className={style.questionsCoords}>Du lundi au vendredi de 9h à 18h</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Questions;

