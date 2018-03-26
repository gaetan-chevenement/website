/**
 * Created by flb on 17/08/2017.
 */

import { ContentGuide } from '~/content';
import style from './style.css';
import { Button } from 'react-toolbox/lib/button/index';

export default function Guide() {
  return (
    <section className={style.guide}>
      <img src={ContentGuide.img} />
      <h2>
        {ContentGuide.texts.title}
      </h2>
      {ContentGuide.texts.text.map((p) => (
        <p>{p}</p>
      ))}
      <Button
        href="http://forms.chez-nestor.com/cheznestor/HousingGuide"
        target="_blank"
        theme={style}
      >
        {ContentGuide.texts['button-download']}
      </Button>
      <div style={{ clear: 'both' }} />
    </section>
  );
}
