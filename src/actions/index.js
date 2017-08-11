import { createAction } from 'redux-act';

export const updateRoute       = createAction('Update route');
export const updateBooking     = createAction('Update booking details');
export const fetchRoom         = createAction('Fetch room details from API');
export const receiveRoom       = createAction('Receive room details from API');
export const receiveRooms      = createAction('Receive list of room details from API');
export const receiveApartment  = createAction('Receive apartment details from API');
export const receiveApartments = createAction('Receive list of apartment details from API');
