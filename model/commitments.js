var Schema = {};

Schema.NotificationDetails = new SimpleSchema({
  contactType: {
    type: String,
    label: 'contact type',
    allowedValues: ['text', 'email'],
    optional: true
  },
  frequency: {
    type: String,
    label: 'frequency',
    allowedValues: ['daily', 'weekly'],
    optional: true
  },
  enabled: {
    type: Boolean,
    label: 'enabled'
  },
  createdAt: {
    type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date()};
        } else {
          this.unset();
        }
      }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
});

Schema.Notifications = new SimpleSchema({
  alerts: {
    type: Schema.NotificationDetails,
    label: 'alerts'
  },
  reminders: {
    type: Schema.NotificationDetails,
    label: 'reminders'
  }
});

Schema.Stakes = new SimpleSchema({
  charity: {
    type: String,
    label: "charity_id"
  }, 
  charity_type: {
    type: String,
    label: "charity type",
    allowedValues: ['charity', 'anti-charity']
  }, 
  ammount: {
    type: Number,
    label: "ammount",
    decimal: true
  },
  createdAt: {
    type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date()};
        } else {
          this.unset();
        }
      }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
});

Schema.Commitment = new SimpleSchema({
  owner : {
    type: String,
    label: "owner",
  },
  activity: {
    type: String,
    label: "activity",
    min: 1
  },
  frequency: {
    type: Number,
    label: 'frequency',
    min: 1,
    max: 7
  },
  duration: {
    type: Number,
    label: 'duration',
    min: 1,
    max: 52
  },
  createdAt: {
    type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date()};
        } else {
          this.unset();
        }
      }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
  stakes: {
    type: Schema.Stakes,
    optional: true
  },
  notifications: {
    type: Schema.Notifications
  }
});

Commitments = new Mongo.Collection("commitments");

Commitments.allow({
  insert: function (userId, goal) {
    console.log('inserting' + goal.name);
    return userId && (goal.owner === userId || Roles.userIsInRole(userId, ['manage-users','admin']));
  },
  update: function (userId, goal, fields, modifier) {
    console.log('updating ' + goal.name);
    return userId && (goal.owner === userId || Roles.userIsInRole(userId, ['manage-users','admin']));
  },
  remove: function (userId, goal) {
    console.log('removing ' + goal.name);
    return userId && (goal.owner === userId || Roles.userIsInRole(userId, ['manage-users','admin']));
  }
});