import { Text } from 'preact-i18n';

export default function Heading({ room, type }) {
  return (
    <h1 class="grid has-gutter-xl">
      <div class="two-thirds">
        <Text id="title">Booking {type} for room</Text><br />
        <em>{room.name}</em>
      </div>
      <div class="one-third">
        <img src={room['pic 0 url']} alt="Picture of the room" style="width: 100%" />
      </div>
    </h1>
  );
}
