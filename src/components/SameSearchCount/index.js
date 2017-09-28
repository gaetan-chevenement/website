import { SameSearchCountOptions } from '~/content';
import { message } from './style.css';

export default function SameSearchCount({ count }) {
  return (
    <div className={message}>
      <p
        /*eslint-disable react/no-danger*/
        dangerouslySetInnerHTML={{
          __html: SameSearchCountOptions.texts.content.replace('{n}', count),
        }}
      />
    </div>
  );
}
