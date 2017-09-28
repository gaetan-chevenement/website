import CSS from './style.css';
import { Button } from 'react-toolbox/lib/button/index';

export function CreateAlertButton() {
  return (
    <Button className={CSS.createAlertButton} icon="add_alert" theme={CSS}>
      Créer une alerte
    </Button>
  );
}
