/**
 * Created by flb on 17/08/2017.
 */
import { ContentTowns } from '~/content';
import Town from './town';

export default function Towns() {
  return (
    <section class="grid-3-large-1 has-gutter">
      {ContentTowns.list.map(town =>
        <Town name={town.name} roomsCount={town.roomsCount} image={town.image} />,
      )}
    </section>
  );
}
