import { SameSearchCountOptions } from '~/content';
import { message } from './style.css';

export default function SameSearchCount({ count }) {
  return (
    <p class={`${message}`} style="display: flex;">
      <i class="material-icons">timer</i>
      &nbsp;
      <span
        /*eslint-disable react/no-danger*/
        dangerouslySetInnerHTML={{
          __html: SameSearchCountOptions.texts.content(count),
        }}
      />
    </p>
  );
}
