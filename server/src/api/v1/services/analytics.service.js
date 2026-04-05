const Entry = require("../models/entry.model");

const getSummary = async (query) => {
  const match = { isDeleted: false };

  if (query.from || query.to) {
    match.date = {};
    if (query.from) match.date.$gte = new Date(query.from);
    if (query.to)   match.date.$lte = new Date(query.to);
  }

  const [totals, byCategory, byMonth] = await Promise.all([

    // total income vs expense
    Entry.aggregate([
      { $match: match },
      { $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      }},
    ]),

    // breakdown by category
    Entry.aggregate([
      { $match: match },
      { $group: {
        _id: { type: "$type", category: "$category" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      }},
      { $sort: { total: -1 } },
    ]),

    // monthly trend — last 12 months
    Entry.aggregate([
      { $match: match },
      { $group: {
        _id: {
          year:  { $year: "$date" },
          month: { $month: "$date" },
          type:  "$type",
        },
        total: { $sum: "$amount" },
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  // shape the totals into a clean object
  const summary = { income: 0, expense: 0, net: 0 };
  totals.forEach(({ _id, total }) => { summary[_id] = total; });
  summary.net = summary.income - summary.expense;

  return { summary, byCategory, byMonth };
};

module.exports = { getSummary };