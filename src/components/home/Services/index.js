import { Button }           from 'react-toolbox/lib/button/index';
import { ContentServices }  from '~/content.js';
import Service              from './service';
import theme                from './style.css';

export default function Services() {
  return (
    <section>
      <div class="grid-6-large-2 grid-6-small-1 has-gutter">
        {ContentServices.list.map(s =>
          <Service title={s.title} subtitle={s.subtitle} image={s.img} />,
        )}
      </div>
      <div className="button-bar text-center">
        <Button theme={theme}>
          {ContentServices.texts['button-discover']}
        </Button>
      </div>
    </section>
  );
}
