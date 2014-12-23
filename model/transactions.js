var Schema = {};

Schema.Transaction = new SimpleSchema({
  commitment: {
    type: String,
    label: 'commitment_id'
  },
  reportingPeriod: {
    type: String,
    label: 'reporting period start date',
  },
  transactionDate: {
    type: String,
    label: 'scheduled transaction date'
  },
  pending: {
    type: Boolean,
    label: 'pending'
  },
  charity:{
    type: String,
    label: 'charity_id processed',
    optional: true
  },
  ammount: {
    type: Number,
    label: 'ammount processed',
    optional: true
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

Transactions = new Mongo.Collection("transactions");
Transactions.attachSchema(Schema.Transaction);

Transactions.allow({
  insert: function (userId, transaction) {
    console.log('inserting transaction for ' + transaction.commitment);
    return false;
  },
  update: function (userId, transaction, fields, modifier) {
    console.log('updating transaction for ' + transaction.commitment);
    return false;
  },
  remove: function (userId, transaction) {
    console.log('removing transaction for ' + transaction.commitment);
    return false;
  }
});