
const Table = require('../models/table')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
const helper = require('./helperFunc')


exports.protectAPI = catchError(async (req, res, next) => {
  const { user } = await helper.testJwtToken(req)
  if (!user) return next(new AppError('Please login', 401))
  req.user = user
  next()

})

exports.user = catchError(async (req, res, next) => {
  const user = req.user
  const { firstName, lastName, img } = user
  res.status(200).json({ success: true, data: { firstName, lastName, img } })
})


exports.tables = catchError(async (req, res, next) => {
  const tables = await Table.find();
  res.status(201).send({ success: true, data: { tables } })
})




exports.add = catchError(async (req, res, next) => {
  const { day, grade, name, doctor, location, start, end } = req.body;
  const table = await Table.findOne({ grade });
  if (!table) return next(new AppError('Incorrect Grade', 401))
  const lectures = table[day]
  if (!lectures) return next(new AppError('Incorrect Date', 401))
  const conflict = helper.conflictTime(new Date(start), new Date(end), lectures)
  if (conflict) return next(new AppError('Time is busy', 401))

  table[day].push({
    name, doctor, location, day,
    start: new Date(start),
    end: new Date(end)
  })
  await table.save()
  res.status(201).send({ success: true, data: { table } })
})

exports.delete = catchError(async (req, res, next) => {
  const id = req.params.id
  const filter = {
    $or: [
      { 'Saturday._id': id },
      { 'Sunday._id': id },
      { 'Monday._id': id },
      { 'Tuesday._id': id },
      { 'Wednesday._id': id },
      { 'Thursday._id': id },
      { 'Friday._id': id }
    ]
  };

  const update = {
    $pull: {
      Saturday: { _id: id },
      Sunday: { _id: id },
      Monday: { _id: id },
      Tuesday: { _id: id },
      Wednesday: { _id: id },
      Thursday: { _id: id },
      Friday: { _id: id }
    }
  };
  const options = { new: true, multi: true };
  const updatedTable = await Table.findOneAndUpdate(filter, update, options);

  if (!updatedTable) return next(new AppError('Error', 401))
  const tables = await Table.find();
  res.status(201).send({ success: true, data: { tables } })
})



exports.getLec = catchError(async (req, res, next) => {
  const id = req.params.id;
  const filter = {
    $or: [
      { 'Saturday._id': id },
      { 'Sunday._id': id },
      { 'Monday._id': id },
      { 'Tuesday._id': id },
      { 'Wednesday._id': id },
      { 'Thursday._id': id },
      { 'Friday._id': id }
    ]
  };
  const projection = {
    _id: 0,
    Saturday: { $elemMatch: { _id: id } },
    Sunday: { $elemMatch: { _id: id } },
    Monday: { $elemMatch: { _id: id } },
    Tuesday: { $elemMatch: { _id: id } },
    Wednesday: { $elemMatch: { _id: id } },
    Thursday: { $elemMatch: { _id: id } },
    Friday: { $elemMatch: { _id: id } }
  };

  const lecture = await Table.findOne(filter, projection);
  if (!lecture) return next(new AppError('Error', 401));
  const extractedLecture = Object.values(lecture.toObject()).find(day => day.length > 0);
  res.status(201).send({ success: true, data: extractedLecture[0] })
})


exports.edit = catchError(async (req, res, next) => {
  const { name, doctor, location, start, end, day, _id } = req.body;
  const filter = {
    $or: [
      { 'Saturday._id': _id },
      { 'Sunday._id': _id },
      { 'Monday._id': _id },
      { 'Tuesday._id': _id },
      { 'Wednesday._id': _id },
      { 'Thursday._id': _id },
      { 'Friday._id': _id }
    ]
  };
  const update = {
    $set: {
      [day]: { _id, name, doctor, location, start, end, day },
    }
  };



  const options = { new: true };

  const updatedLecture = await Table.findOneAndUpdate(filter, update, options);
  if (!updatedLecture) return next(new AppError('Error', 401))
  const tables = await Table.find();
  res.status(201).send({ success: true, data: { updatedLecture } })
})





exports.logOut = catchError(async (req, res, next) => {
  const user = req.user
  if (!user) return next(new AppError('You aren\'t register', 401))
  res.cookie('jwt', 'out', helper.cookieOptions).status(201)
    .json({ susses: true, data: "Log out" })
})