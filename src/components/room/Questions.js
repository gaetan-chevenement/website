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
        <div className={`one-half ${style.questionsLeft}`}>
          <Button raised primary icon="question_answer">
            <span>Poser une question</span>
          </Button>
          <Button raised primary icon="local_see">
            <span>Demander une visite</span>
          </Button>
        </div>
        <div className={`one-half ${style.questionsRight}`}>
          <i className={'picto-smartphonecall_64px ' + style.questionsPhone} />
          <div>
            <Button raised icon="phone" href="tel:0033972323102">
              {/* TODO: translate number in french :-) */}
              <span>+33 972 323 102</span>
            </Button>
            <div className={style.questionsCoords}>Du lundi au vendredi de 9h à 18h</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Questions;
