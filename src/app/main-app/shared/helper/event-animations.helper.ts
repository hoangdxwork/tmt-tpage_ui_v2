import { animate, style, transition, trigger } from "@angular/animations";

export const eventFadeStateTrigger = trigger("eventFadeState",
[
    transition(':enter', [
      style({ opacity: 0 }),
      animate('350ms', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      animate('350ms', style({ opacity: 0 }))
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
