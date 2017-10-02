/**
 * Created by flb on 17/08/2017.
 */

import { ContentGuide } from '~/content';
import CSS from './style.css';
import { Button } from 'react-toolbox/lib/button/index';

export default function Guide() {
  return (
    <section className={CSS.guide}>
      <img src={ContentGuide.assets.image} />
      <h3>
        {ContentGuide.texts.title}
      </h3>
      {ContentGuide.texts.text.map(p =>
        (<p>
          {p}
        </p>),
      )}
      <Button theme={CSS}>
        {ContentGuide.texts['button-download']}
      </Button>
      <div style={{ clear: 'both' }} />
    </section>
  );
}
