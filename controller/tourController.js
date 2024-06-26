const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours =catchAsync(async (req, res, next) => {
        // EXECUTE A QUERY
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        
        const tours = await features.query;
/**     .where('duration')
        .equals(5)
        .where('difficulty')
        .equals('easy');
*/
        //SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data:{
                tours
            }
        });
    
}); 

exports.getTourById = catchAsync(async (req, res, next)=>{
        //console.log(req.params);
        
            const tourById = await Tour.findById(req.params.id);
            if(!tourById){
                return next(new AppError('No tour found with that ID', 404));
            }
            //Tour.findOne({ __id: req.params.id})
            res.status(200).json({
                status:'success',
                data:{
                    tourById
                }
            });
        
        //const id = req.params.id * 1;
        
        //const tour= tours.find(el => el.id === id);
    }) ;
//wrap all the async function to this catchAsync func

 
exports.postNewTour = catchAsync(async (req, res, next)=>{
    const newTour = await Tour.create(req.body);

    res.status(200).json({
        status:'success',
        data:{
            tour: newTour
        }
        });
    
});

exports.updateTour= catchAsync(async(req, res, next)=>{
     const update = await Tour.findByIdAndUpdate(req.params.id,req.body,{
         new: true,
         runValidators: true
     });
     if(!update){
        return next(new AppError('No tour found with that ID', 404));
    }
     res.status(200).json({
         status:'success',
         data:{
              update
         }
     });
    
    
 }); 

exports.deleteTour= catchAsync(async(req, res, next)=>{
        const deleteTour = await Tour.findByIdAndDelete(req.params.id);
        if(!deleteTour){
            return next(new AppError('No tour found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
});

exports.getStatTour =catchAsync(async (req, res, next) => {
    
        const stats = await Tour.aggregate([
            {
                $match:{ ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group:{
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);
        res.status(200).json({
            status:'success',
            data:{
                 stats
            }
        });
    }); 

exports.getMonthlyPlan =catchAsync(async (req, res, next) =>{

        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),           
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTourStarts: { $sum: 1}
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: 1}//1_> ascending -1 desc
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
});