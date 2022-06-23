import { animate, AUTO_STYLE, state, style, transition, trigger } from "@angular/animations";

export const eventFadeStateTrigger = trigger("eventFadeState",
[
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      animate('300ms', style({ opacity: 0 }))
    ])
]);

export const eventReplyCommentTrigger = trigger("eventReplyComment",
[
    transition(':enter', [
      style({ opacity: 0 }),
      animate('500ms', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      animate('500ms', style({ opacity: 0 }))
    ])
]);

export const eventCollapTrigger = trigger('openCollapse', [
  state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
  state('true', style({ height: '0', visibility: 'hidden' })),
  transition('false => true', animate(300 + 'ms ease-in')),
  transition('true => false', animate(300 + 'ms ease-out'))
])
