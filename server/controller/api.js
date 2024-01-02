
const Table = require('../models/table')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
const helper = require('./helperFunc')


exports.protectAPI = catchError(async (req, res, next) => {
  console.log('🚀 ~ req:', req.cookies)
  const {user} = await helper.testJwtToken(req)
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
  // const grades = ["first", "second", "third", "fourth"];
  // grades.map(async (grade) => {
  //   await Table.create({ grade });
  // });
  const tables = await Table.find();
  res.status(201).send({ success: true, data: { tables } })
})


exports.delete = catchError(async (req, res, next) => {
  const id = req.params.id
  const { deletedCount } = await Table.deleteOne({ _id: id })

  const result = await Table.updateMany(
    {},
    {
      $pull: {
        saturday: { _id: id },
        sunday: { _id: id },
        monday: { _id: id },
        tuesday: { _id: id },
        wednesday: { _id: id },
        thursday: { _id: id },
      },
    }
  );
  res.status(201).send({ success: true })
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
    name, doctor, location,
    start: new Date(start),
    end: new Date(end)
  })
  await table.save()
  res.status(201).send({ success: true, data: { table } })
})


exports.edit = catchError(async (req, res, next) => {
  const id = req.params.id
  const table = await Table.findOne({ grade: "first" });
  // table.saturday.push({
  //   name: "sunday", location: "dddd", doctor: "jsss",
  //   start: new Date(), end: new Date()
  // })
  // await table.save()
  res.status(201).send({ success: true, data: { table } })
})





