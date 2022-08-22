import { AdminAuth } from "../database/firebase-admin.js";

class Event {
  constructor(
    eventName,
    startDate,
    endDate,
    eventTitle,
    eventDesc,
    tags,
    attachmentUrls,
    actions,
    additionals,
    posterId,
    posterName
  ) {
    (this.eventName = eventName),
      (this.startDate = startDate),
      (this.endDate = endDate),
      (this.eventTitle = eventTitle),
      (this.eventDesc = eventDesc),
      (this.tags = tags),
      (this.attachmentUrls = attachmentUrls),
      (this.actions = actions),
      (this.additionals = additionals),
      (this.posterId = posterId),
      (this.posterName = posterName);
  }

  createEvent() {}
}
